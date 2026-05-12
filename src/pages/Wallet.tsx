import { useQuery } from '@tanstack/react-query';
import { getBalance, getWallet, getHistory } from '../api/walletApi';
import type { Wallet, WalletTransactionDTO } from '../api/walletApi';
import { useAuthStore } from '../store/authStore';

export default function WalletPage() {
  const { user } = useAuthStore() as any;
  const userId: number = user?.id;

  // ── GET /{userId}/balance ────────────────────────────────────────────────
  const {
    data: balance,
    isLoading: balanceLoading,
  } = useQuery<number>({
    queryKey: ['balance', userId],
    queryFn: () => getBalance(userId),
    enabled: !!userId,
  });

  // ── GET /{userId} ────────────────────────────────────────────────────────
  const {
    data: wallet,
  } = useQuery<Wallet>({
    queryKey: ['wallet', userId],
    queryFn: () => getWallet(userId),
    enabled: !!userId,
  });

  // ── GET /{userId}/history ────────────────────────────────────────────────
  const {
    data: history,
    isLoading: historyLoading,
  } = useQuery<WalletTransactionDTO[]>({
    queryKey: ['wallet-history', userId],
    queryFn: () => getHistory(userId),
    enabled: !!userId,
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Wallet</h1>

      {/* ── Balance Card ── */}
      {balanceLoading && <p>Loading wallet…</p>}

      {!balanceLoading && (
        <div
          style={{
            padding: '2rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            color: 'white',
            maxWidth: '320px',
            marginBottom: '2rem',
          }}
        >
          <p style={{ margin: 0, opacity: 0.8 }}>
            Available Balance
          </p>

          <h2
            style={{
              margin: '0.5rem 0',
              fontSize: '2rem',
            }}
          >
            ₹
            {Number(balance ?? 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </h2>

          <p
            style={{
              margin: 0,
              opacity: 0.6,
              fontSize: '0.875rem',
            }}
          >
            User ID: {wallet?.userId ?? userId}
          </p>
        </div>
      )}

      {/* ── Transaction History ── */}
      <h2 style={{ marginBottom: '1rem' }}>
        History
      </h2>

      {historyLoading && <p>Loading history…</p>}

      {!historyLoading && history?.length === 0 && (
        <p style={{ color: '#6b7280' }}>
          No transactions yet.
        </p>
      )}

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
        }}
      >
        {history?.map((tx) => (
          <li
            key={tx.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>
                {tx.description ?? tx.type}
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#6b7280',
                }}
              >
                {new Date(tx.date).toLocaleDateString(
                  'en-IN',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }
                )}
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  color:
                    tx.status === 'SUCCESS'
                      ? '#16a34a'
                      : tx.status === 'FAILED'
                      ? '#dc2626'
                      : '#d97706',
                }}
              >
                {tx.status}
              </div>
            </div>

            <span
              style={{
                fontWeight: 'bold',
                color:
                  tx.type === 'CREDIT'
                    ? 'green'
                    : 'red',
              }}
            >
              {tx.type === 'CREDIT' ? '+' : '-'}₹
              {Number(tx.amount).toLocaleString('en-IN')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}