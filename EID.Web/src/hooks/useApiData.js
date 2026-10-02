import { useEffect, useState } from 'react';

// Carrega dados da API e expõe loading/erro/recarga.
// `load` deve ser estável (useCallback): quando muda, a consulta é refeita.
export function useApiData(load) {
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState({ load: null, nonce: -1, data: null, error: null });

  useEffect(() => {
    let active = true;

    load()
      .then((data) => active && setState({ load, nonce, data, error: null }))
      .catch((error) => active && setState({ load, nonce, data: null, error }));

    return () => {
      active = false;
    };
  }, [load, nonce]);

  const loading = state.load !== load || state.nonce !== nonce;

  return {
    data: loading ? null : state.data,
    error: loading ? null : state.error,
    loading,
    reload: () => setNonce((n) => n + 1)
  };
}
