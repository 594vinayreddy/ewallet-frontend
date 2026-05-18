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
    justify-content:center
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
  }

  .pin-box.active{
    border-color:#4ade80
  }

  .pin-box.filled{
    border-color:rgba(74,222,128,0.4)
  }

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
  }

  .num-btn.empty{
    background:transparent;
    border-color:transparent;
    cursor:default
  }

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
    to{
      transform:rotate(360deg)
    }
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

function PinInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
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

  const handleNumpad = (digit: string) => {

    if (disabled) return;

    if (digit === 'del') {
      onChange(value.slice(0, -1));
    } else if (value.length < PIN_LENGTH) {
      onChange(value + digit);
    }
  };

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
      />

      <div
        className="pin-row"
        onClick={() => inputRef.current?.focus()}
      >

        {Array.from({ length: PIN_LENGTH }).map((_, i) => {

          const filled = i < value.length;
          const active = i === value.length;

          return (
            <div
              key={i}
              className={`pin-box ${filled ? 'filled' : ''} ${active ? 'active' : ''}`}
            >
              {filled ? '•' : ''}
            </div>
          );
        })}

      </div>

      <div className="numpad">

        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, idx) => (

          <button
            key={idx}
            type="button"
            className={`num-btn ${k === '' ? 'empty' : ''}`}
            onClick={() => k && handleNumpad(k)}
            disabled={disabled}
          >
            {k === 'del' ? '⌫' : k}
          </button>

        ))}

      </div>

    </div>
  );
}

export default function VerifyPin() {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    action,
    userId,
    amount,
    senderEmail,
    receiverEmail,
    transferAmount,
    description,
  } = location.state || {};

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {

    const s = document.createElement('style');
    s.textContent = CSS;

    document.head.appendChild(s);

    return () => {
      document.head.removeChild(s);
    };

  }, []);

  useEffect(() => {

    if (pin.length === PIN_LENGTH) {
      handleVerify();
    }

  }, [pin]);

  const handleVerify = async () => {

    setLoading(true);
    setError('');

    try {

      if (action === 'pay') {

        await debit(userId, amount, pin);

        navigate('/success', {
          state: {
            action: 'pay',
            amount,
          },
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
          state: {
            action: 'transfer',
            amount: transferAmount,
            receiverEmail,
          },
        });
      }

    } catch (err: any) {

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Transaction failed';

      setError(msg);
      setPin('');

    } finally {
      setLoading(false);
    }
  };

  const backPath = action === 'pay'
    ? '/pay'
    : '/transfer';

  const displayAmount = action === 'pay'
    ? amount
    : transferAmount;

  return (
    <div className="page-wrap">

      <div className="topbar">

        <button
          className="back-btn"
          onClick={() => navigate(backPath)}
        >
          ←
        </button>

        <span className="page-title">
          Enter PIN
        </span>

      </div>

      <div className="center">

        <div className="card">

          <div className="card-icon">
            🛡️
          </div>

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

            <label>
              Enter your 4-digit PIN
            </label>

            <PinInput
              value={pin}
              onChange={setPin}
              disabled={loading}
            />

          </div>

          {loading && (
            <div className="loading-box">
              <span className="spinner" />
              Processing transaction...
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