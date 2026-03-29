import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .login-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, rgba(99,179,255,0.18) 0%, rgba(180,130,255,0.14) 100%);
    backdrop-filter: blur(2px);
    // background-image: url('/login_bg.png');
    // background-size: cover;
    // background-position: center;
    // background-repeat: no-repeat;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(99,179,255,0.18) 0%, rgba(180,130,255,0.14) 100%);
    backdrop-filter: blur(2px);
    z-index: 0;
  }

  .login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border-radius: 28px;
    padding: 32px 38px 38px;
    box-shadow:
      0 8px 40px rgba(80, 120, 200, 0.13),
      0 1.5px 0px rgba(255,255,255,0.9) inset,
      0 0 0 1px rgba(180,200,255,0.18);
    animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .login-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    animation: logoIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
  }

  @keyframes logoIn {
    from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .logo-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(145deg, #5db8ff 0%, #5a7fff 60%, #a78bfa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 6px 24px rgba(90, 127, 255, 0.38),
      0 2px 0 rgba(255,255,255,0.35) inset;
  }

  .logo-circle svg {
    width: 28px;
    height: 28px;
    stroke: #fff;
    stroke-width: 2.5;
    fill: none;
  }

  .login-heading {
    font-family: 'Sora', sans-serif;
    font-size: clamp(22px, 5vw, 28px);
    font-weight: 700;
    color: #1a1f36;
    text-align: center;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
  }

  .login-subtext {
    font-size: 14px;
    color: #8692a6;
    text-align: center;
    margin-bottom: 22px;
    font-weight: 400;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .input-group {
    margin-bottom: 14px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .input-group:nth-child(1) { animation-delay: 0.26s; }
  .input-group:nth-child(2) { animation-delay: 0.32s; }

  .input-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 5px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 16px;
    color: #a0aec0;
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: color 0.2s;
  }

  .input-icon svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 1.8;
    fill: none;
  }

  .login-input {
    width: 100%;
    padding: 12px 16px 14px 44px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #1a1f36;
    background: rgba(247, 250, 255, 0.75);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
  }

  .login-input::placeholder {
    color: #b0bec5;
    font-weight: 300;
  }

  .login-input:focus {
    border-color: #5a7fff;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(90, 127, 255, 0.1);
  }

  .login-input:focus + .input-focus-ring,
  .input-wrapper:focus-within .input-icon {
    color: #5a7fff;
  }

  .password-toggle {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: #a0aec0;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.2s;
  }

  .password-toggle:hover { color: #5a7fff; }

  .password-toggle svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 1.8;
    fill: none;
  }

  .login-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    margin-top: 4px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both;
  }

  .remember-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    color: #64748b;
    cursor: pointer;
    user-select: none;
  }

  .remember-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 5px;
    border: 1.5px solid #cbd5e1;
    background: #fff;
    cursor: pointer;
    accent-color: #5a7fff;
  }

  .forgot-link {
    font-size: 13.5px;
    color: #5a7fff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s, text-decoration 0.2s;
  }

  .forgot-link:hover {
    color: #3b5bdb;
    text-decoration: underline;
  }

  .login-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 14px;
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(110deg, #5db8ff 0%, #5a7fff 50%, #818cf8 100%);
    background-size: 200% 100%;
    background-position: 0% 0%;
    box-shadow: 0 6px 22px rgba(90, 127, 255, 0.38);
    transition: background-position 0.4s ease, box-shadow 0.25s, transform 0.15s;
    letter-spacing: 0.2px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
    position: relative;
    overflow: hidden;
  }

  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0));
    border-radius: inherit;
    pointer-events: none;
  }

  .login-btn:hover {
    background-position: 100% 0%;
    box-shadow: 0 10px 30px rgba(90, 127, 255, 0.46);
    transform: translateY(-1px);
  }

  .login-btn:active {
    transform: translateY(1px);
    box-shadow: 0 4px 14px rgba(90, 127, 255, 0.3);
  }

  .login-btn.loading {
    pointer-events: none;
    opacity: 0.8;
  }

  .btn-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.44s both;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  }

  .divider-text {
    font-size: 12px;
    color: #a0aec0;
    font-weight: 500;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .signup-row {
    text-align: center;
    font-size: 14px;
    color: #8692a6;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.48s both;
  }

  .signup-link {
    color: #5a7fff;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }

  .signup-link:hover { color: #3b5bdb; }

  .error-msg {
    font-size: 12.5px;
    color: #e53e3e;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .error-msg svg {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    flex-shrink: 0;
  }

  /* Responsive tweaks */
  @media (max-width: 480px) {
    .login-card {
      padding: 36px 24px 32px;
      border-radius: 22px;
    }
  }

  @media (max-width: 360px) {
    .login-card {
      padding: 28px 18px 26px;
    }
    .login-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 4) errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }

  setErrors({});
  setLoading(true);

  try {
    const res = await api.post("/login", {
      email,
      password,
    });

    // ✅ Save token
    localStorage.setItem("token", res.data.token);

    // ✅ Redirect (IMPORTANT)
    window.location.href = "/";

  } catch (err) {
    setErrors({
      general: "Invalid email or password",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <div className="logo-circle">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="login-heading">Welcome Back!</h1>
          <p className="login-subtext">Sign in to continue to your account</p>
          {errors.general && (
            <p className="error-msg">{errors.general}</p>
            )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2,4 12,13 22,4"/>
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="error-msg">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-msg">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Meta row */}
            <div className="login-meta">
              <label className="remember-label">
                <input
                  type="checkbox"
                  className="remember-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {/* Submit */}
            <button type="submit" className={`login-btn${loading ? " loading" : ""}`}>
              {loading ? <><span className="btn-spinner" />Signing in…</> : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">NEW HERE?</span>
            <span className="divider-line" />
          </div>

          {/* Sign up */}
          <p className="signup-row">
            Don't have an account?{" "}
            <a href="/signup" className="signup-link">Sign Up</a>
          </p>

        </div>
      </div>
    </>
  );
}