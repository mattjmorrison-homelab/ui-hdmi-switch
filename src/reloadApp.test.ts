import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reloadApp } from './reloadApp';

describe('reloadApp', () => {
  const unregister = vi.fn().mockResolvedValue(undefined);
  const getRegistrations = vi.fn().mockResolvedValue([{ unregister }]);
  const cachesDelete = vi.fn().mockResolvedValue(true);
  const cachesKeys = vi.fn().mockResolvedValue(['cache-v1']);
  const reload = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('navigator', { serviceWorker: { getRegistrations } });
    vi.stubGlobal('caches', { keys: cachesKeys, delete: cachesDelete });
    vi.stubGlobal('window', { location: { reload } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    unregister.mockClear();
    getRegistrations.mockClear();
    cachesDelete.mockClear();
    cachesKeys.mockClear();
    reload.mockClear();
  });

  it('unregisters every service worker, clears every cache, and reloads', async () => {
    await reloadApp();

    expect(getRegistrations).toHaveBeenCalled();
    expect(unregister).toHaveBeenCalled();
    expect(cachesKeys).toHaveBeenCalled();
    expect(cachesDelete).toHaveBeenCalledWith('cache-v1');
    expect(reload).toHaveBeenCalled();
  });
});
