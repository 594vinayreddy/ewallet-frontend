import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { debit } from '../api/walletApi';
import { transfer as transferMoney } from '../api/transactionApi';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *,*::before,*::after{
    box-sizing:border-box;
    margin:0;
    padding:0
  }

  body{
    font-family:'DM Sans',sans-serif;
    background:#080b12;
    color:#f5f7ff;
    min-height:100vh
  }

  .page-wrap{
    min-height:100vh;
    background:
      radial-gradient(ellipse at 30% 20%,rgba(74,222,128,0.06) 0%,transparent 50%),
      radial-gradient(ellipse at 70% 80%,rgba(79,124,255,0.06) 0%,transparent 50%),
      #080b12;
    display:flex;
    flex-direction:column
  }

  .topbar{
    display:flex;
    align-items:center;
    gap:14px;
    padding:20px 40px;
    border-bottom:1px solid rgba(255,255,255,0.07);
    background:rgba(8,11,18,0.85);
    backdrop-filter:blur(16px);
    position:sticky;
    top:0;
    z-index:100
  }

  .back-btn{
    width:36px;
    height:36px;
    border-radius:10px;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    color:#f5f7ff;
    font-size:1rem;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    transition:background .2s
  }

  .back-btn:hover{
    background:rgba(255,255,255,0.12)
  }

  .page-title{
    font-family:'Syne',sans-serif;
    font-weight:700;
    font-size:1.05rem
  }

  .center{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    flex:1;
    padding:40px 20px
  }

  .card{
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:24px;
    padding:40px 36px;
    width:100%;
    max-width:440px;
    box-shadow:0 8px 40px rgba(0,0,0,0.4)
  }

  .card-icon{
    width:54px;
    height:54px;
    border-radius:16px;
    background:rgba(74,222,128,0.1);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.5rem;
    margin-bottom:20px
  }

  .card h2{
    font-family:'Syne',sans-serif;
    font-weight:800;
    font-size:1.6rem;
    margin-bottom:6px
  }

  .amount-chip{
    display:inline-block;
    padding:6px 14px;
    border-radius:20px;
    background:rgba(74,222,128,0.1);
    border:1px solid rgba(74,222,128,0.2);
    color:#4ade80;
    font-family:'Syne',sans-serif;
    font-weight:700;
    font-size:1rem;
    margin-bottom:28px
  }

  .card p.sub{
    color:rgba(245,247,255,0.42);
    font-size:.88rem;
    margin-bottom:10px
  }

  .field label{
    display:block;
    font-size:.72rem;
    font-weight:500;
    letter-spacing:1.6px;
    text-transform:uppercase;
    color:rgba(245,247,255,0.55);
    margin-bottom:10px
  }

  .hidden-input{
    position:absolute;
    opacity:0;
    width:1px;
    height:1px;
    pointer-events:none
  }

  /* ── PIN dots ── */

  .pin-row{
    display:flex;
    gap:12px;
    justify-content:center
  }

  .pin-box{
    width:52px;
    height:58px;
    border-radius:13px;
    background:rgba(255,255,255,0.065);
    border:1.5px solid rgba(255,255,255,0.085);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.6rem;
    font-family:'Syne',sans-serif;
    font-weight:700;
    color:#4ade80;
    transition:border-color .2s,background .2s,box-shadow .2s
  }

  .pin-box.active{
    border-color:#4ade80;
    background:rgba(74,222,128,0.07);
    box-shadow:0 0 0 3px rgba(74,222,128,0.14)
  }

  .pin-box.filled{
    border-color:rgba(74,222,128,0.4)
  }

  @keyframes shake{
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }

  .shake{
    animation:shake .35s ease
  }

  /* ── Numpad ── */

  .numpad{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
    margin-top:16px
  }

  .num-btn{
    padding:16px 0;
    border-radius:13px;
    border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.05);
    color:#f5f7ff;
    font-family:'Syne',sans-serif;
    font-size:1.1rem;
    font-weight:700;
    cursor:pointer;
    transition:background .15s,transform .1s,border-color .15s
  }

  .num-btn:hover:not(:disabled){
    background:rgba(255,255,255,0.11);
    transform:scale(1.04)
  }

  .num-btn:active:not(:disabled){
    transform:scale(0.97)
  }

  /* ✕ clear — left of 0 */
  .num-btn.clear-btn{
    color:#f87171;
    border-color:rgba(248,113,113,0.2);
    font-size:.95rem
  }

  .num-btn.clear-btn:hover:not(:disabled){
    background:rgba(248,113,113,0.1);
    border-color:rgba(248,113,113,0.35)
  }

  .num-btn.clear-btn:disabled{
    opacity:.25;
    cursor:not-allowed;
    transform:none
  }

  /* ✓ confirm — right of 0 */
  .num-btn.confirm-btn{
    color:#4ade80;
    border-color:rgba(74,222,128,0.2);
    font-size:1.25rem
  }

  .num-btn.confirm-btn:hover:not(:disabled){
    background:rgba(74,222,128,0.1);
    border-color:rgba(74,222,128,0.35)
  }

  .num-btn.confirm-btn:disabled{
    opacity:.25;
    cursor:not-allowed;
    transform:none
  }

  /* ── Feedback ── */

  .loading-box{
    margin-top:20px;
    text-align:center;
    color:rgba(245,247,255,0.6);
    font-size:.9rem
  }

  .error-box{
    padding:12px 16px;
    border-radius:12px;
    background:rgba(248,113,113,0.1);
    border:1px solid rgba(248,113,113,0.25);
    color:#f87171;
    font-size:.85rem;
    margin-top:20px;
    text-align:center
  }

  @keyframes spin{
    to{ transform:rotate(360deg) }
  }

  .spinner{
    width:18px;
    height:18px;
    border:2px solid rgba(255,255,255,0.3);
    border-top-color:#fff;
    border-radius:50%;
    animation:spin .7s linear infinite;
    display:inline-block;
    vertical-align:middle;
    margin-right:8px
  }
