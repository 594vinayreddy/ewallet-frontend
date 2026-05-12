import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transfer } from '../api/transactionApi';
import { useAuthStore } from '../store/authStore';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#080b12;color:#f5f7ff;min-height:100vh}
  .page-wrap{min-height:100vh;background:radial-gradient(ellipse at 20% 20%,rgba(79,124,255,0.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(155,109,255,0.07) 0%,transparent 50%),#080b12;display:flex;flex-direction:column}
  .topbar{display:flex;align-items:center;gap:14px;padding:20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(8,11,18,0.85);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100}
  .back-btn{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#f5f7ff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .back-btn:hover{background:rgba(255,255,255,0.12)}
  .page-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem}
  .center{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 20px}
  .card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px 36px;width:100%;max-width:440px;box-shadow:0 8px 40px rgba(0,0,0,0.4)}
  .card-icon{width:54px;height:54px;border-radius:16px;background:rgba(79,124,255,0.15);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:20px}
  .card h2{font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;margin-bottom:6px}
  .card p{color:rgba(245,247,255,0.42);font-size:.88rem;margin-bottom:32px}
  .field{margin-bottom:20px}
  .field label{display:block;font-size:.72rem;font-weight:500;letter-spacing:1.6px;text-transform:uppercase;color:rgba(245,247,255,0.55);margin-bottom:8px}
  .field input,.field textarea{width:100%;background:rgba(255,255,255,0.065);border:1px solid rgba(255,255,255,0.085);border-radius:13px;padding:13px 16px;color:#f5f7ff;font-family:'DM Sans',sans-serif;font-size:.92rem;outline:none;resize:none}
  .submit-btn{width:100%;padding:14px;border:none;border-radius:13px;background:linear-gradient(135deg,#4f7cff,#9b6dff);color:#fff;font-family:'Syne',sans-serif;font-size:.94rem;font-weight:700;cursor:pointer}
  .success-box{padding:12px 16px;border-radius:12px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80;font-size:.85rem;margin-top:14px;text-align:center}
  .error-box{padding:12px 16px;border-radius:12px;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25);color:#f87171;font-size:.85rem;margin-top:14px;text-align:center}
`;

export default function Transfer() {

  const navigate = useNavigate();

  const { user } = useAuthStore() as any;

  const [form, setForm] = useState({
    receiverUserId: '',
    amount: '',
    description: '',
  });

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

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    setError('');
    setSuccess('');

    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');
    setSuccess('');

    const amt = parseFloat(form.amount);

    if (!form.receiverUserId.trim()) {
      setError('Receiver ID is required');
      return;
    }

    if (!amt || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }

    if (!user?.id) {
      setError('User not logged in');
      return;
    }

    setLoading(true);

    try {

      const payload = {
        senderUserId: Number(user.id),
        receiverUserId: Number(form.receiverUserId),
        amount: amt,
        description: form.description,
      };

      console.log(payload);

      await transfer(payload);

      setSuccess(
        `₹${amt.toLocaleString('en-IN')} transferred successfully!`
      );

      setForm({
        receiverUserId: '',
        amount: '',
        description: '',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Transfer failed'
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
          Transfer
        </span>

      </div>

      <div className="center">

        <div className="card">

          <div className="card-icon">
            ↗️
          </div>

          <h2>Transfer Money</h2>

          <p>
            Send money to another eWallet user
          </p>

          <form onSubmit={handleSubmit}>

            <div className="field">

              <label>Receiver ID</label>

              <input
                name="receiverUserId"
                placeholder="Enter receiver's user ID"
                value={form.receiverUserId}
                onChange={onChange}
                required
              />

            </div>

            <div className="field">

              <label>Amount (₹)</label>

              <input
                name="amount"
                type="number"
                placeholder="Enter amount"
                min="1"
                value={form.amount}
                onChange={onChange}
                required
              />

            </div>

            <div className="field">

              <label>Description (optional)</label>

              <textarea
                name="description"
                placeholder="What's this for?"
                rows={3}
                value={form.description}
                onChange={onChange}
              />

            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Transferring…'
                : 'Transfer →'}
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