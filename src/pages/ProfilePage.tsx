import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import apiService from '../services/api';
import { userSchema } from '../schemas/validation';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, passed: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await apiService.results.getUserResults();
      const results = res.data.data || [];
      const total = results.length;
      const avg = total ? results.reduce((s: number, r: any) => s + r.percentage, 0) / total : 0;
      const passed = results.filter((r: any) => r.percentage >= 60).length;
      setStats({ totalQuizzes: total, averageScore: Math.round(avg), passed });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = userSchema.partial().safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === 'username') fieldErrors.username = issue.message;
        if (path === 'email') fieldErrors.email = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    try {
      await apiService.users.updateProfile(formData);
      toast.success('Profile updated');
      setIsEditing(false);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <NeoCard>
          <h2 className="text-2xl font-black mb-4">My Profile</h2>
          {!isEditing ? (
            <div className="space-y-3">
              <div><span className="font-bold">Username:</span> {user.username}</div>
              <div><span className="font-bold">Email:</span> {user.email}</div>
              <div><span className="font-bold">Role:</span> {user.role}</div>
              <div className="border-t-2 border-black pt-3 mt-3"><div className="font-bold mb-2">Quiz Statistics</div><p>Quizzes taken: {stats.totalQuizzes}</p><p>Average score: {stats.averageScore}%</p><p>Passed: {stats.passed}</p></div>
              <NeoButton onClick={() => setIsEditing(true)}>Edit Profile</NeoButton>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div><label className="block font-bold">Username</label><Input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />{errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}</div>
              <div><label className="block font-bold">Email</label><Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}</div>
              <div className="flex gap-3"><NeoButton type="submit">Save</NeoButton><NeoButton variant="secondary" onClick={() => setIsEditing(false)}>Cancel</NeoButton></div>
            </form>
          )}
        </NeoCard>
      </div>
    </>
  );
}