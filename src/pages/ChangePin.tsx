import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePin, verifyPin } from '../api/walletApi';
import { useAuthStore } from '../store/authStore';

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
      radial-gradient(ellipse at 20% 20%,rgba(79,124,255,0.07) 0%,transparent 50%),
      radial-gradient(ellipse at 80% 80%,rgba(155,109,255,0.07) 0%,transparent 50%),
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
    background:rgba(79,124,255,0.12);
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

  .card p{
    color:rgba(245,247,255,0.42);
    font-size:.88rem;
    margin-bottom:32px
  }

  .field{
    margin-bottom:20px
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
    justify-content:center;
    margin-bottom:4px
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
    color:#4f7cff;
    transition:border-color .2s,background .2s,box-shadow .2s;
    user-select:none
  }

  .pin-box.active{
    border-color:#4f7cff;
    background:rgba(79,124,255,0.07);
    box-shadow:0 0 0 3px rgba(79,124,255,0.14)
  }

  .pin-box.filled{
    border-color:rgba(79,124,255,0.4)
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
    transition:background .15s,transform .1s,border-color .15s
  }

  .num-btn:hover:not(:disabled){
    background:rgba(255,255,255,0.11);
    transform:scale(1.04)
  }

  .num-btn:active:not(:disabled){
    transform:scale(0.97)
  }

  .num-btn.clear-btn{
    color:#f87171
  }

  .num-btn.confirm-btn{
    color:#4f7cff
  }

  .num-btn:disabled{
    opacity:.35;
    cursor:not-allowed;
    transform:none
  }

  .step-indicator{
    display:flex;
    gap:8px;
    margin-bottom:28px
  }

  .step-dot{
    width:8px;
    height:8px;
    border-radius:50%;
    background:rgba(255,255,255,0.15)
  }

  .step-dot.active{
    background:#4f7cff
  }

  .step-dot.done{
    background:rgba(79,124,255,0.45)
  }

  .step-label{
    font-size:.75rem;
    color:rgba(245,247,255,0.4);
    margin-bottom:20px;
    font-weight:500
  }

  .step-label span{
    color:#4f7cff;
    font-weight:600
  }

  .success-box{
    padding:12px 16px;
    border-radius:12px;
    background:rgba(74,222,128,0.1);
    border:1px solid rgba(74,222,128,0.25);
    color:#4ade80;
    font-size:.85rem;
    margin-top:14px;
    text-align:center
  }

  .error-box{
    padding:12px 16px;
    border-radius:12px;
    background:rgba(248,113,113,0.1);
    border:1px solid rgba(248,113,113,0.25);
    color:#f87171;
    font-size:.85rem;
    margin-top:14px;
    text-align:center
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
`;

const PIN_LENGTH = 4;

type Step = 'old' | 'new' | 'confirm';

const STEP_META = {
  old: {
    label: 'Current PIN',
    sublabel: 'Enter your current 4-digit PIN.',
    stepNum: 1,
  },
  new: {
    label: 'New PIN',
    sublabel: 'Choose your new 4-digit PIN.',
    stepNum: 2,
  },
  confirm: {
    label: 'Confirm PIN',
    sublabel: 'Re-enter your new PIN.',
    stepNum: 3,
  },
};

function PinInput({
  value,
  onChange,
  shake,
  onConfirm,
}: {
  value: string;
  onChange: (v: string) => void;
  shake: boolean;
  onConfirm: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNumpad = (key: string) => {
    if (key === 'clear') {
      onChange(value.slice(0,-1));
      return;
    }

    if (key === 'del') {
      onChange(value.slice(0, -1));
      return;
    }

    if (value.length < PIN_LENGTH) {
      onChange(value + key);
    }
  };

  const keys = [
    '1','2','3',
    '4','5','6',
    '7','8','9',
    'clear','0','confirm'
  ];

  return (
    <div>

      <input
        ref={inputRef}
        className="hidden-input"
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={() => {}}
        autoFocus
      />

      <div
        className={`pin-row${shake ? ' shake' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < value.length;
          const active = i === value.length;

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

      <div className="numpad">
        {keys.map((k, idx) => {

          if (k === 'clear') {
            return (
              <button
                key={idx}
                type="button"
                className="num-btn clear-btn"
                onClick={() => handleNumpad('clear')}
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
                disabled={value.length !== PIN_LENGTH}
                onClick={onConfirm}
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
            >
              {k}
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default function ChangePin() {

  const navigate = useNavigate();
  const { user } = useAuthStore() as any;

  const [step, setStep] = useState<Step>('old');

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const triggerShake = () => {
    setShake(true);

    setTimeout(() => {
      setShake(false);
    }, 400);
  };

  const currentValue =
    step === 'old'
      ? oldPin
      : step === 'new'
      ? newPin
      : confirmPin;

  const setCurrentValue =
    step === 'old'
      ? setOldPin
      : step === 'new'
      ? setNewPin
      : setConfirmPin;

  const handleTick = async () => {

    setError('');

    if (currentValue.length !== PIN_LENGTH) {
      return;
    }

    if (!user?.id) {
      setError('User not found. Please login again.');
      return;
    }

    // STEP 1 → VERIFY OLD PIN
    if (step === 'old') {

      try {

        setLoading(true);

        const isValidPin = await verifyPin({
          userId: user.id,
          pin: oldPin,
        });

        if (!isValidPin) {
          triggerShake();
          setError('Your current PIN is incorrect.');
          setOldPin('');
          return;
        }

        setStep('new');

      } catch (err) {

        setError('Failed to verify current PIN.');

      } finally {

        setLoading(false);

      }

      return;
    }

    // STEP 2 → GO TO CONFIRM
    if (step === 'new') {

      if (newPin === oldPin) {
        triggerShake();
        setError('New PIN cannot be same as current PIN.');
        setNewPin('');
        return;
      }

      setStep('confirm');
      return;
    }

    // STEP 3 → FINAL SUBMIT
    if (step === 'confirm') {

      if (confirmPin !== newPin) {
        triggerShake();
        setError('PINs do not match.');

        setConfirmPin('');
        return;
      }

      try {

        setLoading(true);

        await updatePin({
          userId: user.id,
          oldPin,
          newPin,
        });

        setSuccess('PIN updated successfully!');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      } catch (err: any) {

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to update PIN.'
        );

      } finally {

        setLoading(false);

      }
    }
  };

  const { label, sublabel, stepNum } = STEP_META[step];

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
          Change PIN
        </span>
      </div>

      <div className="center">

        <div className="card">

          <div className="card-icon">
            🔑
          </div>

          <div className="step-indicator">
            {[1,2,3].map((i) => (
              <div
                key={i}
                className={`step-dot${
                  i === stepNum
                    ? ' active'
                    : i < stepNum
                    ? ' done'
                    : ''
                }`}
              />
            ))}
          </div>

          <h2>{label}</h2>

          <p>{sublabel}</p>

          <div className="step-label">
            Step <span>{stepNum}</span> of 3
          </div>

          <div className="field">

            <label>{label}</label>

            <PinInput
              key={step}
              value={currentValue}
              onChange={setCurrentValue}
              shake={shake}
                onConfirm={handleTick}
            />

          </div>

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

        </div>

      </div>

    </div>
  );
}