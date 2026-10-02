// Lê a expiração (claim "exp") do JWT emitido pela EID.Api.
// Só decodifica o payload para uso na interface; quem valida o token é a API.

export function getTokenExpiry(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json);
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}
