import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import AccessLayout from '../../components/AccessLayout';
import PasswordField from '../../components/PasswordField';
import ErrorAlert from '../../components/ErrorAlert';
import { describeApiError } from '../../lib/apiError';

// Mesmas regras do RegisterRequestValidator (EID.Application). A API valida de novo.
const passwordRules = [
  { id: 'length', label: 'De 8 a 100 caracteres', test: (v) => v.length >= 8 && v.length <= 100 },
  { id: 'upper', label: 'Uma letra maiúscula', test: (v) => /[A-Z]/.test(v) },
  { id: 'digit', label: 'Um número', test: (v) => /[0-9]/.test(v) },
  { id: 'special', label: 'Um caractere especial', test: (v) => /[^a-zA-Z0-9]/.test(v) }
];

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(describeApiError(err));
      setSubmitting(false);
    }
  };

  return (
    <AccessLayout>
      <form className="access-form" onSubmit={handleSubmit} noValidate>
        <header>
          <h1>Criar conta</h1>
          <p>Novas contas entram com o perfil Visualizador.</p>
        </header>

        <ErrorAlert error={error} />

        <div className="field">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={150}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={200}
            required
          />
        </div>

        <div className="field">
          <PasswordField
            id="password"
            label="Senha"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            describedBy="password-rules"
          />
          <ul id="password-rules" className="rules" aria-label="Requisitos da senha">
            {passwordRules.map((rule) => {
              const met = rule.test(password);
              return (
                <li key={rule.id} data-met={met}>
                  {rule.label}
                  <span className="visually-hidden">{met ? ' (atendido)' : ' (pendente)'}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <button type="submit" className="button button-primary button-block" disabled={submitting}>
          {submitting ? 'Criando conta…' : 'Criar conta'}
        </button>

        <p className="access-switch">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </AccessLayout>
  );
}
