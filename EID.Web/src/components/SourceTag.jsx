const sources = {
  oracle: { label: 'Oracle', className: 'source source-oracle' },
  sqlserver: { label: 'SQL Server', className: 'source source-sqlserver' }
};

// Indica de qual banco vem o dado exibido: a assinatura visual do EID.
export default function SourceTag({ source }) {
  const { label, className } = sources[source];
  return <span className={className} title={`Dados lidos do ${label}`}>{label}</span>;
}
