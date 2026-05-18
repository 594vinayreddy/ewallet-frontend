import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPin } from '../api/walletApi';
import { useAuthStore } from '../store/authStore';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#080b12;color:#f5f7ff;min-height:100vh}
  .page-wrap{min-height:100vh;background:radial-gradient(ellipse at 20% 20%,rgba(251,191,36,0.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(79,124,255,0.06) 0%,transparent 50%),#080b12;display:flex;flex-direction:column}
  .topbar{display:flex;align-items:center;gap:14px;padding:20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(8,11,18,0.85);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100}
  .back-btn{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#f5f7ff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .back-btn:hover{background:rgba(255,255,255,0.12)}
  .page-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem}
  .center{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 20px}
  .card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px 36px;width:100%;max-width:440px;box-shadow:0 8px 40px rgba(0,0,0,0.4)}
  .card-icon{width:54px;height:54px;border-radius:16px;background:rgba(251,191,36,0.12);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:20px}
  .card h2{font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;margin-bottom:6px}
  .card p{color:rgba(245,247,255,0.42);font-size:.88rem;margin-bottom:32px}
  .field{margin-bottom:20px}
  .field label{display:block;font-size:.72rem;font-weight:500;letter-spacing:1.6px;text-transform:uppercase;color:rgba(245,247,255,0.55);margin-bottom:10px}

  /* PIN dots row */
  .pin-row{display:flex;gap:12px;justify-content:center;margin-bottom:4px}
  .pin-box{
    width:52px;height:58px;border-radius:13px;
    background:rgba(255,255,255,0.065);
    border:1.5px solid rgba(255,255,255,0.085);
    display:flex;align-items:center;justify-content:center;
    font-size:1.6rem;font-family:'Syne',sans-serif;font-weight:700;
    color:#fbbf24;letter-spacing:0;
    transition:border-color .2s,background .2s,box-shadow .2s;
    cursor:default;user-select:none;
  }
  .pin-box.active{border-color:#fbbf24;background:rgba(251,191,36,0.07);box-shadow:0 0 0 3px rgba(251,191,36,0.14)}
  .pin-box.filled{border-color:rgba(251,191,36,0.4)}
  .hidden-input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}

  /* numpad */
  .numpad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px}
  .num-btn{
    padding:16px 0;border-radius:13px;border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.05);color:#f5f7ff;
    font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;
    cursor:pointer;transition:background .15s,transform .1s;
  }
  .num-btn:hover{background:rgba(255,255,255,0.11);transform:scale(1.04)}
  .num-btn:active{transform:scale(0.97)}
  .num-btn.del{font-size:.85rem;color:rgba(245,247,255,0.6)}
  .num-btn.empty{background:transparent;border-color:transparent;cursor:default}
  .num-btn.empty:hover{background:transparent;transform:none}

  .step-indicator{display:flex;gap:8px;margin-bottom:28px}
  .step-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.15);transition:background .3s}
  .step-dot.active{background:#fbbf24}
  .step-dot.done{background:rgba(251,191,36,0.45)}

  .submit-btn{width:100%;padding:14px;border:none;border-radius:13px;background:linear-gradient(135deg,#d97706,#fbbf24);color:#fff;font-family:'Syne',sans-serif;font-size:.94rem;font-weight:700;letter-spacing:.05em;cursor:pointer;box-shadow:0 6px 30px rgba(251,191,36,0.3);transition:transform .18s,box-shadow .18s;margin-top:20px}
  .submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(251,191,36,0.4)}
  .submit-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .success-box{padding:12px 16px;border-radius:12px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80;font-size:.85rem;margin-top:14px;text-align:center}
  .error-box{padding:12px 16px;border-radius:12px;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25);color:#f87171;font-size:.85rem;margin-top:14px;text-align:center}

  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  .shake{animation:shake .35s ease}
`;

const PIN_LENGTH = 4;

// Controlled PIN input using a hidden <input> + visual dots
function PinInput({
  value,
  onChange,
  shake,
}: {
  value: string;
  onChange: (v: string) => void;
  shake: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => inputRef.current?.focus();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      onChange(value.slice(0, -1));
    } else if (/^\d$/.test(e.key) && value.length < PIN_LENGTH) {
      onChange(value + e.key);
    }
    e.preventDefault();
  };

  const handleNumpad = (digit: string) => {
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
        maxLength={PIN_LENGTH}
        value={value}
        onChange={() => {}}
        onKeyDown={handleKey}
        autoComplete="off"
      />

      {/* Visual boxes */}
      <div
        className={`pin-row${shake ? ' shake' : ''}`}
        onClick={handleBoxClick}
        style={{ cursor: 'pointer' }}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < value.length;
          const active = i === value.length;
          return (
            <div
              key={i}
              className={`pin-box${active ? ' active' : ''}${filled ? ' filled' : ''}`}
            >
              {filled ? '•' : ''}
            </div>
          );
        })}
      </div>

      {/* Numpad */}
      <div className="numpad" style={{ marginTop: 16 }}>
        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, idx) => (
          <button
            key={idx}
            type="button"
            className={`num-btn${k === '' ? ' empty' : ''}${k === 'del' ? ' del' : ''}`}
            onClick={() => k !== '' && handleNumpad(k)}
            disabled={k === ''}
            tabIndex={-1}
          >
            {k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SetPin() {
  const navigate = useNavigate();
  const { user } = useAuthStore() as any;

  const [step, setStep] = useState<1 | 2>(1); // 1 = enter pin, 2 = confirm pin
  const [pin, setPin_] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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

  // Auto-advance from step 1 → 2 when PIN is complete
  useEffect(() => {
    if (step === 1 && pin.length === PIN_LENGTH) {
      setTimeout(() => setStep(2), 200);
    }
  }, [pin, step]);

  // Auto-submit from step 2 when confirm PIN is complete
  useEffect(() => {
    if (step === 2 && confirmPin.length === PIN_LENGTH) {
      handleConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPin]);

  const handleConfirm = async () => {
    if (confirmPin !== pin) {
      triggerShake();
      setError('PINs do not match. Please try again.');
      setConfirmPin('');
      setStep(1);
      setPin_('');
      return;
    }

    if (!user?.id) {
      setError('User not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await setPin({ userId: user.id, pin });
      setSuccess('PIN set successfully! Redirecting…');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to set PIN. Try again.'
      );
      setConfirmPin('');
      setStep(1);
      setPin_('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
        <span className="page-title">Set PIN</span>
      </div>

      <div className="center">
        <div className="card">
          <div className="card-icon">🔐</div>

          <div className="step-indicator">
            <div className={`step-dot${step === 1 ? ' active' : ' done'}`} />
            <div className={`step-dot${step === 2 ? ' active' : step > 2 ? ' done' : ''}`} />
          </div>

          <h2>{step === 1 ? 'Create your PIN' : 'Confirm your PIN'}</h2>
          <p>
            {step === 1
              ? 'Choose a 4-digit PIN to secure your wallet transactions.'
              : 'Re-enter your PIN to confirm.'}
          </p>

          {step === 1 ? (
            <div className="field">
              <label>Enter 4-digit PIN</label>
              <PinInput value={pin} onChange={setPin_} shake={shake} />
            </div>
          ) : (
            <div className="field">
              <label>Confirm PIN</label>
              <PinInput value={confirmPin} onChange={setConfirmPin} shake={shake} />
            </div>
          )}

          {loading && (
            <button className="submit-btn" disabled>
              Setting PIN…
            </button>
          )}

          {success && <div className="success-box">✓ {success}</div>}
          {error && <div className="error-box">{error}</div>}
        </div>
      </div>
    </div>
  );
}