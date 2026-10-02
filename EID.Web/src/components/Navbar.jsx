import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <span style={styles.brand}>Enterprise Integration Dashboard</span>
            <div style={styles.links}>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/suppliers" style={styles.link}>Fornecedores</Link>
                <Link to="/contracts" style={styles.link}>Contratos</Link>
            </div>
            <div style={styles.user}>
                <span style={styles.userName}>{user?.name}</span>
                <button onClick={handleLogout} style={styles.button}>Sair</button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: '#1e293b',
        color: '#fff',
    },
    brand: { fontWeight: 'bold', fontSize: '16px' },
    links: { display: 'flex', gap: '24px' },
    link: { color: '#94a3b8', textDecoration: 'none', fontSize: '14px' },
    user: { display: 'flex', alignItems: 'center', gap: '12px' },
    userName: { fontSize: '14px', color: '#94a3b8' },
    button: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
    },
};