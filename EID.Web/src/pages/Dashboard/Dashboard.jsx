import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { useApiData } from '../../hooks/useApiData';
import { getSuppliers } from '../../services/supplierService';
import { getContracts } from '../../services/contractService';
import SourceTag from '../../components/SourceTag';
import ErrorAlert from '../../components/ErrorAlert';
import { describeApiError } from '../../lib/apiError';
import {
  contractStatus,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatTime
} from '../../lib/format';

const DAY = 24 * 60 * 60 * 1000;
const roleLabels = { Viewer: 'Visualizador', Admin: 'Administrador' };

export default function Dashboard() {
  const { user } = useAuth();
  const load = useCallback(() => Promise.all([getSuppliers(), getContracts()]), []);
  const { data, error, loading, reload } = useApiData(load);

  const summary = useMemo(() => (data ? summarize(data[0], data[1]) : null), [data]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Visão geral</h1>
          <p>Indicadores lidos pela EID.Api nos dois bancos integrados.</p>
        </div>
      </header>

      <section className="section" aria-labelledby="oracle-title">
        <div className="section-head">
          <h2 id="oracle-title">Fornecedores e contratos</h2>
          <SourceTag source="oracle" />
        </div>

        {loading && <LedgerSkeleton />}

        {error && (
          <>
            <ErrorAlert error={describeApiError(error)} />
            <div>
              <button type="button" className="button button-quiet" onClick={reload}>
                Tentar novamente
              </button>
            </div>
          </>
        )}

        {summary && summary.suppliersTotal === 0 && summary.contractsTotal === 0 && (
          <div className="state">
            <strong>Ainda não há fornecedores nem contratos no Oracle.</strong>
            <p>
              Os indicadores aparecem assim que as tabelas SUPPLIERS e CONTRACTS tiverem registros.
              Esta tela apenas lê os dados; o cadastro é feito diretamente no banco.
            </p>
          </div>
        )}

        {summary && (summary.suppliersTotal > 0 || summary.contractsTotal > 0) && (
          <>
            <dl className="ledger">
              <LedgerItem
                label="Fornecedores ativos"
                value={summary.suppliersActive}
                note={`de ${summary.suppliersTotal} cadastrados`}
              />
              <LedgerItem
                label="Contratos ativos"
                value={summary.byStatus[1]}
                note={`de ${summary.contractsTotal} contratos`}
              />
              <LedgerItem
                label="Valor em contratos ativos"
                value={formatCompactCurrency(summary.activeValue)}
                note={formatCurrency(summary.activeValue)}
              />
              <LedgerItem
                label="Vencem em até 30 dias"
                value={summary.endingSoon.length}
                note="contratos ativos"
              />
            </dl>

            <div className="split">
              <div className="section">
                <h3>Próximos vencimentos</h3>
                {summary.upcoming.length === 0 ? (
                  <div className="state">
                    <p>Nenhum contrato ativo com vencimento futuro.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Contrato</th>
                          <th scope="col">Fornecedor</th>
                          <th scope="col">Vence em</th>
                          <th scope="col" className="right">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.upcoming.map((c) => (
                          <tr key={c.id}>
                            <td>{c.title}</td>
                            <td>
                              <Link to={`/contracts?supplier=${c.supplierId}`}>{c.supplierName}</Link>
                            </td>
                            <td className="num nowrap">{formatDate(c.endDate)}</td>
                            <td className="right num nowrap">{formatCurrency(c.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="section">
                <h3>Contratos por status</h3>
                <ul className="status-list">
                  {Object.entries(contractStatus).map(([value, status]) => (
                    <li key={value}>
                      <span className={`badge badge-${status.tone}`}>{status.label}</span>
                      <span className="num">{summary.byStatus[value]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="section" aria-labelledby="session-title">
        <div className="section-head">
          <h2 id="session-title">Sua sessão</h2>
          <SourceTag source="sqlserver" />
        </div>

        <dl className="session">
          <div>
            <dt>Usuário</dt>
            <dd>{user?.name}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{user?.email ?? '—'}</dd>
          </div>
          <div>
            <dt>Perfil</dt>
            <dd>{roleLabels[user?.role] ?? user?.role}</dd>
          </div>
          <div>
            <dt>Token JWT válido até</dt>
            <dd className="num">
              {formatDate(user?.expiresAt)} {formatTime(user?.expiresAt)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function LedgerItem({ label, value, note }) {
  return (
    <div className="ledger-item">
      <dt className="ledger-label">{label}</dt>
      <dd className="ledger-value">{value}</dd>
      <dd className="ledger-note">{note}</dd>
    </div>
  );
}

function LedgerSkeleton() {
  return (
    <div className="ledger" aria-busy="true" aria-label="Carregando indicadores">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="ledger-item">
          <div className="skeleton" style={{ width: '60%' }} />
          <div className="skeleton" style={{ width: '40%', height: 30 }} />
        </div>
      ))}
    </div>
  );
}

function summarize(suppliers, contracts) {
  const now = Date.now();
  const byStatus = { 0: 0, 1: 0, 2: 0, 3: 0 };
  contracts.forEach((c) => {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
  });

  const active = contracts.filter((c) => c.status === 1);
  const future = active
    .filter((c) => new Date(c.endDate).getTime() >= now)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  return {
    suppliersTotal: suppliers.length,
    suppliersActive: suppliers.filter((s) => s.isActive).length,
    contractsTotal: contracts.length,
    byStatus,
    activeValue: active.reduce((sum, c) => sum + Number(c.value ?? 0), 0),
    endingSoon: future.filter((c) => new Date(c.endDate).getTime() - now <= 30 * DAY),
    upcoming: future.slice(0, 5)
  };
}