`;

const PIN_LENGTH = 4;

// ── PinInput ───────────────────────────────────────────────────────────────

function PinInput({
  value,
  onChange,
  shake,
  disabled,
  onConfirm,
}: {
  value: string;
  onChange: (v: string) => void;
  shake: boolean;
  disabled?: boolean;
  onConfirm: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Backspace') {
      onChange(value.slice(0, -1));
    } else if (/^\d$/.test(e.key) && value.length < PIN_LENGTH) {
      onChange(value + e.key);
    }
    e.preventDefault();
  };

  const handleNumpad = (key: string) => {
    if (disabled) return;
    if (key === 'clear') {
      onChange(value.slice(0, -1));
    } else if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (value.length < PIN_LENGTH) {
      onChange(value + key);
    }
  };

  // 'clear' = ✕ left of 0, 'confirm' = ✓ right of 0
  const keys = ['1','2','3','4','5','6','7','8','9','clear','0','confirm'];

  return (
    <div>
      <input
        ref={inputRef}
        className="hidden-input"
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={() => {}}
        onKeyDown={handleKey}
        autoFocus
        autoComplete="off"
      />

      {/* PIN dot boxes */}
      <div
        className={`pin-row${shake ? ' shake' : ''}`}
        onClick={() => !disabled && inputRef.current?.focus()}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < value.length;
          const active = !disabled && i === value.length;
          return (
            <div
              key={i}
              className={`pin-box${filled ? ' filled' : ''}${active ? ' active' : ''}`}
            >
              {filled ? '•' : ''}
            </div>
          );
        })}
      </div>

      {/* Numpad */}
      <div className="numpad">
        {keys.map((k, idx) => {

          if (k === 'clear') {
            return (
              <button
                key={idx}
                type="button"
                className="num-btn clear-btn"
                onClick={() => handleNumpad('clear')}
                disabled={disabled || value.length === 0}
                title="Clear"
              >
                ✕
              </button>
            );
          }

          if (k === 'confirm') {
            return (
              <button
                key={idx}
                type="button"
                className="num-btn confirm-btn"
                onClick={onConfirm}
                disabled={disabled || value.length < PIN_LENGTH}
                title="Confirm"
              >
                ✓
              </button>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              className="num-btn"
              onClick={() => handleNumpad(k)}
              disabled={disabled}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── VerifyPin page ─────────────────────────────────────────────────────────

export default function VerifyPin() {

  const navigate  = useNavigate();
  const location  = useLocation();

  const {
    action,
    userId,
    amount,
    senderEmail,
    receiverEmail,
    transferAmount,
    description,
  } = location.state || {};

  const [pin, setPin]         = useState('');
  const [shake, setShake]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {

      if (action === 'pay') {
        await debit(userId, amount, pin);
        navigate('/success', {
          state: { action: 'pay', amount },
        });

      } else if (action === 'transfer') {
        await transferMoney({
          senderEmail,
          receiverEmail,
          amount: transferAmount,
          description,
          pin,
        });
        navigate('/success', {
          state: { action: 'transfer', amount: transferAmount, receiverEmail },
        });
      }

    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Transaction failed. Please try again.';
      setError(msg);
      triggerShake();
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const backPath      = action === 'pay' ? '/pay' : '/transfer';
  const displayAmount = action === 'pay' ? amount : transferAmount;

  return (
    <div className="page-wrap">

      <div className="topbar">
        <button
          className="back-btn"
          onClick={() => navigate(backPath)}
        >
          ←
        </button>
        <span className="page-title">Enter PIN</span>
      </div>

      <div className="center">
        <div className="card">

          <div className="card-icon">🛡️</div>

          <h2>Confirm with PIN</h2>

          <p className="sub">
            {action === 'transfer'
              ? `Sending to ${receiverEmail}`
              : 'Confirm your payment'}
          </p>

          <div className="amount-chip">
            ₹{Number(displayAmount).toLocaleString('en-IN')}
          </div>

          <div className="field">
            <label>Enter your 4-digit PIN</label>
            <PinInput
              value={pin}
              onChange={setPin}
              shake={shake}
              disabled={loading}
              onConfirm={handleVerify}
            />
          </div>

          {loading && (
            <div className="loading-box">
              <span className="spinner" />
              Processing transaction…
            </div>
          )}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}