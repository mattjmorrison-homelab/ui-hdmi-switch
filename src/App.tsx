import { useState } from 'react';
import { AlertTriangle, Check, Loader2, RefreshCw } from 'lucide-react';
import { useCurrentInputQuery, useSetInputMutation } from './graphql/generated';
import type { HdmiInput } from './graphql/generated';
import { INPUTS } from './inputs';
import { errorMessage } from './errorMessage';
import './App.css';

function App() {
  const { data, loading, error, refetch } = useCurrentInputQuery();
  const [setInput, { loading: switching }] = useSetInputMutation();

  // Tracks the result of the most recent successful `setInput` mutation so it
  // can override the initial query's answer without re-fetching. Falls back
  // to the query's value until we have one of our own.
  const [switchedTo, setSwitchedTo] = useState<HdmiInput | null>(null);
  const [pendingInput, setPendingInput] = useState<HdmiInput | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const activeInput = switchedTo ?? data?.currentInput ?? null;

  const handleSelect = async (value: HdmiInput) => {
    if (switching || value === activeInput) {
      return;
    }

    setSwitchError(null);
    setPendingInput(value);

    try {
      const result = await setInput({ variables: { input: value } });
      // The mutation's return value is the source of truth for the new
      // state, not an assumption that the request we sent "worked".
      if (result.data?.setInput) {
        setSwitchedTo(result.data.setInput);
      } else {
        setSwitchError('The switch did not confirm the change. Please try again.');
      }
    } catch (err) {
      setSwitchError(errorMessage(err));
    } finally {
      setPendingInput(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>HDMI Switch</h1>
      </header>

      <main className="app-main">
        {loading && (
          <div className="status-panel" role="status">
            <Loader2 className="spin" size={32} aria-hidden="true" />
            <p>Loading current input…</p>
          </div>
        )}

        {!loading && error && (
          <div className="status-panel status-panel--error" role="alert">
            <AlertTriangle size={32} aria-hidden="true" />
            <p>Couldn&apos;t reach the HDMI switch.</p>
            <p className="status-detail">{errorMessage(error)}</p>
            <button type="button" className="retry-button" onClick={() => refetch()}>
              <RefreshCw size={16} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="input-grid" role="group" aria-label="HDMI inputs">
              {INPUTS.map(({ value, label, icon: Icon }) => {
                const isActive = value === activeInput;
                const isPending = value === pendingInput;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`input-button${isActive ? ' input-button--active' : ''}`}
                    onClick={() => handleSelect(value)}
                    disabled={switching}
                    aria-pressed={isActive}
                  >
                    <span className="input-button__icon">
                      {isPending ? (
                        <Loader2 className="spin" size={28} aria-hidden="true" />
                      ) : (
                        <Icon size={28} aria-hidden="true" />
                      )}
                    </span>
                    <span className="input-button__label">{label}</span>
                    {isActive && !isPending && (
                      <span className="input-button__badge">
                        <Check size={14} aria-hidden="true" />
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {switchError && (
              <div className="status-panel status-panel--error status-panel--inline" role="alert">
                <AlertTriangle size={20} aria-hidden="true" />
                <p>{switchError}</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
