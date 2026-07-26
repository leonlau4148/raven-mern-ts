import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/axios';
import { Brand, Button, Field, FormError } from '../components/ui';

function Login() {
  // One useState per field — like TextEditingControllers, but the
  // value lives in state and the input mirrors it ("controlled input").
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate(); // the Navigator.push equivalent

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser's default full-page form reload
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); // context.go('/') equivalent
    } catch (err) {
      // Axios puts the server's JSON body on err.response.data
      setError(getErrorMessage(err, 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-[380px] rounded-card border border-border bg-surface p-9">
        <Brand />
        <h1 className="mt-1.5 mb-6 font-display text-[1.6rem] font-semibold tracking-[-0.02em]">
          Sign in
        </h1>

        {error && <FormError>{error}</FormError>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" disabled={loading} className="mt-1.5">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.85rem] text-muted">
          No account yet?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
