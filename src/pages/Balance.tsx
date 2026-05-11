import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBalance } from '../api/walletApi';
import { useAuthStore } from '../store/authStore';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#080b12;color:#f5f7ff;min-height:100vh}
  .page-wrap{min-height:100vh;background:radial-gradient(ellipse at 30% 30%,rgba(155,109,255,0.09) 0%,transparent 50%),radial-gradient(ellipse at 70% 70%,rgba(79,124,255,0.07) 0%,transparent 50%),#080b12;display:flex;flex-direction:column}
  .topbar{display:flex;align-items:center;gap:14px;padding:20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(8,11,18,0.85);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100}
  .back-btn{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#f5f7ff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .back-btn:hover{background:rgba(255,255,255,0.12)}
  .page-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem}
  .center{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 20px}
  .balance-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:28px;padding:52px 44px;width:100%;max-width:420px;text-align:center;box-shadow:0 8px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.07)}
  .balance-icon{font-size:2.5rem;margin-bottom:20px}
  .label{font-size:.75rem;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(245,247,255,0.38);margin-bottom:16px}
  .amount{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2.4rem,8vw,3.6rem);background:linear-gradient(135deg,#4f7cff,#9b6dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;line-height:1}
  .amount-sub{font-size:.82rem;color:rgba(245,247,255,0.35);margin-bottom:36px}
  .refresh-btn{padding:11px 28px;border-radius:12px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:#f5f7ff;font-family:'DM Sans',sans-serif;font-size:.85rem;cursor:pointer;transition:background .2s}
  .refresh-btn:hover{background:rgba(255,255,255,0.13)}
  .error-box{padding:12px 16px;border-radius:12px;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25);color:#f87171;font-size:.85rem;margin-top:14px;text-align:center}
  .skeleton{width:180px;height:52px;border-radius:12px;background:linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;margin:0 auto 8px}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
`;

export default function Balance() {
  const navigate = useNavigate();
  const { user } = useAuthStore() as any;
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchBalance = async () => {
    if (!user?.id) { setError('User not found'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const res = await getBalance(user.id);
      setBalance(res.data.balance ?? res.data);
    } catch (err: any) {
      setError(err.response?.data ?? 'Failed to fetch balance');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  useEffect(() => { fetchBalance(); }, []);

  return (
    <div className="page-wrap">
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
        <span className="page-title">Balance</span>
      </div>
      <div className="center">
        <div className="balance-card">
          <div className="balance-icon">📊</div>
          <div className="label">Current Balance</div>
          {loading ? (
            <div className="skeleton" />
          ) : error ? (
            <div className="error-box">{error}</div>
          ) : (
            <>
              <div className="amount">
                ₹{(balance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="amount-sub">Available in your eWallet</div>
            </>
          )}
          <button className="refresh-btn" onClick={fetchBalance} disabled={loading}>
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
}