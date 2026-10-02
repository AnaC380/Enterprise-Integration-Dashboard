// Traduz erros do axios/EID.Api em mensagens que dizem o que houve e o que fazer.
// Formatos da API: 400 de validação = array de strings; demais erros = { error: "..." }.

export function describeApiError(error) {
  const response = error?.response;

  if (!response) {
    return unavailable();
  }

  const { status, data } = response;
  const apiMessage = typeof data?.error === 'string' ? data.error : null;

  // Sem corpo da API num 5xx: quem respondeu foi o proxy, não a EID.Api.
  if (status >= 500 && !apiMessage) {
    return unavailable();
  }

  if (status === 400) {
    const messages = Array.isArray(data) ? data : [apiMessage ?? 'Revise os dados informados.'];
    return { kind: 'validation', title: 'Revise os campos abaixo.', messages };
  }

  if (status === 401) {
    return { kind: 'unauthorized', title: apiMessage ?? 'Acesso não autorizado.', messages: [] };
  }

  if (status === 403) {
    return { kind: 'forbidden', title: 'Seu perfil não tem acesso a este recurso.', messages: [] };
  }

  if (status === 404) {
    return { kind: 'not-found', title: 'O recurso solicitado não foi encontrado.', messages: [] };
  }

  return {
    kind: 'server',
    title: apiMessage ?? 'O servidor não conseguiu concluir a operação.',
    messages: ['Tente novamente em instantes.'],
  };
}

function unavailable() {
  return {
    kind: 'unavailable',
    title: 'Não foi possível conectar à API.',
    messages: ['Verifique se a EID.Api está em execução e tente novamente.'],
  };
}
