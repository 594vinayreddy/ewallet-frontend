import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import walletVideo from '../assets/wallet_animation.mp4';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #080b12;
    --ink:      #f5f7ff;
    --muted:    rgba(245,247,255,0.42);
    --accent:   #4f7cff;
    --accent2:  #9b6dff;
    --glass:    rgba(255,255,255,0.052);
    --glass-bd: rgba(255,255,255,0.11);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--ink);
    overflow-x: hidden;
    cursor: none;
  }

  /* ── CURSOR ── */
  #cursor {
    position: fixed; width: 10px; height: 10px;
    border-radius: 50%; background: var(--accent);
    pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%);
    transition: width .2s, height .2s;
    mix-blend-mode: screen;
  }
  #cursor-ring {
    position: fixed; width: 36px; height: 36px;
    border-radius: 50%; border: 1px solid rgba(79,124,255,0.5);
    pointer-events: none; z-index: 9998;
    transform: translate(-50%,-50%);
    transition: width .35s, height .35s, border-color .3s;
  }

  /* ── SCROLL CONTAINER ── */
  .scroll-root { height: 300vh; position: relative; }

  /* ── STICKY SCENE ── */
  .scene {
    position: sticky; top: 0;
    height: 100vh; width: 100%;
    overflow: hidden; display: flex;
  }

  /* ── LEFT — FORM ── */
  .left-panel {
    position: relative; z-index: 10;
    width: 50%; display: flex;
    flex-direction: column; justify-content: center;
    padding: 0 64px;
  }

  /* ── RIGHT — AMBIENT ── */
  .right-panel {
    position: relative; width: 50%; overflow: hidden;
  }

  .right-panel::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 70% 40%, rgba(79,124,255,0.16) 0%, transparent 55%),
      radial-gradient(ellipse at 30% 80%, rgba(155,109,255,0.12) 0%, transparent 50%),
      linear-gradient(160deg, #0a0e1a 0%, #060810 100%);
    z-index: 0;
  }

  .right-panel::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to right, var(--bg) 0%, transparent 16%);
    z-index: 5; pointer-events: none;
  }

  /* ── ORBS ── */
  .orb {
    position: absolute; border-radius: 50%;
    filter: blur(60px); pointer-events: none; z-index: 1;
  }
  .orb-1 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(79,124,255,0.32), transparent 70%);
    top: 8%; right: 6%;
    animation: drift1 9s ease-in-out infinite;
  }
  .orb-2 {
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(155,109,255,0.28), transparent 70%);
    bottom: 14%; left: 8%;
    animation: drift2 12s ease-in-out infinite;
  }
  .orb-3 {
    width: 150px; height: 150px;
    background: radial-gradient(circle, rgba(79,200,255,0.2), transparent 70%);
    top: 54%; right: 28%;
    animation: drift3 7s ease-in-out infinite;
  }
  @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,16px)} }
  @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-20px)} }
  @keyframes drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-10px,12px)} }

  /* ── VIDEO ── */
  .wallet-video-wrap {
    position: absolute; z-index: 2;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%) scale(var(--ws,0.5));
    transform-origin: center center;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }

  .wallet-video-wrap video {
    width: 86%; height: 86%;
    object-fit: contain;
    border-radius: 28px;
    mask-image: radial-gradient(ellipse 86% 78% at center, black 50%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 86% 78% at center, black 50%, transparent 100%);
    opacity: var(--wo, 0.7);
    filter: saturate(1.2) brightness(0.95);
  }

  /* ── PARTICLES ── */
  #particles { position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: hidden; }
  .particle {
    position: absolute; border-radius: 50%; background: white;
    opacity: 0;
    animation: floatUp var(--dur,8s) ease-in-out var(--delay,0s) infinite;
  }
  @keyframes floatUp {
    0%   { opacity:0; transform:translateY(0) scale(1); }
    10%  { opacity:var(--op,.45); }
    90%  { opacity:var(--op,.45); }
    100% { opacity:0; transform:translateY(-110px) scale(0.4); }
  }

  /* ── BRAND ── */
  .brand {
    position: absolute; top: 36px; left: 48px;
    display: flex; align-items: center; gap: 11px; z-index: 20;
  }
  .brand-logo {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
    box-shadow: 0 4px 20px rgba(79,124,255,0.38);
  }
  .brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.15rem; letter-spacing: 0.03em;
    background: linear-gradient(90deg, #fff 20%, rgba(155,109,255,.9));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── SCROLL HINT ── */
  .scroll-hint {
    position: absolute; bottom: 36px; left: 50%;
    transform: translateX(-50%); z-index: 20;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 1; transition: opacity .4s; pointer-events: none;
  }
  .scroll-hint.hide { opacity: 0; }
  .scroll-hint span { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .scroll-mouse {
    width: 22px; height: 34px;
    border: 1.5px solid rgba(255,255,255,0.2); border-radius: 999px;
    display: flex; justify-content: center; padding-top: 6px;
  }
  .scroll-mouse::after {
    content: ''; width: 3px; height: 7px;
    background: rgba(255,255,255,0.5); border-radius: 999px;
    animation: bob 1.8s ease-in-out infinite;
  }
  @keyframes bob { 0%,100%{transform:translateY(0);opacity:1} 60%{transform:translateY(7px);opacity:.3} }

  /* ── TAGLINE ── */
  .scroll-tagline {
    position: absolute; bottom: 52px; left: 48px;
    z-index: 20; max-width: 290px;
    opacity: 0; transform: translateY(16px);
    transition: opacity .5s, transform .5s;
  }
  .scroll-tagline.visible { opacity: 1; transform: translateY(0); }
  .scroll-tagline h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.45rem; font-weight: 700; line-height: 1.25; margin-bottom: 8px;
  }
  .scroll-tagline h3 span {
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .scroll-tagline p { font-size: 0.86rem; color: var(--muted); line-height: 1.6; }

  /* ── GLASS CARD ── */
  .glass-card {
    position: relative; width: 100%; max-width: 420px;
    padding: 50px 46px; border-radius: 28px;
    background: var(--glass);
    border: 1px solid var(--glass-bd);
    backdrop-filter: blur(28px) saturate(170%);
    -webkit-backdrop-filter: blur(28px) saturate(170%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.035) inset,
      0 40px 90px rgba(0,0,0,0.58),
      0 0 70px rgba(79,124,255,0.07);
    animation: cardIn .8s cubic-bezier(.22,1,.36,1) both .1s;
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(28px) scale(.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  .glass-card::before {
    content: ''; position: absolute;
    top:0; left:15%; right:15%; height:1px;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);
  }

  .eyebrow {
    font-size: .7rem; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: var(--accent2); margin-bottom: 10px;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 2.1rem; font-weight: 800; line-height: 1.08; margin-bottom: 6px;
  }
  .card-sub { font-size: .88rem; color: var(--muted); margin-bottom: 36px; }

  /* ── FIELDS ── */
  .field { margin-bottom: 18px; }
  .field-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:7px; }
  label { font-size:.78rem; font-weight:500; color:rgba(245,247,255,.65); letter-spacing:.025em; }
  .forgot { font-size:.76rem; color:var(--accent2); text-decoration:none; transition:opacity .2s; }
  .forgot:hover { opacity:.7; }

  .input-wrap { position: relative; }
  .input-icon {
    position:absolute; left:14px; top:50%;
    transform:translateY(-50%); font-size:15px;
    opacity:.38; pointer-events:none; transition:opacity .2s;
  }

  input[type="email"], input[type="password"] {
    width: 100%; padding: 13px 16px 13px 42px;
    background: rgba(255,255,255,.065);
    border: 1px solid rgba(255,255,255,.085);
    border-radius: 13px; color: var(--ink);
    font-family: 'DM Sans', sans-serif; font-size: .91rem;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  input::placeholder { color: rgba(245,247,255,.22); }
  input:focus {
    border-color: var(--accent);
    background: rgba(79,124,255,.09);
    box-shadow: 0 0 0 3px rgba(79,124,255,.16);
  }
  .input-wrap:focus-within .input-icon { opacity:.85; }

  .remember {
    display:flex; align-items:center; gap:9px;
    margin:6px 0 28px; cursor:pointer;
  }
  .remember input[type="checkbox"] { width:15px; height:15px; padding:0; accent-color:var(--accent); cursor:pointer; }
  .remember span { font-size:.81rem; color:var(--muted); }

  /* ── BUTTONS ── */
  .btn-primary {
    width:100%; padding:14px; border:none; border-radius:13px;
    background: linear-gradient(135deg, var(--accent) 0%, #7b52ff 100%);
    color:#fff; font-family:'Syne',sans-serif;
    font-size:.94rem; font-weight:700; letter-spacing:.05em;
    cursor:pointer; position:relative; overflow:hidden;
    box-shadow: 0 6px 30px rgba(79,124,255,.42);
    transition: transform .18s, box-shadow .18s;
  }
  .btn-primary::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.13),transparent);
    opacity:0; transition:opacity .2s;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 40px rgba(79,124,255,.55); }
  .btn-primary:hover::after { opacity:1; }
  .btn-primary:active { transform:translateY(0); }

  .divider {
    display:flex; align-items:center; gap:12px;
    margin:22px 0; color:var(--muted); font-size:.76rem;
  }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.07); }

  .social-row { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
  .btn-social {
    display:flex; align-items:center; justify-content:center; gap:8px;
    padding:11px 8px; border-radius:12px;
    border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.038);
    color:var(--ink); font-size:.82rem;
    font-family:'DM Sans',sans-serif; cursor:pointer;
    transition: background .2s, border-color .2s, transform .15s;
  }
  .btn-social:hover { background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.18); transform:translateY(-1px); }

  .signup-row { text-align:center; margin-top:24px; font-size:.82rem; color:var(--muted); }
  .signup-row a { color:var(--accent2); text-decoration:none; font-weight:500; }
  .signup-row a:hover { text-decoration:underline; }

  /* grain */
  body::after {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity:.02; pointer-events:none; z-index:9990;
  }
