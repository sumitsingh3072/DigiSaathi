import { useEffect, useState } from 'react';
import { apiFetch, authHeaders } from '../../lib/api';

export default function DashboardSummary() {
  const [summary, setSummary] = useState<{ total_spending: number; spending_by_category: Record<string, number> } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Not logged in');
      return;
    }
    apiFetch<{ total_spending: number; spending_by_category: Record<string, number> }>('/api/v1/dashboard/summary', {
      headers: authHeaders(token)
    })
      .then(setSummary)
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError('Failed to fetch dashboard');
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!summary) return <p>Loading...</p>;
  return (
    <div>
      <h2>Dashboard Summary</h2>
      <p>Total Spending: ₹{summary.total_spending}</p>
      <h3>Spending by Category:</h3>
      <ul>
        {Object.entries(summary.spending_by_category).map(([cat, amt]) => (
          <li key={cat}>{cat}: ₹{amt}</li>
        ))}
      </ul>
    </div>
  );
}
