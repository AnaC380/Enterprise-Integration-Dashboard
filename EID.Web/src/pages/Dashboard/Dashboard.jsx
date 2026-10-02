import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/useAuth';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <h2 style={styles.title}>Bem-vinda, {user?.name}!</h2>
                <p style={styles.subtitle}>Selecione uma opção no menu para começar.</p>
                <div style={styles.cards}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Oracle DB</h3>
                        <p style={styles.cardText}>Fornecedores e Contratos</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>SQL Server</h3>
                        <p style={styles.cardText}>Usuários e Auditoria</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>JWT Auth</h3>
                        <p style={styles.cardText}>Autenticação segura</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a' },
    content: { padding: '40px 24px' },
    title: { color: '#fff', fontSize: '24px' },
    subtitle: { color: '#94a3b8', marginBottom: '32px' },
    cards: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '24px',
        minWidth: '200px',
        flex: '1',
    },
    cardTitle: { color: '#3b82f6', margin: '0 0 8px' },
    cardText: { color: '#94a3b8', margin: '0', fontSize: '14px' },
};