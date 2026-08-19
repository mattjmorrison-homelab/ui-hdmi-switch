import { useState } from 'react';
import { AlertTriangle, Check, Loader2, RefreshCw } from 'lucide-react';
import { useInputsQuery, useSetInputMutation, type InputsQuery } from './graphql/generated';
import type { HdmiInput } from './graphql/generated';
import { ICONS, DEFAULT_ICON } from './inputs';
import { errorMessage } from './errorMessage';
import './App.css';

type Input = InputsQuery['inputs'][number];

function App() {
  const { data, loading, error, refetch } = useInputsQuery();
  const [setInput, { loading: switching }] = useSetInputMutation();

  // Tracks the result of the most recent successful `setInput` mutation so
  // it can override the query's `isActive` flags without a refetch. Falls
  // back to each input's own `isActive` field until we have one of our own.
  const [switchedTo, setSwitchedTo] = useState<HdmiInput | null>(null);
  const [pendingInput, setPendingInput] = useState<HdmiInput | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const inputs = data?.inputs ?? [];
  const [heroInput, ...pairedInputs] = inputs;

  const handleSelect = async (value: HdmiInput, isCurrentlyActive: boolean) => {
    if (switching || isCurrentlyActive) {
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

  const renderButton = (input: Input) => {
    const isActive = switchedTo ? input.value === switchedTo : input.isActive;
    const isPending = input.value === pendingInput;
    const Icon = ICONS[input.icon] ?? DEFAULT_ICON;
    return (
      <button
        key={input.value}
        type="button"
        title={input.hoverText}
        className={`input-button${isActive ? ' input-button--active' : ''}`}
        onClick={() => handleSelect(input.value, isActive)}
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
        <span className="input-button__label">{input.label}</span>
        {isActive && !isPending && (
          <span className="input-button__badge">
            <Check size={14} aria-hidden="true" />
            Active
          </span>
        )}
      </button>
    );
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
            <div className="input-layout" role="group" aria-label="HDMI inputs">
              {heroInput && (
                <div className="input-row input-row--hero">{renderButton(heroInput)}</div>
              )}
              {pairedInputs.length > 0 && (
                <div className="input-grid">{pairedInputs.map(renderButton)}</div>
              )}
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
