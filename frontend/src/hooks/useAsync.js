import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async loader (which receives `{ signal }`) whenever `deps` change.
 * Previous data is kept while reloading to avoid layout flashes.
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    loader({ signal: controller.signal }).then(
      (data) => setState({ data, error: null, loading: false }),
      (error) => {
        if (error.name !== 'AbortError') setState((s) => ({ ...s, error, loading: false }));
      },
    );
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const setData = useCallback(
    (updater) => setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })),
    [],
  );

  return { ...state, reload, setData };
}
