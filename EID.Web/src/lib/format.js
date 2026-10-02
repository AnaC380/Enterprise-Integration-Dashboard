const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const compactCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const date = new Intl.DateTimeFormat('pt-BR');
const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export const formatCurrency = (value) => currency.format(value ?? 0);
export const formatCompactCurrency = (value) => compactCurrency.format(value ?? 0);
export const formatDate = (value) => (value ? date.format(new Date(value)) : '—');
export const formatTime = (value) => (value ? time.format(new Date(value)) : '—');

// Espelha o enum ContractStatus do EID.Domain (serializado como número).
export const contractStatus = {
  0: { label: 'Rascunho', tone: 'draft' },
  1: { label: 'Ativo', tone: 'ok' },
  2: { label: 'Expirado', tone: 'warn' },
  3: { label: 'Cancelado', tone: 'danger' },
};
