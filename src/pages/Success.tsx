import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Success page — shown after VerifyPin completes a pay or transfer.
 *
 * Reads from location.state:
 * {
 *   action:          'pay' | 'transfer'
 *   amount:          number
 *   receiverEmail?:  string   // transfer only
 * }
 */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0 }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #080b12;
    color: #f5f7ff;
    min-height: 100vh;
  }

  .page-wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background:
      radial-gradient(ellipse at 50% 0%,   rgba(74,222,128,0.13) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 100%, rgba(79,124,255,0.07) 0%, transparent 50%),
      #080b12;
    position: relative;
    overflow: hidden;
  }

  /* ── Confetti particles ── */
  .confetti-wrap {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .dot {
    position: absolute;
    top: -12px;
    border-radius: 50%;
    animation: fall linear forwards;
    opacity: 0;
  }

  @keyframes fall {
    0%   { transform: translateY(0)   rotate(0deg);   opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  /* ── Card ── */
  .card {
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px;
    padding: 52px 40px 44px;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 12px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.08);
    animation: card-in .55s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(32px) scale(.96) }
    to   { opacity: 1; transform: none }
  }

  /* ── Check circle ── */
  .check-wrap {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: rgba(74,222,128,0.1);
    border: 1.5px solid rgba(74,222,128,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    animation: pop .5s .15s cubic-bezier(.34,1.56,.64,1) both;
    position: relative;
  }

  @keyframes pop {
    from { opacity: 0; transform: scale(0.4) }
    to   { opacity: 1; transform: scale(1) }
  }

  /* Glow ring */
  .check-wrap::before {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1px solid rgba(74,222,128,0.15);
    animation: ring-pulse 2.2s ease-in-out 0.6s infinite;
  }
  .check-wrap::after {
    content: '';
    position: absolute;
    inset: -22px;
    border-radius: 50%;
    border: 1px solid rgba(74,222,128,0.07);
    animation: ring-pulse 2.2s ease-in-out 0.9s infinite;
  }

  @keyframes ring-pulse {
    0%,100% { opacity: 1; transform: scale(1) }
    50%      { opacity: 0; transform: scale(1.25) }
  }

  .check-svg {
    width: 40px;
    height: 40px;
    stroke: #4ade80;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    animation: draw-check .45s .4s ease both;
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
  }

  @keyframes draw-check {
    to { stroke-dashoffset: 0 }
  }

  /* ── Text ── */
  .label {
    font-size: .72rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4ade80;
    margin-bottom: 10px;
    animation: fade-up .4s .3s ease both;
  }

  .amount {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.8rem;
    line-height: 1;
    letter-spacing: -.02em;
    color: #f5f7ff;
    margin-bottom: 10px;
    animation: fade-up .4s .38s ease both;
  }

  .sub {
    color: rgba(245,247,255,0.42);
    font-size: .88rem;
    line-height: 1.55;
    margin-bottom: 36px;
    animation: fade-up .4s .44s ease both;
  }

  .sub strong {
    color: rgba(245,247,255,0.75);
    font-weight: 500;
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px) }
    to   { opacity: 1; transform: none }
  }

  /* ── Divider ── */
  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin-bottom: 28px;
    animation: fade-up .4s .5s ease both;
  }

  /* ── Done button ── */
  .done-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #16a34a, #4ade80);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: .96rem;
    font-weight: 700;
    letter-spacing: .05em;
    cursor: pointer;
    box-shadow: 0 6px 32px rgba(74,222,128,0.28);
    transition: transform .18s, box-shadow .18s;
    animation: fade-up .4s .56s ease both;
  }

  .done-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 44px rgba(74,222,128,0.4);
  }

  .done-btn:active {
    transform: scale(.98);
  }
`;

// ── Confetti ──────────────────────────────────────────────────────────────

const COLORS = ['#4ade80','#fbbf24','#4f7cff','#f472b6','#a78bfa','#34d399'];

function Confetti() {
  const dots = Array.from({ length: 38 }, (_, i) => {
    const size   = 5 + Math.random() * 7;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 1.2;
    const dur    = 2.4 + Math.random() * 1.8;
    const color  = COLORS[i % COLORS.length];
    return { size, left, delay, dur, color };
  });

  return (
    <div className="confetti-wrap">
      {dots.map((d, i) => (
        <div
          key={i}
          className="dot"
          style={{
            width:  d.size,
            height: d.size,
            left:   `${d.left}%`,
            background: d.color,
            animationDuration:  `${d.dur}s`,
            animationDelay:     `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Success() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const state     = (location.state ?? {}) as Record<string, any>;

  const { action, amount, receiverEmail } = state;

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  const formattedAmount = amount
    ? `₹${Number(amount).toLocaleString('en-IN')}`
    : '';

  const subText = action === 'transfer' && receiverEmail
    ? <>Sent to <strong>{receiverEmail}</strong> successfully.</>
    : <>Your payment was processed successfully.</>;

  return (
    <div className="page-wrap">
      <Confetti />

      <div className="card">
        {/* Animated check */}
        <div className="check-wrap">
          <svg className="check-svg" viewBox="0 0 24 24">
            <polyline points="4 12 10 18 20 6" />
          </svg>
        </div>

        <p className="label">
          {action === 'transfer' ? 'Transfer Successful' : 'Payment Successful'}
        </p>

        {formattedAmount && (
          <p className="amount">{formattedAmount}</p>
        )}

        <p className="sub">{subText}</p>

        <div className="divider" />

        <button
          className="done-btn"
          onClick={() => navigate('/dashboard')}
        >
          Done
        </button>
      </div>
    </div>
  );
}