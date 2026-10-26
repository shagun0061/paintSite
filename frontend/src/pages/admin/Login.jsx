import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { Logo } from '../../components/layout/Logo.jsx';
import { Seo } from '../../components/layout/Seo.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, fieldProps } from '../../components/ui/Field.jsx';
import { Alert, Spinner } from '../../components/ui/States.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { user, checking, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (checking) return <Spinner className="min-h-dvh" />;
  const to = location.state?.from?.pathname || '/admin';
  if (user) return <Navigate to={to} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    if (!values.email || !values.password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await login(values);
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message);
      setValues((v) => ({ ...v, password: '' }));
    } finally {
      setBusy(false);
    }
  }

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <div className="flex min-h-dvh items-center justify-center bg-beige-50 px-4 py-12">
      <Seo title="Owner sign in" noindex />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="card p-6 sm:p-8">
          <h1 className="font-sans text-2xl font-extrabold">Sign in to your dashboard</h1>
          <p className="mt-1 text-navy-600">Manage projects, reviews, enquiries and business details.</p>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            {error && <Alert tone="error">{error}</Alert>}
            <Field id="email" label="Email">
              <input {...fieldProps('email')} type="email" autoComplete="username" value={values.email} onChange={set('email')} autoFocus />
            </Field>
            <Field id="password" label="Password">
              <input {...fieldProps('password')} type="password" autoComplete="current-password" value={values.password} onChange={set('password')} />
            </Field>
            <Button type="submit" className="w-full" size="lg" icon={LogIn} loading={busy}>
              Sign in
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-navy-500">
          <Link to="/" className="hover:text-navy-900">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
