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

  .signup-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, rgba(99,179,255,0.18) 0%, rgba(180,130,255,0.14) 100%);
    backdrop-filter: blur(2px);
    padding: 10px;
    position: relative;
    overflow: hidden;
  }

  .signup-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(99,179,255,0.18) 0%, rgba(180,130,255,0.14) 100%);
    backdrop-filter: blur(2px);
    z-index: 0;
  }

  .signup-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border-radius: 28px;
    padding: 24px 38px 38px;
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

  .signup-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
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

  .signup-heading {
    font-family: 'Sora', sans-serif;
    font-size: clamp(22px, 5vw, 28px);
    font-weight: 700;
    color: #1a1f36;
    text-align: center;
    letter-spacing: -0.5px;
    margin-bottom: 2px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
  }

  .signup-subtext {
    font-size: 14px;
    color: #8692a6;
    text-align: center;
    margin-bottom: 16px;
    font-weight: 400;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .input-group {
    margin-bottom: 12px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .input-group:nth-of-type(1) { animation-delay: 0.26s; }
  .input-group:nth-of-type(2) { animation-delay: 0.31s; }
  .input-group:nth-of-type(3) { animation-delay: 0.36s; }

  .input-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
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

  .signup-input {
    width: 100%;
    padding: 10px 16px 14px 46px;
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

  .signup-input::placeholder {
    color: #b0bec5;
    font-weight: 300;
  }

  .signup-input:focus {
    border-color: #5a7fff;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(90, 127, 255, 0.1);
  }

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

  .password-strength {
    margin-top: 8px;
    animation: fadeUp 0.3s ease both;
  }

  .strength-bar-track {
    height: 4px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .strength-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease, background 0.4s ease;
  }

  .strength-label {
    font-size: 11.5px;
    font-weight: 500;
  }

  .signup-btn {
    width: 100%;
    padding: 14px;
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
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.44s both;
    position: relative;
    overflow: hidden;
    margin-top: 3px;
  }

  .signup-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0));
    border-radius: inherit;
    pointer-events: none;
  }

  .signup-btn:hover {
    background-position: 100% 0%;
    box-shadow: 0 10px 28px rgba(90, 127, 255, 0.46);
    transform: translateY(-1px);
  }

  .signup-btn:active {
    transform: translateY(1px);
    box-shadow: 0 4px 14px rgba(90, 127, 255, 0.3);
  }

  .signup-btn.loading {
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

  .error-banner {
    display: flex;
    align-items: center;
    gap: 9px;
    background: #fff5f5;
    border: 1.5px solid #fed7d7;
    border-radius: 12px;
    padding: 11px 14px;
    margin-bottom: 16px;
    font-size: 13.5px;
    color: #c53030;
    font-weight: 500;
    animation: fadeUp 0.3s ease both;
  }

  .error-banner svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    flex-shrink: 0;
  }

  .field-error {
    font-size: 12.5px;
    color: #e53e3e;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .field-error svg {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    flex-shrink: 0;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.48s both;
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

  .login-row {
    text-align: center;
    font-size: 14px;
    color: #8692a6;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.52s both;
  }

  .login-link {
    color: #5a7fff;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }

  .login-link:hover { color: #3b5bdb; }

  @media (max-width: 480px) {
    .signup-card {
      padding: 36px 24px 32px;
      border-radius: 22px;
    }
  }

  @media (max-width: 360px) {
    .signup-card {
      padding: 28px 18px 26px;
    }
  }
`;

function getStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "", width: "0%" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "Too weak",  color: "#fc8181", width: "25%" },
    { label: "Weak",      color: "#f6ad55", width: "50%" },
    { label: "Good",      color: "#68d391", width: "75%" },
    { label: "Strong",    color: "#48bb78", width: "100%" },
  ];
  return { score, ...map[Math.min(score, 3)] };
}

// ── Icon helpers ────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [showPassword, setShowPwd]      = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [fieldErrors, setFieldErrors]   = useState({});

  const navigate = useNavigate();
  const strength = getStrength(password);

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 4) errs.password = "Password must be at least 4 characters.";
    if (!confirmPassword) errs.confirm = "Please confirm your password.";
    else if (password !== confirmPassword) errs.confirm = "Passwords do not match.";
    return errs;
  };

  // ── Submit — original backend logic preserved ──────────────────────────
//   async function handleSignup(e) {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
//     setFieldErrors({});
//     setError("");
//     setLoading(true);
//     try {
//       await api.post("/signup", { email, password });
//       navigate("/login");
//     } catch (err) {
//       setError("Signup failed (user may already exist)");
//     } finally {
//       setLoading(false);
//     }
//   }

async function handleSignup(e) {
  e.preventDefault();

  try {
    const res = await api.post("/signup", {
      email,
      password,
    });

    console.log("SIGNUP SUCCESS");

    // 👉 redirect to login
    window.location.href = "/login";

  } catch (err) {
    console.error("SIGNUP ERROR", err);
    setError("Signup failed (user may already exist)");
  }
}

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">
        <div className="signup-card">

          {/* Logo */}
          <div className="signup-logo">
            <div className="logo-circle">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                   style={{ width: 28, height: 28, stroke: "#fff", strokeWidth: 2.5, fill: "none" }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="signup-heading">Create Account</h1>
          <p className="signup-subtext">Join us — it only takes a minute</p>

          {/* API error banner */}
          {error && (
            <div className="error-banner">
              <IconAlert />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} noValidate>

            {/* Email */}
            <div className="input-group">
              <label className="input-label" htmlFor="su-email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconMail /></span>
                <input
                  id="su-email"
                  type="email"
                  className="signup-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <p className="field-error"><IconAlert />{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="su-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  id="su-password"
                  type={showPassword ? "text" : "password"}
                  className="signup-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: "48px" }}
                />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {/* Strength meter */}
              {password && (
                <div className="password-strength">
                  <div className="strength-bar-track">
                    <div className="strength-bar-fill"
                      style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
              {fieldErrors.password && (
                <p className="field-error"><IconAlert />{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="su-confirm">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  id="su-confirm"
                  type={showConfirm ? "text" : "password"}
                  className="signup-input"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: "48px" }}
                />
                <button type="button" className="password-toggle"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}>
                  {showConfirm ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {fieldErrors.confirm && (
                <p className="field-error"><IconAlert />{fieldErrors.confirm}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className={`signup-btn${loading ? " loading" : ""}`}>
              {loading
                ? <><span className="btn-spinner" />Creating account…</>
                : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">ALREADY A MEMBER?</span>
            <span className="divider-line" />
          </div>

          {/* Login link */}
          <p className="login-row">
            Already have an account?{" "}
            <a href="/login" className="login-link">Log In</a>
          </p>

        </div>
      </div>
    </>
  );
}