`;

export default function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  // ── Inject stylesheet once ──
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // ── Custom cursor ──
  useEffect(() => {
    const cur  = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    };

    const loopRing = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      rafId = requestAnimationFrame(loopRing);
    };

    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loopRing);

    const interactiveEls = document.querySelectorAll('button, a, input, label');
    const onEnter = () => {
      cur.style.width = '18px'; cur.style.height = '18px';
      ring.style.width = '52px'; ring.style.height = '52px';
      ring.style.borderColor = 'rgba(155,109,255,0.6)';
    };
    const onLeave = () => {
      cur.style.width = '10px'; cur.style.height = '10px';
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(79,124,255,0.5)';
    };
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // ── Particles ──
  useEffect(() => {
    const pWrap = document.getElementById('particles');
    if (!pWrap) return;
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const s = Math.random() * 3 + 1;
      p.style.cssText = `
        width:${s}px; height:${s}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 80}%;
        --dur:${6 + Math.random() * 10}s;
        --delay:${Math.random() * 8}s;
        --op:${0.25 + Math.random() * 0.4};
      `;
      pWrap.appendChild(p);
    }
    return () => { if (pWrap) pWrap.innerHTML = ''; };
  }, []);

  // ── Scroll-driven wallet expansion ──
  useEffect(() => {
    const scrollRoot  = document.getElementById('scrollRoot');
    const walletWrap  = document.getElementById('walletWrap');
    const walletVideo = document.getElementById('walletVideo') as HTMLVideoElement | null;
    const scrollHint  = document.getElementById('scrollHint');
    const tagline     = document.getElementById('scrollTagline');

    const onScroll = () => {
      if (!scrollRoot || !walletWrap || !walletVideo || !scrollHint || !tagline) return;
      const scrolled  = window.scrollY;
      const maxScroll = scrollRoot.offsetHeight - window.innerHeight;
      const p = Math.min(scrolled / maxScroll, 1);

      const scale = 0.5 + p * 1.15;
      walletWrap.style.setProperty('--ws', String(scale));
      walletWrap.style.setProperty('--wo', String(Math.min(0.7 + p * 0.3, 1)));

      if (scale > 1.1) {
        const ex = 60 + p * 30, ey = 56 + p * 28;
        const mask = `radial-gradient(ellipse ${ex}% ${ey}% at center, black 38%, transparent 100%)`;
        walletVideo.style.maskImage = mask;
        (walletVideo.style as any).webkitMaskImage = mask;
      }

      scrollHint.classList.toggle('hide', p > 0.05);
      tagline.classList.toggle('visible', p > 0.28 && p < 0.82);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(creds);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      {/* Custom cursors — rendered at document root level via portals ideally,
          but placed here for simplicity */}
      <div id="cursor" />
      <div id="cursor-ring" />

      <div className="scroll-root" id="scrollRoot">
        <div className="scene">

          {/* BRAND */}
          <div className="brand">
            <div className="brand-logo">💳</div>
            <span className="brand-name">eWallet</span>
          </div>

          {/* LEFT — FORM */}
          <div className="left-panel">
            <form className="glass-card" onSubmit={handleSubmit}>
              <div className="eyebrow">Welcome back</div>
              <h1 className="card-title">Sign in</h1>
              <p className="card-sub">Access your wallet dashboard</p>

              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={creds.email}
                    onChange={e => setCreds(c => ({ ...c, email: e.target.value }))}
                  />
                  <span className="input-icon">✉️</span>
                </div>
              </div>

              <div className="field">
                <div className="field-row">
                  <label htmlFor="password">Password</label>
                  <a href="#" className="forgot">Forgot password?</a>
                </div>
                <div className="input-wrap">
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={creds.password}
                    onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
                  />
                  <span className="input-icon">🔒</span>
                </div>
              </div>

              <label className="remember">
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <button type="submit" className="btn-primary">Sign In →</button>

              <div className="divider">or continue with</div>

              <div className="social-row">
                <button type="button" className="btn-social">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="btn-social">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="signup-row">
                Don't have an account? <Link to="/register">Create one free</Link>
              </div>
            </form>
          </div>

          {/* RIGHT — AMBIENT VIDEO */}
          <div className="right-panel">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div id="particles" />

            <div className="wallet-video-wrap" id="walletWrap">
              <video
                id="walletVideo"
                src={walletVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint" id="scrollHint">
            <div className="scroll-mouse" />
            <span>Scroll to explore</span>
          </div>

          {/* Tagline revealed mid-scroll */}
          <div className="scroll-tagline" id="scrollTagline">
            <h3>Your money,<br /><span>beautifully secure.</span></h3>
            <p>Send, receive &amp; track every payment — all in one elegant place.</p>
          </div>

        </div>
      </div>
    </>
  );
}