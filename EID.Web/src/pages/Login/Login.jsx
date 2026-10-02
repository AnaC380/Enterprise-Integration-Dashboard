import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import AccessLayout from '../../components/AccessLayout';
import PasswordField from '../../components/PasswordField';
import ErrorAlert from '../../components/ErrorAlert';
import { describeApiError } from '../../lib/apiError';

export default function Login() {
  const { user, notice, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const destination = location.state?.from ?? '/dashboard';

  if (user) {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(describeApiError(err));
      setSubmitting(false);
    }
  };

  return (
    <AccessLayout>
      <form className="access-form" onSubmit={handleSubmit} noValidate>
        <header>
          <h1>Entrar no EID</h1>
          <p>Use o e-mail e a senha cadastrados na plataforma.</p>
        </header>

        {notice === 'expired' && !error && (
          <div className="alert alert-info" role="status">
            Sua sessão expirou. Entre novamente para continuar.
          </div>
        )}

        <ErrorAlert error={error} />

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <PasswordField
          id="password"
          label="Senha"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <button type="submit" className="button button-primary button-block" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="access-switch">
          Ainda não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </AccessLayout>
  );
}
