import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { login } from '../api/authApi';
import { getProfile } from '../api/userApi';
import { useAuthStore } from '../store/authStore';

import walletVideo from '../assets/wallet_animation.mp4';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap');

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
    --glass: rgba(255,255,255,0.052);
    --glass-bd: rgba(255,255,255,0.11);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--ink);
    overflow-x: hidden;
    cursor: none;
  }

  #cursor {
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width .2s, height .2s;
    mix-blend-mode: screen;
  }

  #cursor-ring {
    position: fixed;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(79,124,255,0.5);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width .35s, height .35s, border-color .3s;
  }

  .scroll-root {
    height: 300vh;
    position: relative;
  }

  .scene {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    display: flex;
  }

  .left-panel {
    position: relative;
    z-index: 10;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 64px;
  }

  .right-panel {
    position: relative;
    width: 50%;
    overflow: hidden;
  }

  .right-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 70% 40%, rgba(79,124,255,0.16) 0%, transparent 55%),
      radial-gradient(ellipse at 30% 80%, rgba(155,109,255,0.12) 0%, transparent 50%),
      linear-gradient(160deg, #0a0e1a 0%, #060810 100%);
    z-index: 0;
  }

  .right-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, var(--bg) 0%, transparent 16%);
    z-index: 5;
    pointer-events: none;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    z-index: 1;
  }

  .orb-1 {
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(79,124,255,0.32), transparent 70%);
    top: 8%;
    right: 6%;
    animation: drift1 9s ease-in-out infinite;
  }

  .orb-2 {
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(155,109,255,0.28), transparent 70%);
    bottom: 14%;
    left: 8%;
    animation: drift2 12s ease-in-out infinite;
  }

  .orb-3 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(79,200,255,0.2), transparent 70%);
    top: 54%;
    right: 28%;
    animation: drift3 7s ease-in-out infinite;
  }

  @keyframes drift1 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(-22px,16px); }
  }

  @keyframes drift2 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(16px,-20px); }
  }

  @keyframes drift3 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(-10px,12px); }
  }

  .wallet-video-wrap {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) scale(var(--ws,0.5));
    transform-origin: center center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wallet-video-wrap video {
    width: 86%;
    height: 86%;
    object-fit: contain;
    border-radius: 28px;
    opacity: var(--wo,0.7);
    filter: saturate(1.2) brightness(0.95);
  }

  #particles {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    background: white;
    opacity: 0;
    animation: floatUp var(--dur,8s) ease-in-out var(--delay,0s) infinite;
  }

  @keyframes floatUp {
    0% {
      opacity:0;
      transform:translateY(0) scale(1);
    }

    10% {
      opacity:var(--op,.45);
    }

    90% {
      opacity:var(--op,.45);
    }

    100% {
      opacity:0;
      transform:translateY(-110px) scale(0.4);
    }
  }

  .brand {
    position: absolute;
    top: 36px;
    left: 48px;
    display: flex;
    align-items: center;
    gap: 11px;
    z-index: 20;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg,var(--accent),var(--accent2));
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    box-shadow: 0 4px 20px rgba(79,124,255,0.38);
  }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: .03em;
    background: linear-gradient(90deg,#fff 20%,rgba(155,109,255,.9));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .glass-card {
    position: relative;
    width: 100%;
    max-width: 420px;
    padding: 50px 46px;
    border-radius: 28px;
    background: var(--glass);
    border: 1px solid var(--glass-bd);
    backdrop-filter: blur(28px) saturate(170%);
    -webkit-backdrop-filter: blur(28px) saturate(170%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.035) inset,
      0 40px 90px rgba(0,0,0,0.58),
      0 0 70px rgba(79,124,255,0.07);
  }

  .eyebrow {
    font-size: .7rem;
    font-weight: 500;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 10px;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 2.1rem;
    font-weight: 800;
    line-height: 1.08;
    margin-bottom: 6px;
  }

  .card-sub {
    font-size: .88rem;
    color: var(--muted);
    margin-bottom: 36px;
  }

  .field {
    margin-bottom: 18px;
  }

  label {
    font-size: .78rem;
    font-weight: 500;
    color: rgba(245,247,255,.65);
    display: block;
    margin-bottom: 8px;
  }

  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: .38;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 13px 16px 13px 42px;
    background: rgba(255,255,255,.065);
    border: 1px solid rgba(255,255,255,.085);
    border-radius: 13px;
    color: var(--ink);
    font-size: .91rem;
    outline: none;
    transition: .2s;
  }

  input::placeholder {
    color: rgba(245,247,255,.22);
  }

  input:focus {
    border-color: var(--accent);
    background: rgba(79,124,255,.09);
    box-shadow: 0 0 0 3px rgba(79,124,255,.16);
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 13px;
    background: linear-gradient(135deg,var(--accent) 0%,#7b52ff 100%);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: .94rem;
    font-weight: 700;
    letter-spacing: .05em;
    cursor: pointer;
    transition: .2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
  }

  .btn-primary:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .error-box {
    padding: 10px 14px;
    border-radius: 10px;
    margin-bottom: 16px;
    background: rgba(255,80,80,0.1);
    border: 1px solid rgba(255,80,80,0.25);
    color: #ff9090;
    font-size: .82rem;
  }

  .signup-row {
    text-align: center;
    margin-top: 24px;
    font-size: .82rem;
    color: var(--muted);
  }

  .signup-row a {
    color: var(--accent2);
    text-decoration: none;
    font-weight: 500;
  }
`;

export default function Login() {
  const [creds, setCreds] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { setToken, setUser } = useAuthStore();

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Cursor
  useEffect(() => {
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');

    if (!cur || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    };

    const loopRing = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;

      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';

      rafId = requestAnimationFrame(loopRing);
    };

    document.addEventListener('mousemove', onMove);

    rafId = requestAnimationFrame(loopRing);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Particles
  useEffect(() => {
    const pWrap = document.getElementById('particles');

    if (!pWrap) return;

    for (let i = 0; i < 26; i++) {
      const p = document.createElement('div');

      p.className = 'particle';

      const s = Math.random() * 3 + 1;

      p.style.cssText = `
        width:${s}px;
        height:${s}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 80}%;
        --dur:${6 + Math.random() * 10}s;
        --delay:${Math.random() * 8}s;
        --op:${0.25 + Math.random() * 0.4};
      `;

      pWrap.appendChild(p);
    }

    return () => {
      pWrap.innerHTML = '';
    };
  }, []);

  // Scroll Animation
  useEffect(() => {
    const scrollRoot = document.getElementById('scrollRoot');
    const walletWrap = document.getElementById('walletWrap');

    const onScroll = () => {
      if (!scrollRoot || !walletWrap) return;

      const p = Math.min(
        window.scrollY /
          (scrollRoot.offsetHeight - window.innerHeight),
        1
      );

      const scale = 0.5 + p * 1.15;

      walletWrap.style.setProperty('--ws', String(scale));
      walletWrap.style.setProperty(
        '--wo',
        String(Math.min(0.7 + p * 0.3, 1))
      );
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // LOGIN
      const authRes = await login(creds);

      const { token, email, role } = authRes.data;

      // SAVE TOKEN
      setToken(token);

      // DECODE JWT
      const payload = jwtDecode<JwtPayload>(token);

      const userId = Number(payload.sub);

      if (isNaN(userId)) {
        throw new Error('Invalid user ID in token');
      }

      // FETCH FULL PROFILE
      const profileRes = await getProfile(token, userId);

      const profile = profileRes.data;

      /*
        profile = {
          id,
          email,
          firstName,
          lastName,
          phoneNumber,
          dateOfBirth
        }
      */

      // SAVE USER
      setUser({
        id: profile.id,
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? email,
        role: role,
        phoneNumber: profile.phoneNumber ?? '',
        dateOfBirth: profile.dateOfBirth ?? '',
      });

      // REDIRECT
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);

      const msg = err.response?.data;

      setError(
        typeof msg === 'string'
          ? msg
          : err.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />

      <div className="scroll-root" id="scrollRoot">
        <div className="scene">

          <div className="brand">
            <div className="brand-logo">💳</div>
            <span className="brand-name">eWallet</span>
          </div>

          <div className="left-panel">
            <form
              className="glass-card"
              onSubmit={handleSubmit}
            >
              <div className="eyebrow">
                Welcome back
              </div>

              <h1 className="card-title">
                Sign in
              </h1>

              <p className="card-sub">
                Access your wallet dashboard
              </p>

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              <div className="field">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrap">
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={creds.email}
                    onChange={(e) => {
                      setCreds((c) => ({
                        ...c,
                        email: e.target.value,
                      }));

                      setError('');
                    }}
                  />

                  <span className="input-icon">
                    ✉️
                  </span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrap">
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={creds.password}
                    onChange={(e) => {
                      setCreds((c) => ({
                        ...c,
                        password: e.target.value,
                      }));

                      setError('');
                    }}
                  />

                  <span className="input-icon">
                    🔒
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Signing in...'
                  : 'Sign In →'}
              </button>

              <div className="signup-row">
                Don't have an account?{' '}
                <Link to="/register">
                  Create one free
                </Link>
              </div>
            </form>
          </div>

          <div className="right-panel">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div id="particles" />

            <div
              className="wallet-video-wrap"
              id="walletWrap"
            >
              <video
                src={walletVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}