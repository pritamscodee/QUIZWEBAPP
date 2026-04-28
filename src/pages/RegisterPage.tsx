import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userSchema } from '../schemas/validation';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

export default function RegisterPage() {
  const [form, setForm] = useState<{
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
  }>({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = userSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === 'username') fieldErrors.username = issue.message;
        else if (path === 'email') fieldErrors.email = issue.message;
        else if (path === 'password') fieldErrors.password = issue.message;
        else if (path === 'role') fieldErrors.role = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <NeoCard>
          <h2 className="text-2xl font-black text-center mb-4">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </div>
            <div className="mb-3">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <Label>Role</Label>
              <select
                className="border-4 border-black rounded-xl p-3 w-full font-bold"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as 'user' | 'admin' })
                }
              >
                <option value="user">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <NeoButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </NeoButton>
          </form>
          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="underline">Login</Link>
          </p>
        </NeoCard>
      </div>
    </>
  );
}