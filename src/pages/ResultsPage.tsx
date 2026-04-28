import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiService from '../services/api';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';

export default function ResultsPage() {
  const location = useLocation();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const latestResult = location.state?.result;

  useEffect(() => { apiService.results.getUserResults().then(res => setResults(res.data.data || [])).finally(() => setLoading(false)); }, []);

  if (loading) return <><Navbar /><div className="text-center py-12">Loading...</div></>;

  return (<><Navbar /><div className="container mx-auto px-4 py-8 max-w-4xl"><h1 className="text-4xl font-black mb-6">My Results</h1>{latestResult && <NeoCard className="mb-6 bg-green-100"><p><span className="font-bold">Latest:</span> Score {latestResult.score}/{latestResult.totalPossible} ({latestResult.percentage}%) {latestResult.passed ? 'Passed' : 'Failed'}</p></NeoCard>}{results.length === 0 ? <NeoCard><p>No attempts yet.</p></NeoCard> : results.map(r => (<NeoCard key={r._id} className="mb-4"><div className="flex justify-between"><div><h3 className="text-xl font-black">{r.quizId?.title}</h3><p className="text-sm">{r.quizId?.category} • {r.quizId?.difficulty}</p></div><div className="text-right"><div className="text-2xl font-black">{r.percentage}%</div><div>{r.score}/{r.totalPossibleScore} pts</div></div></div><div className="text-sm mt-2">Completed: {new Date(r.completedAt).toLocaleDateString()}</div></NeoCard>))}</div></>);
}
