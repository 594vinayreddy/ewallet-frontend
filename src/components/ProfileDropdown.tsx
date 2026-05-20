import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getWallet } from '../api/walletApi';

interface Props {
  name?: string;
  email?: string;
  userId?: string;
}

export default function ProfileDropdown({
  name = '',
  email = '',
  userId = '',
}: Props) {

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { logout } = useAuthStore();

  useEffect(() => {

    const handler = (e: MouseEvent) => {

      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };

  }, []);

  const showToast = (message: string) => {

    const toast = document.createElement('div');

    toast.innerText = message;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '24px',
      right: '24px',
      background: 'rgba(251,191,36,0.12)',
      border: '1px solid rgba(251,191,36,0.28)',
      color: '#fbbf24',
      padding: '14px 18px',
      borderRadius: '14px',
      fontSize: '.88rem',
      fontFamily: 'DM Sans, sans-serif',
      backdropFilter: 'blur(16px)',
      zIndex: '9999',
      boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      opacity: '0',
      transform: 'translateY(-10px)',
      transition: 'all .25s ease',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
    }, 1800);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2100);
  };

  const handleLogout = () => {

    logout();

    navigate('/');
  };

  const handleChangePin = async () => {

    setOpen(false);

    try {

      const wallet = await getWallet(Number(userId));

      if (!wallet.pin) {

        showToast('PIN is not set. Please set the PIN');

        setTimeout(() => {

          navigate('/set-pin', {
            state: {
              from: '/dashboard',
            },
          });

        }, 2100);

        return;
      }

      navigate('/change-pin');

    } catch (err) {

      console.error(err);

      showToast('Failed to load wallet');

    }
  };

  const initial = name
    ? name[0].toUpperCase()
    : '?';

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
    >

      {/* Avatar button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#4f7cff,#9b6dff)',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1rem',
          fontFamily: 'Syne, sans-serif',
          boxShadow: '0 4px 16px rgba(79,124,255,0.4)',
          transition: 'transform .15s',
        }}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: 240,
            background: 'rgba(12,14,28,0.96)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '8px 0',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            zIndex: 200,
            animation: 'dropIn .2s ease',
          }}
        >

          <style>
            {`
              @keyframes dropIn{
                from{
                  opacity:0;
                  transform:translateY(-8px)
                }
                to{
                  opacity:1;
                  transform:translateY(0)
                }
              }
            `}
          </style>

          {/* User info */}
          <div
            style={{
              padding: '14px 18px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >

            <div
              style={{
                fontWeight: 700,
                fontSize: '.95rem',
                color: '#f5f7ff',
                marginBottom: 3,
              }}
            >
              {name || '—'}
            </div>

            <div
              style={{
                fontSize: '.78rem',
                color: 'rgba(245,247,255,0.45)',
                marginBottom: 3,
              }}
            >
              {email || '—'}
            </div>

            <div
              style={{
                fontSize: '.72rem',
                color: 'rgba(245,247,255,0.28)',
                fontFamily: 'monospace',
              }}
            >
              ID: {userId || '—'}
            </div>

          </div>

          {/* Change PIN */}
          <button
            onClick={handleChangePin}
            style={{
              width: '100%',
              padding: '11px 18px',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              color: '#f5f7ff',
              fontSize: '.85rem',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'none';
            }}
          >
            🔑 Change PIN
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '11px 18px',
              background: 'none',
              border: 'none',
              color: '#ff7070',
              fontSize: '.85rem',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'rgba(255,80,80,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'none';
            }}
          >
            🚪 Logout
          </button>

        </div>
      )}
    </div>
  );
}