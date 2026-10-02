import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApiData } from '../../hooks/useApiData';
import { getContracts, getContractsBySupplier } from '../../services/contractService';
import { getSuppliers } from '../../services/supplierService';
import SourceTag from '../../components/SourceTag';
import ErrorAlert from '../../components/ErrorAlert';
import { describeApiError } from '../../lib/apiError';
import { contractStatus, formatCurrency, formatDate } from '../../lib/format';

export default function Contracts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const supplierId = searchParams.get('supplier') ?? '';
  const [status, setStatus] = useState('');

  // Com fornecedor selecionado, usa GET /api/Contract/supplier/{id}; sem filtro, GET /api/Contract.
  const loadContracts = useCallback(
    () => (supplierId ? getContractsBySupplier(supplierId) : getContracts()),
    [supplierId]
  );
  const loadSuppliers = useCallback(() => getSuppliers(), []);

  const contracts = useApiData(loadContracts);
  const suppliers = useApiData(loadSuppliers);

  const visible = useMemo(() => {
    if (!contracts.data) return [];
    return status === '' ? contracts.data : contracts.data.filter((c) => String(c.status) === status);
  }, [contracts.data, status]);

  const total = visible.reduce((sum, c) => sum + Number(c.value ?? 0), 0);

  const changeSupplier = (value) => {
    setSearchParams(value ? { supplier: value } : {});
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="section-head">
            <h1>Contratos</h1>
            <SourceTag source="oracle" />
          </div>
          <p>Contratos lidos da tabela CONTRACTS, com o fornecedor de cada um.</p>
        </div>
      </header>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="supplier-filter">Fornecedor</label>
          <select
            id="supplier-filter"
            className="select"
            value={supplierId}
            onChange={(e) => changeSupplier(e.target.value)}
            disabled={!suppliers.data}
          >
            <option value="">Todos os fornecedores</option>
            {suppliers.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            {Object.entries(contractStatus).map(([value, s]) => (
              <option key={value} value={value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {contracts.data && (
          <span className="count" aria-live="polite">
            {visible.length} de {contracts.data.length} contratos
          </span>
        )}
      </div>

      {contracts.loading && <p aria-live="polite">Carregando contratos…</p>}

      {contracts.error && (
        <>
          <ErrorAlert error={describeApiError(contracts.error)} />
          <div>
            <button type="button" className="button button-quiet" onClick={contracts.reload}>
              Tentar novamente
            </button>
          </div>
        </>
      )}

      {contracts.data && visible.length === 0 && (
        <div className="state">
          <strong>
            {contracts.data.length === 0
              ? supplierId
                ? 'Este fornecedor ainda não tem contratos.'
                : 'Nenhum contrato cadastrado no Oracle.'
              : 'Nenhum contrato com este status.'}
          </strong>
          {(supplierId || status) && (
            <p>
              Ajuste os filtros acima ou{' '}
              <button
                type="button"
                className="button-link"
                onClick={() => {
                  setStatus('');
                  changeSupplier('');
                }}
              >
                limpe todos os filtros
              </button>
              .
            </p>
          )}
        </div>
      )}

      {visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Contrato</th>
                <th scope="col">Fornecedor</th>
                <th scope="col">Vigência</th>
                <th scope="col">Status</th>
                <th scope="col" className="right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => {
                const s = contractStatus[c.status] ?? { label: String(c.status), tone: 'neutral' };
                return (
                  <tr key={c.id}>
                    <td>
                      {c.title}
                      {c.description && <span className="sub">{c.description}</span>}
                    </td>
                    <td>{c.supplierName}</td>
                    <td className="num nowrap">
                      {formatDate(c.startDate)} a {formatDate(c.endDate)}
                    </td>
                    <td>
                      <span className={`badge badge-${s.tone}`}>{s.label}</span>
                    </td>
                    <td className="right num nowrap">{formatCurrency(c.value)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Total dos contratos listados</td>
                <td className="right num">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
