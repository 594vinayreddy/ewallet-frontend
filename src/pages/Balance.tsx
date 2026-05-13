import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getBalance } from '../api/walletApi';
import { useAuthStore } from '../store/authStore';

export default function Balance() {

  const navigate = useNavigate();

  const { user } = useAuthStore() as any;

  const userId = user?.id;

  const {
    data: balance,
    isLoading,
    isError,
    error,
  } = useQuery<number>({
    queryKey: ['balance', userId],

    queryFn: () => getBalance(userId),

    enabled: !!userId,

    retry: 1,
  });

  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        User not logged in
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        Loading balance...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          padding: '2rem',
          color: 'red',
        }}
      >
        Failed to load balance
        <br />
        {String((error as any)?.message || error)}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020817',
        color: 'white',
      }}
    >

      {/* ── Topbar ───────────────────────────────────── */}

      <div
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '0 34px',
          borderBottom:
            '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(2,8,23,0.92)',
          backdropFilter: 'blur(12px)',
        }}
      >

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            border:
              '1px solid rgba(255,255,255,0.08)',
            background:
              'rgba(255,255,255,0.04)',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.2s',
          }}
        >
          ←
        </button>

        <span
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            letterSpacing: '0.2px',
          }}
        >
          Balance
        </span>

      </div>

      {/* ── Content ─────────────────────────────────── */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 72px)',
          padding: '2rem',
        }}
      >

        <div
          style={{
            width: '340px',
            padding: '2.2rem',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white',
            boxShadow:
              '0 12px 45px rgba(0,0,0,0.4)',
          }}
        >

          <p
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.88)',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.3px',
            }}
          >
            Available Balance
          </p>

          <h1
            style={{
              margin: '1rem 0 0 0',
              fontSize: '3rem',
              fontWeight: 'bold',
              lineHeight: 1.1,
            }}
          >
            ₹
            {Number(balance ?? 0).toLocaleString(
              'en-IN',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </h1>

        </div>

      </div>

    </div>
  );
}