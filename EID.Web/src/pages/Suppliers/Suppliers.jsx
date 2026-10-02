import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../../hooks/useApiData';
import { getSuppliers } from '../../services/supplierService';
import SourceTag from '../../components/SourceTag';
import ErrorAlert from '../../components/ErrorAlert';
import { describeApiError } from '../../lib/apiError';

export default function Suppliers() {
  const load = useCallback(() => getSuppliers(), []);
  const { data: suppliers, error, loading, reload } = useApiData(load);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!suppliers) return [];
    const term = query.trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter((s) =>
      [s.companyName, s.taxId, s.contactEmail].some((v) => v?.toLowerCase().includes(term))
    );
  }, [suppliers, query]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="section-head">
            <h1>Fornecedores</h1>
            <SourceTag source="oracle" />
          </div>
          <p>Cadastro de fornecedores lido da tabela SUPPLIERS.</p>
        </div>
      </header>

      {loading && <p aria-live="polite">Carregando fornecedores…</p>}

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

      {suppliers && suppliers.length === 0 && (
        <div className="state">
          <strong>Nenhum fornecedor cadastrado no Oracle.</strong>
          <p>Quando a tabela SUPPLIERS tiver registros, eles aparecem aqui.</p>
        </div>
      )}

      {suppliers && suppliers.length > 0 && (
        <section className="section">
          <div className="toolbar">
            <div className="field">
              <label htmlFor="supplier-search">Buscar</label>
              <input
                id="supplier-search"
                className="input"
                type="search"
                placeholder="Empresa, CNPJ ou e-mail"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <span className="count" aria-live="polite">
              {filtered.length} de {suppliers.length} fornecedores
            </span>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Empresa</th>
                  <th scope="col">CNPJ</th>
                  <th scope="col">Contato</th>
                  <th scope="col">Situação</th>
                  <th scope="col"><span className="visually-hidden">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Nenhum fornecedor corresponde à busca.</td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td>{s.companyName}</td>
                      <td className="num">{s.taxId}</td>
                      <td>
                        {s.contactEmail}
                        {s.contactPhone && <span className="sub num">{s.contactPhone}</span>}
                      </td>
                      <td>
                        <span className={`badge ${s.isActive ? 'badge-ok' : 'badge-neutral'}`}>
                          {s.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="right">
                        <Link to={`/contracts?supplier=${s.id}`}>Ver contratos</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
