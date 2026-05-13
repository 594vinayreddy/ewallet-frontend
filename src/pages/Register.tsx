import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { register } from '../api/authApi';
import { getProfile } from '../api/userApi';

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
  background: linear-gradient(
    135deg,
    var(--c5) 0%,
    var(--c3) 40%,
    var(--c1) 100%
  );
}

.register-page {
  min-height: 100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative;
  overflow:hidden;
}

.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  opacity: .4;
  pointer-events:none;
}

.orb-1 {
  width:500px;
  height:500px;
  background: var(--c1);
  top:-120px;
  left:-150px;
}

.orb-2 {
  width:400px;
  height:400px;
  background: var(--c3);
  bottom:-80px;
  right:-100px;
}

.orb-3 {
  width:300px;
  height:300px;
  background: var(--c4);
  bottom:25%;
  left:15%;
}

.card-wrap {
  width:min(480px,94vw);
  position:relative;
  z-index:10;
}

.brand {
  text-align:center;
  margin-bottom:28px;
}

.brand h1 {
  color:white;
  font-size:2.4rem;
}

.brand h1 span {
  color: var(--c6);
}

.brand p {
  color: rgba(255,255,255,.5);
  margin-top:5px;
}

.glass {
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,.15);
  border-radius:24px;
  padding:40px;
}

.row {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
}

.field {
  margin-bottom:18px;
}

.field label {
  display:block;
  color: var(--c6);
  margin-bottom:7px;
  font-size:.75rem;
}

.field input {
  width:100%;
  padding:12px 16px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.2);
  background: rgba(255,255,255,.08);
  color:white;
  outline:none;
}

.field input::placeholder {
  color: rgba(255,255,255,.35);
}

.field input:focus {
  border-color: var(--c8);
}

.submit-btn {
  width:100%;
  padding:14px;
  border:none;
  border-radius:14px;
  background: linear-gradient(
    135deg,
    var(--c1),
    var(--c4),
    var(--c2)
  );
  color:white;
  font-size:1rem;
  cursor:pointer;
  margin-top:10px;
  transition:0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity:.6;
  cursor:not-allowed;
}

.footer-text {
  text-align:center;
  margin-top:20px;
  color: rgba(255,255,255,.5);
}

.footer-text a {
  color: var(--c8);
  text-decoration:none;
}

.error {
  color:#ff8a8a;
  margin-bottom:15px;
  text-align:center;
  font-size:.9rem;
}

@media(max-width:480px){
  .row{
    grid-template-columns:1fr;
  }
}
`;

export default function Register() {

  const navigate = useNavigate();

  const { setToken, setUser } =
    useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
  });

  useEffect(() => {

    const style =
      document.createElement('style');

    style.textContent = CSS;

    document.head.appendChild(style);

    return () =>
      document.head.removeChild(style);

  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');

    setLoading(true);

    try {

      // REGISTER USER
      const res = await register(form);

      const { token } = res.data;

      // SAVE TOKEN
      setToken(token);

      // DECODE JWT
      const payload =
        jwtDecode<JwtPayload>(token);

      const userId =
        Number(payload.sub);

      if (isNaN(userId)) {

        throw new Error(
          'Invalid user ID in token'
        );
      }

      // FETCH FULL PROFILE
      const profileRes =
        await getProfile(token, userId);

      const profile =
        profileRes.data;

      // SAVE USER
      setUser({
        id: profile.id,

        firstName:
          profile.firstName ?? '',

        lastName:
          profile.lastName ?? '',

        email:
          profile.email ?? '',

        role:
          payload.role ?? 'USER',

        phoneNumber:
          profile.phoneNumber ?? '',

        dateOfBirth:
          profile.dateOfBirth ?? '',
      });

      // REDIRECT
      navigate('/dashboard');

    } catch (err: any) {

      console.error(err);

      if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      } else {

        setError(
          err.message ||
          'Registration failed'
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="orb orb-1"></div>

      <div className="orb orb-2"></div>

      <div className="orb orb-3"></div>

      <div className="card-wrap">

        <div className="brand">

          <h1>
            Rupee<span>Pay</span>
          </h1>

          <p>
            Open your account
          </p>

        </div>

        <div className="glass">

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="field">

                <label>
                  First Name
                </label>

                <input
                  name="firstName"
                  placeholder="Ravi"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="field">

                <label>
                  Last Name
                </label>

                <input
                  name="lastName"
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

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

            <div className="field">

              <label>Password</label>

              <input
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                minLength={8}
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>

            <div className="row">

              <div className="field">

                <label>
                  Phone Number
                </label>

                <input
                  name="phoneNumber"
                  placeholder="9876543210"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="field">

                <label>
                  Date of Birth
                </label>

                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Creating...'
                : 'Create Account →'}
            </button>

          </form>

          <p className="footer-text">
            Already have an account?{' '}

            <Link to="/">
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}