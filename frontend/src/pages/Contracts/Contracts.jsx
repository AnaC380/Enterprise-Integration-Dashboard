import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getContracts } from '../../services/contractService';

const statusLabel = { 0: 'Rascunho', 1: 'Ativo', 2: 'Expirado', 3: 'Cancelado' };
const statusStyle = {
    0: { backgroundColor: '#1e3a5f', color: '#93c5fd' },
    1: { backgroundColor: '#166534', color: '#86efac' },
    2: { backgroundColor: '#713f12', color: '#fde68a' },
    3: { backgroundColor: '#7f1d1d', color: '#fca5a5' },
};

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getContracts()
            .then(setContracts)
            .catch(() => setError('Erro ao carregar contratos.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <h2 style={styles.title}>Contratos <span style={styles.badge}>Oracle</span></h2>
                {loading && <p style={styles.info}>Carregando...</p>}
                {error && <p style={styles.error}>{error}</p>}
                {!loading && !error && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Título</th>
                                <th style={styles.th}>Fornecedor</th>
                                <th style={styles.th}>Valor</th>
                                <th style={styles.th}>Início</th>
                                <th style={styles.th}>Fim</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.length === 0 ? (
                                <tr><td colSpan={6} style={styles.empty}>Nenhum contrato cadastrado.</td></tr>
                            ) : (
                                contracts.map((c) => (
                                    <tr key={c.id}>
                                        <td style={styles.td}>{c.title}</td>
                                        <td style={styles.td}>{c.supplierName}</td>
                                        <td style={styles.td}>R$ {c.value.toLocaleString('pt-BR')}</td>
                                        <td style={styles.td}>{new Date(c.startDate).toLocaleDateString('pt-BR')}</td>
                                        <td style={styles.td}>{new Date(c.endDate).toLocaleDateString('pt-BR')}</td>
                                        <td style={styles.td}>
                                            <span style={{ ...styles.badge2, ...statusStyle[c.status] }}>
                                                {statusLabel[c.status]}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a' },
    content: { padding: '40px 24px' },
    title: { color: '#fff', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' },
    badge: { backgroundColor: '#f97316', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
    badge2: { padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
    info: { color: '#94a3b8' },
    error: { color: '#ef4444' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    th: { backgroundColor: '#1e293b', color: '#94a3b8', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
    td: { color: '#e2e8f0', padding: '12px 16px', borderBottom: '1px solid #1e293b', fontSize: '14px' },
    empty: { color: '#94a3b8', padding: '24px', textAlign: 'center' },
};