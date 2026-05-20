import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { register } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c1: #4b3e73;
  --c2: #877cbc;
  --c3: #0f034b;
  --c4: #786ac0;
  --c5: #22162f;
  --c6: #c5bedb;
  --c8: #a99fd0;
}

body {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background: linear-gradient(135deg, var(--c5) 0%, var(--c3) 40%, var(--c1) 100%);
}

.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  opacity: .4;
  pointer-events: none;
}

.orb-1 { width:500px; height:500px; background:var(--c1); top:-120px; left:-150px; }
.orb-2 { width:400px; height:400px; background:var(--c3); bottom:-80px; right:-100px; }
.orb-3 { width:300px; height:300px; background:var(--c4); bottom:25%; left:15%; }

.card-wrap {
  width: min(480px, 94vw);
  position: relative;
  z-index: 10;
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}

.brand h1 { color: white; font-size: 2.4rem; }
.brand h1 span { color: var(--c6); }
.brand p { color: rgba(255,255,255,.5); margin-top: 5px; }

.glass {
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 24px;
  padding: 40px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field { margin-bottom: 18px; }

.field label {
  display: block;
  color: var(--c6);
  margin-bottom: 7px;
  font-size: .75rem;
}

.field input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.2);
  background: rgba(255,255,255,.08);
  color: white;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: .92rem;
  transition: border-color .2s;
}

.field input::placeholder { color: rgba(255,255,255,.35); }
.field input:focus { border-color: var(--c8); }
.field input.input-error { border-color: #ff6b6b; }
.field input.input-ok    { border-color: #4ade80; }

.field input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) opacity(.45);
  cursor: pointer;
}

/* ── Password wrapper (relative for eye icon) ── */
.pw-wrap {
  position: relative;
}

.pw-wrap input {
  padding-right: 44px;
}

.eye-btn {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,.4);
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  transition: color .15s;
}

.eye-btn:hover { color: rgba(255,255,255,.75); }

/* ── Password strength bar ── */
.strength-bar-wrap {
  display: flex;
  gap: 5px;
  margin-top: 8px;
}

.strength-seg {
  flex: 1;
  height: 4px;
  border-radius: 99px;
  background: rgba(255,255,255,.1);
  transition: background .3s;
}

