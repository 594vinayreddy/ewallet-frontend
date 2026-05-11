import { useNavigate } from 'react-router-dom';

export default function Navbar({ title = 'eWallet' }: { title?: string }) {
  const navigate = useNavigate();
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 32px',
      background: 'rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
           onClick={() => navigate('/dashboard')}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg,#4f7cff,#9b6dff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, boxShadow: '0 4px 16px rgba(79,124,255,0.35)',
        }}>💳</div>
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem',
          background: 'linear-gradient(90deg,#fff,rgba(155,109,255,.9))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{title}</span>
      </div>
    </nav>
  );
}