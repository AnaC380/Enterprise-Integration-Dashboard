// Moldura das telas de acesso: à esquerda o esquema da integração, à direita o formulário.
export default function AccessLayout({ children }) {
  return (
    <div className="access">
      <aside className="access-story">
        <div className="wordmark">
          <span className="wordmark-mark">EID</span>
          <span className="wordmark-name">Enterprise Integration Dashboard</span>
        </div>

        <IntegrationSchematic />

        <p className="access-claim">
          <strong>Fornecedores e contratos do Oracle</strong> e <strong>usuários e auditoria do SQL Server</strong>,
          consultados por uma única API autenticada.
        </p>
      </aside>

      <main className="access-panel">{children}</main>
    </div>
  );
}

function IntegrationSchematic() {
  return (
    <svg
      className="schematic"
      viewBox="0 0 560 220"
      role="img"
      aria-label="Esquema: Oracle e SQL Server conectados à EID.Api, que atende o painel web"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#7d8790" />
        </marker>
      </defs>

      <g fontFamily="Archivo, sans-serif">
        <rect x="1" y="20" width="178" height="72" rx="6" fill="none" stroke="#9a6100" strokeWidth="1.5" />
        <rect x="1" y="20" width="5" height="72" fill="#9a6100" />
        <text x="20" y="50" fill="#f3e3c4" fontSize="17" fontWeight="650">Oracle</text>
        <text x="20" y="72" fill="#9aa6b1" fontSize="12">Fornecedores e contratos</text>

        <rect x="1" y="128" width="178" height="72" rx="6" fill="none" stroke="#0e7470" strokeWidth="1.5" />
        <rect x="1" y="128" width="5" height="72" fill="#0e7470" />
        <text x="20" y="158" fill="#c9ebe7" fontSize="17" fontWeight="650">SQL Server</text>
        <text x="20" y="180" fill="#9aa6b1" fontSize="12">Usuários e auditoria</text>

        <rect x="238" y="74" width="132" height="72" rx="6" fill="#222e3a" stroke="#56616c" strokeWidth="1.5" />
        <text x="256" y="104" fill="#ffffff" fontSize="17" fontWeight="650">EID.Api</text>
        <text x="256" y="126" fill="#9aa6b1" fontSize="12">REST + JWT</text>

        <rect x="440" y="74" width="110" height="72" rx="6" fill="none" stroke="#56616c" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="458" y="104" fill="#ffffff" fontSize="17" fontWeight="650">Painel</text>
        <text x="458" y="126" fill="#9aa6b1" fontSize="12">React</text>

        <path d="M179 56 C 212 56, 212 96, 236 100" fill="none" stroke="#7d8790" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <path d="M179 164 C 212 164, 212 124, 236 120" fill="none" stroke="#7d8790" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <path d="M370 110 L 438 110" fill="none" stroke="#7d8790" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      </g>
    </svg>
  );
}