.strength-seg.weak    { background: #ef4444; }
.strength-seg.fair    { background: #f97316; }
.strength-seg.good    { background: #eab308; }
.strength-seg.strong  { background: #4ade80; }

.strength-label {
  font-size: .72rem;
  margin-top: 6px;
  min-height: 16px;
}

.strength-label.weak   { color: #ef4444; }
.strength-label.fair   { color: #f97316; }
.strength-label.good   { color: #eab308; }
.strength-label.strong { color: #4ade80; }

/* ── Password rules checklist ── */
.pw-rules {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pw-rule {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: .75rem;
  color: rgba(255,255,255,.38);
  transition: color .2s;
}

.pw-rule.met { color: #4ade80; }

.pw-rule-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  flex-shrink: 0;
  transition: background .2s;
}

.pw-rule.met .pw-rule-dot { background: #4ade80; }

/* ── Field-level hint ── */
.field-hint {
  font-size: .72rem;
  margin-top: 5px;
  min-height: 14px;
  color: #ff8a8a;
}

/* ── Submit ── */
.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--c1), var(--c4), var(--c2));
  color: white;
  font-size: 1rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  margin-top: 10px;
  transition: transform .15s, box-shadow .15s, opacity .15s;
  box-shadow: 0 4px 24px rgba(75,62,115,.6);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(120,106,192,.65);
}

.submit-btn:active:not(:disabled) { transform: translateY(0); }

.submit-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.footer-text {
  text-align: center;
  margin-top: 20px;
  color: rgba(255,255,255,.5);
  font-size: .85rem;
}

.footer-text a { color: var(--c8); text-decoration: none; }
.footer-text a:hover { text-decoration: underline; }

.error {
  color: #ff8a8a;
  background: rgba(255,80,80,.1);
  border: 1px solid rgba(255,80,80,.25);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
  text-align: center;
  font-size: .88rem;
}

@media (max-width: 480px) {
  .row { grid-template-columns: 1fr; }
  .glass { padding: 32px 22px 28px; }
}
`;

// ── Validation helpers ──────────────────────────────────────────────────────

interface PwRules {
  minLength: boolean;   // ≥ 8 chars
  uppercase: boolean;   // at least one A-Z
  lowercase: boolean;   // at least one a-z
  number: boolean;      // at least one digit
  special: boolean;     // at least one special char
}

function getPwRules(pw: string): PwRules {
  return {
    minLength: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[^A-Za-z0-9]/.test(pw),
  };
}

type Strength = '' | 'weak' | 'fair' | 'good' | 'strong';

function getStrength(rules: PwRules): Strength {
  const met = Object.values(rules).filter(Boolean).length;
  if (met === 0) return '';
  if (met <= 2)  return 'weak';
  if (met === 3) return 'fair';
  if (met === 4) return 'good';
  return 'strong';
}

const STRENGTH_LABELS: Record<Strength, string> = {
  '':       '',
  weak:     'Weak — too easy to guess',
  fair:     'Fair — could be stronger',
  good:     'Good — almost there',
  strong:   'Strong — great password!',
};

/** Returns true if user is at least `minAge` years old based on DOB string (YYYY-MM-DD) */
function meetsAgeRequirement(dob: string, minAge = 13): boolean {
  if (!dob) return false;
  const birth   = new Date(dob);
  const today   = new Date();
  const cutoff  = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  return birth <= cutoff;
}

/** Max date allowed in the date picker (today minus 13 years) */
function maxDobDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 13);
  return d.toISOString().split('T')[0];
}

// ── Component ───────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [dobTouched, setDobTouched] = useState(false);

  const [form, setForm] = useState({
    firstName:   '',
    lastName:    '',
    email:       '',
    password:    '',
    phoneNumber: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Derived password state
  const pwRules    = getPwRules(form.password);
  const strength   = getStrength(pwRules);
  const pwIsValid  = strength === 'strong' || strength === 'good'; // all 5 rules met = strong; we require all 5
  const pwAllMet   = Object.values(pwRules).every(Boolean);

  // Derived DOB state
  const dobValid   = meetsAgeRequirement(form.dateOfBirth, 13);
  const dobError   = dobTouched && form.dateOfBirth && !dobValid
    ? 'You must be at least 13 years old to register.'
    : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    if (name === 'password' && !pwTouched) setPwTouched(true);
    if (name === 'dateOfBirth' && !dobTouched) setDobTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ── Client-side guards ──
    if (!pwAllMet) {
      setError('Please choose a stronger password that meets all the requirements.');
      setPwTouched(true);
      return;
    }

    if (!meetsAgeRequirement(form.dateOfBirth, 13)) {
      setError('You must be at least 13 years old to create an account.');
      setDobTouched(true);
      return;
    }

    setLoading(true);

    try {
      const res         = await register(form);
      const { token }   = res.data;

      setToken(token);

      const payload = jwtDecode<JwtPayload>(token);
      const userId  = Number(payload.sub);

      if (isNaN(userId)) throw new Error('Invalid user ID in token');

      setUser({
        id:          userId,
        firstName:   form.firstName,
        lastName:    form.lastName,
        email:       payload.email || form.email,
        role:        payload.role  || 'USER',
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth,
      });

      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Strength bar segments (4 segments)
  const segCount = strength === '' ? 0 : strength === 'weak' ? 1 : strength === 'fair' ? 2 : strength === 'good' ? 3 : 4;
  const segClass = (i: number) => (i < segCount ? strength : '');

  return (
    <div className="register-page">

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="card-wrap">

        <div className="brand">
          <h1>💳 <span>eWallet</span></h1>
          <p>Open your account</p>
        </div>

        <div className="glass">

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Name row */}
            <div className="row">
              <div className="field">
                <label>First Name</label>
                <input
                  name="firstName"
                  placeholder="Ravi"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Last Name</label>
                <input
                  name="lastName"
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="ravi@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="field">
              <label>Password</label>

              <div className="pw-wrap">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={
                    pwTouched && form.password
                      ? pwAllMet ? 'input-ok' : 'input-error'
                      : ''
                  }
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Strength bar — only shown once user starts typing */}
              {pwTouched && form.password && (
                <>
                  <div className="strength-bar-wrap">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`strength-seg ${segClass(i)}`} />
                    ))}
                  </div>
                  <div className={`strength-label ${strength}`}>
                    {STRENGTH_LABELS[strength]}
                  </div>

                  {/* Rule checklist */}
                  <div className="pw-rules">
                    {([
                      [pwRules.minLength, 'At least 8 characters'],
                      [pwRules.uppercase, 'One uppercase letter (A–Z)'],
                      [pwRules.lowercase, 'One lowercase letter (a–z)'],
                      [pwRules.number,    'One number (0–9)'],
                      [pwRules.special,   'One special character (!@#$…)'],
                    ] as [boolean, string][]).map(([met, text]) => (
                      <div key={text} className={`pw-rule${met ? ' met' : ''}`}>
                        <span className="pw-rule-dot" />
                        {met ? '✓' : ''} {text}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Phone + DOB row */}
            <div className="row">
              <div className="field">
                <label>Phone Number</label>
                <input
                  name="phoneNumber"
                  placeholder="9876543210"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  max={maxDobDate()}        // browser blocks future / too-young dates
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  onBlur={() => setDobTouched(true)}
                  className={dobError ? 'input-error' : form.dateOfBirth && dobValid ? 'input-ok' : ''}
                  required
                />
                {dobError && (
                  <div className="field-hint">{dobError}</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

          </form>

          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}