import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getSuppliers } from '../../services/supplierService';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getSuppliers()
            .then(setSuppliers)
            .catch(() => setError('Erro ao carregar fornecedores.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <h2 style={styles.title}>Fornecedores <span style={styles.badge}>Oracle</span></h2>
                {loading && <p style={styles.info}>Carregando...</p>}
                {error && <p style={styles.error}>{error}</p>}
                {!loading && !error && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Empresa</th>
                                <th style={styles.th}>CNPJ</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Telefone</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.length === 0 ? (
                                <tr><td colSpan={5} style={styles.empty}>Nenhum fornecedor cadastrado.</td></tr>
                            ) : (
                                suppliers.map((s) => (
                                    <tr key={s.id}>
                                        <td style={styles.td}>{s.companyName}</td>
                                        <td style={styles.td}>{s.taxId}</td>
                                        <td style={styles.td}>{s.contactEmail}</td>
                                        <td style={styles.td}>{s.contactPhone}</td>
                                        <td style={styles.td}>
                                            <span style={s.isActive ? styles.active : styles.inactive}>
                                                {s.isActive ? 'Ativo' : 'Inativo'}
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
    info: { color: '#94a3b8' },
    error: { color: '#ef4444' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    th: { backgroundColor: '#1e293b', color: '#94a3b8', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
    td: { color: '#e2e8f0', padding: '12px 16px', borderBottom: '1px solid #1e293b', fontSize: '14px' },
    empty: { color: '#94a3b8', padding: '24px', textAlign: 'center' },
    active: { backgroundColor: '#166534', color: '#86efac', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
    inactive: { backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
};