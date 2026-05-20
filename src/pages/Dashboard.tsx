import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ProfileDropdown from '../components/ProfileDropdown';
import { getWallet } from '../api/walletApi';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg: #080b12;
    --ink: #f5f7ff;
    --muted: rgba(245,247,255,0.42);
    --accent: #4f7cff;
    --accent2: #9b6dff;
    --glass: rgba(255,255,255,0.05);
    --glass-bd: rgba(255,255,255,0.1);
  }

  body {
    font-family:'DM Sans',sans-serif;
    background:var(--bg);
    color:var(--ink);
    min-height:100vh;
  }

  .dash-wrap{
    min-height:100vh;
    background:
      radial-gradient(
        ellipse at 20% 20%,
        rgba(79,124,255,0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 80% 80%,
        rgba(155,109,255,0.07) 0%,
        transparent 50%
      ),
      #080b12;
  }

  .topbar{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:20px 40px;
    border-bottom:1px solid rgba(255,255,255,0.07);
    background:rgba(8,11,18,0.85);
    backdrop-filter:blur(16px);
    position:sticky;
    top:0;
    z-index:100;
  }

  .brand{
    display:flex;
    align-items:center;
    gap:10px;
  }

  .brand-logo{
    width:36px;
    height:36px;
    border-radius:10px;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    box-shadow:0 4px 16px rgba(79,124,255,0.35);
  }

  .brand-name{
    font-family:'Syne',sans-serif;
    font-weight:800;
    font-size:1.1rem;
    background:linear-gradient(
      90deg,
      #fff,
      rgba(155,109,255,.9)
    );
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
  }

  .hero{
    padding:56px 40px 40px;
    max-width:900px;
    margin:0 auto;
  }

  .greeting{
    font-family:'Syne',sans-serif;
    font-size:clamp(1.8rem,4vw,2.8rem);
    font-weight:800;
    line-height:1.1;
    margin-bottom:8px;
  }

  .greeting span{
    background:linear-gradient(
      90deg,
      var(--accent),
      var(--accent2)
    );

    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
  }

  .sub{
    color:var(--muted);
    font-size:.95rem;
    margin-bottom:18px;
  }

  .error-box{
    margin-top:16px;
    padding:12px 16px;
    border-radius:12px;
    background:rgba(248,113,113,0.1);
    border:1px solid rgba(248,113,113,0.25);
    color:#f87171;
    font-size:.9rem;
    max-width:420px;
  }

  .actions{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
    gap:16px;
    max-width:900px;
    margin:0 auto;
    padding:0 40px 60px;
  }

  .action-card{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:14px;
    padding:28px 24px;
    background:var(--glass);
    border:1px solid var(--glass-bd);
    border-radius:20px;
    cursor:pointer;
    transition:
      transform .2s,
      box-shadow .2s,
      background .2s,
      border-color .2s;
    position:relative;
    overflow:hidden;
  }

  .action-card::before{
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(
      135deg,
      var(--card-c1,transparent),
      var(--card-c2,transparent)
    );
    opacity:0;
    transition:opacity .3s;
  }

  .action-card:hover{
    transform:translateY(-4px);
    border-color:rgba(255,255,255,0.18);
  }

  .action-card:hover::before{
    opacity:1;
  }

  .action-card:active{
    transform:translateY(-1px);
  }

  .action-icon{
    width:46px;
    height:46px;
    border-radius:13px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.3rem;
    position:relative;
    z-index:1;
  }

  .action-title{
    font-family:'Syne',sans-serif;
    font-weight:700;
    font-size:1.05rem;
    color:var(--ink);
    position:relative;
    z-index:1;
  }

  .action-desc{
    font-size:.78rem;
    color:var(--muted);
    line-height:1.4;
    position:relative;
    z-index:1;
  }

  .action-arrow{
    position:absolute;
    right:20px;
    bottom:20px;
    font-size:1.1rem;
    color:rgba(255,255,255,0.2);
    transition:color .2s,transform .2s;
    z-index:1;
  }

  .action-card:hover .action-arrow{
    color:rgba(255,255,255,0.6);
    transform:translate(3px,-3px);
  }

  @media(max-width:600px){

    .topbar{
      padding:16px 20px;
    }

    .hero{
      padding:36px 20px 24px;
    }

    .actions{
      padding:0 20px 40px;
      grid-template-columns:1fr 1fr;
      gap:12px;
    }

    .action-card{
      padding:20px 16px;
    }
  }
`;

const ACTIONS = [
  {
    path: '/add-money',
    icon: '💰',
    title: 'Add Money',
    desc: 'Top up your wallet instantly',
    bg: 'rgba(74,222,128,0.1)',
    c1: 'rgba(74,222,128,0.06)',
    c2: 'transparent',
  },
  {
    path: '/pay',
    icon: '⚡',
    title: 'Pay',
    desc: 'Debit from your wallet balance',
    bg: 'rgba(251,191,36,0.1)',
    c1: 'rgba(251,191,36,0.06)',
    c2: 'transparent',
  },
  {
    path: '/transfer',
    icon: '↗️',
    title: 'Transfer',
    desc: 'Send money to another user',
    bg: 'rgba(79,124,255,0.15)',
    c1: 'rgba(79,124,255,0.08)',
    c2: 'transparent',
  },
  {
    path: '/balance',
    icon: '📊',
    title: 'Balance',
    desc: 'Check your current balance',
    bg: 'rgba(155,109,255,0.15)',
    c1: 'rgba(155,109,255,0.08)',
    c2: 'transparent',
  },
  {
    path: '/history',
    icon: '🗂️',
    title: 'History',
    desc: 'View all your transactions',
    bg: 'rgba(251,113,133,0.1)',
    c1: 'rgba(251,113,133,0.06)',
    c2: 'transparent',
  },
];

export default function Dashboard() {

  const navigate = useNavigate();

  const { user } = useAuthStore() as any;

  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {

    const style = document.createElement('style');

    style.textContent = CSS;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };

  }, []);

  useEffect(() => {

    const h = new Date().getHours();

    setGreeting(
      h < 12
        ? 'Good morning'
        : h < 17
        ? 'Good afternoon'
        : 'Good evening'
    );

  }, []);

  const firstName =
    user?.firstName ||
    user?.name ||
    'there';

  const handleActionClick = async (path: string) => {

    setError('');

    // PIN validation only for Pay & Transfer
    if (path === '/pay' || path === '/transfer') {

      try {

        const wallet = await getWallet(user?.id);

        // PIN not set
        if (!wallet.pin) {

          setError('PIN is not set. Please set your PIN first.');

          setTimeout(() => {

            navigate('/set-pin', {
              state: {
                from: path,
              },
            });

          }, 1500);

          return;
        }

      } catch (err) {

        setError('Failed to load wallet.');

        return;
      }
    }

    // Continue normally
    navigate(path);
  };

  return (
    <div className="dash-wrap">

      {/* Topbar */}
      <div className="topbar">

        <div className="brand">

          <div className="brand-logo">
            💳
          </div>

          <span className="brand-name">
            eWallet
          </span>

        </div>

        <ProfileDropdown
          name={
            user?.firstName
              ? `${user.firstName} ${user.lastName}`
              : ''
          }
          email={user?.email || ''}
          userId={user?.id || ''}
        />

      </div>

      {/* Greeting */}
      <div className="hero">

        <h1 className="greeting">
          {greeting},
          <br />
          <span>{firstName}.</span>
        </h1>

        <p className="sub">
          What would you like to do today?
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

      </div>

      {/* Actions */}
      <div className="actions">

        {ACTIONS.map((a) => (

          <div
            key={a.path}
            className="action-card"
            onClick={() => handleActionClick(a.path)}
            style={
              {
                '--card-c1': a.c1,
                '--card-c2': a.c2,
              } as React.CSSProperties
            }
          >

            <div
              className="action-icon"
              style={{ background: a.bg }}
            >
              {a.icon}
            </div>

            <div>

              <div className="action-title">
                {a.title}
              </div>

              <div className="action-desc">
                {a.desc}
              </div>

            </div>

            <span className="action-arrow">
              ↗
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}