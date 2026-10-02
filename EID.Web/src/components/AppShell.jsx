import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { formatTime } from '../lib/format';

const roleLabels = { Viewer: 'Visualizador', Admin: 'Administrador' };

const links = [
  { to: '/dashboard', label: 'Visão geral', origin: 'mixed', hint: 'Oracle e SQL Server' },
  { to: '/suppliers', label: 'Fornecedores', origin: 'oracle', hint: 'Dados do Oracle' },
  { to: '/contracts', label: 'Contratos', origin: 'oracle', hint: 'Dados do Oracle' }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="wordmark">
          <span className="wordmark-mark">EID</span>
          <span className="wordmark-name">Enterprise Integration Dashboard</span>
        </div>

        <nav className="nav" aria-label="Principal">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} title={link.hint}>
              {link.label}
              <span className={`nav-origin nav-origin-${link.origin}`} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="who">
            <strong>{user?.name}</strong>
            <span>{roleLabels[user?.role] ?? user?.role}</span>
            <span>Sessão até {formatTime(user?.expiresAt)}</span>
          </div>
          <button type="button" className="button button-quiet" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
