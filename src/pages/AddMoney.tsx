import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { credit } from '../api/walletApi';
import { useAuthStore } from '../store/authStore';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#080b12;color:#f5f7ff;min-height:100vh}
  .page-wrap{min-height:100vh;background:radial-gradient(ellipse at 20% 20%,rgba(74,222,128,0.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(79,124,255,0.06) 0%,transparent 50%),#080b12;display:flex;flex-direction:column}
  .topbar{display:flex;align-items:center;gap:14px;padding:20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(8,11,18,0.85);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100}
  .back-btn{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#f5f7ff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .back-btn:hover{background:rgba(255,255,255,0.12)}
  .page-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem}
  .center{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 20px}
  .card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px 36px;width:100%;max-width:440px;box-shadow:0 8px 40px rgba(0,0,0,0.4)}
  .card-icon{width:54px;height:54px;border-radius:16px;background:rgba(74,222,128,0.12);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:20px}
  .card h2{font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;margin-bottom:6px}
  .card p{color:rgba(245,247,255,0.42);font-size:.88rem;margin-bottom:32px}
  .field{margin-bottom:20px}
  .field label{display:block;font-size:.72rem;font-weight:500;letter-spacing:1.6px;text-transform:uppercase;color:rgba(245,247,255,0.55);margin-bottom:8px}
  .field input{width:100%;background:rgba(255,255,255,0.065);border:1px solid rgba(255,255,255,0.085);border-radius:13px;padding:13px 16px;color:#f5f7ff;font-family:'DM Sans',sans-serif;font-size:.92rem;outline:none;transition:border-color .2s,background .2s,box-shadow .2s}
  .field input::placeholder{color:rgba(245,247,255,0.22)}
  .field input:focus{border-color:#4f7cff;background:rgba(79,124,255,0.09);box-shadow:0 0 0 3px rgba(79,124,255,0.16)}
  .quick-amounts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:24px}
  .quick-btn{padding:9px 4px;border-radius:10px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.18);color:#4ade80;font-size:.82rem;font-weight:500;cursor:pointer;transition:background .2s}
  .quick-btn:hover{background:rgba(74,222,128,0.16)}
  .submit-btn{width:100%;padding:14px;border:none;border-radius:13px;background:linear-gradient(135deg,#22c55e,#4ade80);color:#fff;font-family:'Syne',sans-serif;font-size:.94rem;font-weight:700;letter-spacing:.05em;cursor:pointer;box-shadow:0 6px 30px rgba(74,222,128,0.35);transition:transform .18s,box-shadow .18s}
  .submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(74,222,128,0.45)}
  .submit-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .success-box{padding:12px 16px;border-radius:12px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80;font-size:.85rem;margin-top:14px;text-align:center}
  .error-box{padding:12px 16px;border-radius:12px;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25);color:#f87171;font-size:.85rem;margin-top:14px;text-align:center}
`;

const QUICK = [500, 1000, 2000, 5000];

export default function AddMoney() {
  const navigate = useNavigate();

  const { user } = useAuthStore() as any;
  const userId = user?.id;

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);

    return () => {
      document.head.removeChild(s);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const amt = Number(amount);

    if (!amt || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }

    if (!userId) {
      setError('User not found');
      return;
    }

    setLoading(true);

    try {

      console.log('USER ID:', userId);
      console.log('AMOUNT:', amt);

      await credit(userId, amt);

      setSuccess(
        `₹${amt.toLocaleString('en-IN')} added successfully!`
      );

      setAmount('');

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to add money'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="topbar">
        <button
          className="back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ←
        </button>

        <span className="page-title">
          Add Money
        </span>
      </div>

      <div className="center">
        <div className="card">

          <div className="card-icon">💰</div>

          <h2>Add Money</h2>

          <p>
            Top up your eWallet balance instantly
          </p>

          <form onSubmit={handleSubmit}>

            <div className="field">

              <label>Amount (₹)</label>

              <input
                type="number"
                placeholder="Enter amount"
                min="1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                  setSuccess('');
                }}
              />

            </div>

            <div className="quick-amounts">

              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="quick-btn"
                  onClick={() => setAmount(String(q))}
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}

            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Add Money →'}
            </button>

            {success && (
              <div className="success-box">
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}