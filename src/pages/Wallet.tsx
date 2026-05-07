import { useQuery } from '@tanstack/react-query';
import { getBalance, getWalletHistory } from '../api/walletApi';
import type { Wallet } from '../types';

export default function WalletPage() {
  const userId = localStorage.getItem('user_id') ?? '';

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      const res = await getBalance(userId);
      return res.data as Wallet;
    },
    enabled: !!userId,
  });

  const { data: history } = useQuery({
    queryKey: ['wallet-history', userId],
    queryFn: async () => {
      const res = await getWalletHistory(userId);
      return res.data as { date: string; amount: number }[];
    },
    enabled: !!userId,
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Wallet</h1>

      {/* Balance Card */}
      {isLoading && <p>Loading wallet...</p>}
      {wallet && (
        <div style={{
          padding: '2rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          color: 'white',
          maxWidth: '320px',
          marginBottom: '2rem',
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Available Balance</p>
          <h2 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>
            {wallet.currency} {wallet.balance.toLocaleString()}
          </h2>
          <p style={{ margin: 0, opacity: 0.6, fontSize: '0.875rem' }}>User: {wallet.userId}</p>
        </div>
      )}

      {/* Transaction History */}
      <h2>History</h2>
      {history?.length === 0 && <p>No transactions yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history?.map((item, idx) => (
          <li key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <span>{new Date(item.date).toLocaleDateString()}</span>
            <span style={{ color: item.amount >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
              {item.amount >= 0 ? '+' : ''}{item.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}