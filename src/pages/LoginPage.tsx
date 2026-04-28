import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../schemas/validation';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === 'email') fieldErrors.email = issue.message;
        if (path === 'password') fieldErrors.password = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in the store (toast notification)
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <NeoCard>
          <h2 className="text-2xl font-black text-center mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <NeoButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </NeoButton>
          </form>
          <p className="text-center mt-4">No account? <Link to="/register" className="underline">Register</Link></p>
        </NeoCard>
      </div>
    </>
  );
}