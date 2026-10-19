import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CreateAccountScreen: React.FC = () => {
  const { createAccount, navigateTo, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setFullName('Nabilah Binte Rahman');
    setEmail('nabilah.rahman@gmail.com');
    setPhone('9123 4567');
    setPassword('Barakah2025!');
    setConfirmPassword('Barakah2025!');
    setAgreeTerms(true);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    // Clean phone number (strip spaces, symbols, and optional leading 65)
    const digitsOnly = phone.replace(/\D/g, '');
    let cleanPhone = digitsOnly;
    if (cleanPhone.startsWith('65') && cleanPhone.length > 8) {
      cleanPhone = cleanPhone.slice(2);
    }

    if (cleanPhone.length < 8) {
      setErrorMsg('Please enter an 8-digit Singapore mobile number (e.g. 9123 4567 or 8123 4567)');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    const result = await createAccount({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: `+65 ${cleanPhone}`,
      password,
    });

    setIsLoading(false);
    if (!result.success && result.error) {
      setErrorMsg(result.error);
    }
  };

  const handleGoogleSignup = () => {
    showToast('Please register with Email and Password.', 'info');
  };

  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf9f5] relative overflow-hidden pb-10">
      <div className="max-w-md mx-auto w-full px-5 pt-safe">
        {/* Top Back Action Bar */}
        <div className="flex items-center justify-between pt-3 pb-3">
          <button
            type="button"
            onClick={() => navigateTo('welcome')}
            aria-label="Go back to Sign In"
            className="w-10 h-10 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#1b1c1a] shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdea9] text-[#271900]">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold">100% Halal Singapore</span>
          </div>
        </div>

        {/* Brand Emblem Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-5">
          <div className="relative flex items-center justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-[#1e4d38] flex items-center justify-center shadow-md relative">
              <span className="material-symbols-outlined text-[#ffc969] text-[32px]">skillet</span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7d5800] text-white flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-[#7d5800] font-bold tracking-widest uppercase mb-0.5">
            Muslim-Owned • Singapore
          </span>
          <h1 className="font-serif-display text-2xl text-[#013623] font-bold tracking-tight">
            NyiMas MumPreneur
          </h1>
          <div className="mt-1 px-3 py-0.5 rounded-full bg-[#e9e8e4] text-[#414943]">
            <p className="text-[10px] tracking-wider uppercase font-semibold">
              Cooked with Love • Fresh Daily • Halal Certified
            </p>
          </div>
          <div className="mt-3 px-2">
            <h2 className="font-serif-display text-xl text-[#1b1c1a] font-bold">
              Create Your Account
            </h2>
            <p className="text-xs text-[#414943] mt-1 max-w-[300px] mx-auto">
              Join NyiMas MumPreneur to order delicious homemade meals, catering platters, and Friday Infaq packages.
            </p>
          </div>
        </div>

        {/* Welcome Perk Alert Banner */}
        <div className="mb-4 p-3.5 rounded-2xl bg-[#ffdea9] text-[#271900] flex items-start gap-3 shadow-sm border border-[#ffdea9]/80">
          <span className="material-symbols-outlined text-[#7d5800] text-[22px] shrink-0 mt-0.5">
            redeem
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#7d5800] font-bold">Welcome Gift: S$3.50 OFF</p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] underline font-bold text-[#013623] hover:text-[#1e4d38]"
              >
                Auto-Fill Sample
              </button>
            </div>
            <p className="text-xs text-[#271900] mt-0.5 leading-snug">
              Enjoy <span className="font-bold">S$3.50 OFF</span> your first artisanal order
              with promo code <span className="font-bold underline tracking-wide">BARAKAHFIRST</span>.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 bg-white p-5 rounded-2xl shadow-sm border border-[#efeeea]">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reg-fullname" className="text-xs font-bold text-[#1b1c1a]">
              Full Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[20px] pointer-events-none">
                person
              </span>
              <input
                id="reg-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Tan or Ahmad Ali"
                className="w-full h-11 pl-11 pr-3 bg-[#f4f4f0] rounded-xl text-xs text-[#1b1c1a] placeholder:text-[#717973] outline-none focus:bg-white focus:ring-1 focus:ring-[#013623]"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor="reg-email" className="text-xs font-bold text-[#1b1c1a]">
                Email Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <span className="text-[10px] text-[#013623] flex items-center gap-1 font-semibold">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                For order receipts
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[20px] pointer-events-none">
                mail
              </span>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full h-11 pl-11 pr-3 bg-[#f4f4f0] rounded-xl text-xs text-[#1b1c1a] placeholder:text-[#717973] outline-none focus:bg-white focus:ring-1 focus:ring-[#013623]"
                required
              />
            </div>
          </div>

          {/* Mobile Number with Singapore Flag Prefix */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reg-phone" className="text-xs font-bold text-[#1b1c1a]">
              Singapore Mobile Number <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 bg-[#f4f4f0] rounded-xl text-[#1b1c1a] shrink-0 border border-[#efeeea]">
                <span className="text-sm">🇸🇬</span>
                <span className="text-xs font-bold">+65</span>
              </div>
              <div className="relative flex-1 flex items-center">
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9123 4567 or 8123 4567"
                  className="w-full h-11 px-3 bg-[#f4f4f0] rounded-xl text-xs text-[#1b1c1a] placeholder:text-[#717973] outline-none focus:bg-white focus:ring-1 focus:ring-[#013623] tracking-wide"
                  required
                />
              </div>
            </div>
            <p className="text-[10px] text-[#414943] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-[#013623]">chat</span>
              Used for delivery driver updates and order confirmation
            </p>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor="reg-password" className="text-xs font-bold text-[#1b1c1a]">
                Password <span className="text-[#ba1a1a]">*</span>
              </label>
              <span className="text-[10px] text-[#717973]">Min. 6 characters</span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[20px] pointer-events-none">
                lock
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 pl-11 pr-11 bg-[#f4f4f0] rounded-xl text-xs text-[#1b1c1a] placeholder:text-[#717973] outline-none focus:bg-white focus:ring-1 focus:ring-[#013623] tracking-wider"
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor="reg-confirm" className="text-xs font-bold text-[#1b1c1a]">
                Confirm Password <span className="text-[#ba1a1a]">*</span>
              </label>
              {isPasswordMatch && (
                <div className="flex items-center gap-1 text-[#013623] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                  <span>Passwords match</span>
                </div>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[20px] pointer-events-none">
                lock_reset
              </span>
              <input
                id="reg-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-11 pl-11 pr-11 bg-[#f4f4f0] rounded-xl text-xs text-[#1b1c1a] placeholder:text-[#717973] outline-none focus:bg-white focus:ring-1 focus:ring-[#013623] tracking-wider"
                required
              />
              <button
                type="button"
                aria-label="Toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 p-1 text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex flex-col gap-1 mt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#013623] accent-[#013623]"
              />
              <span className="text-xs text-[#414943] leading-snug">
                I agree to the{' '}
                <span className="text-[#013623] font-semibold underline">Terms &amp; Conditions</span>{' '}
                and{' '}
                <span className="text-[#013623] font-semibold underline">Privacy Policy</span>.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-1 bg-[#1e4d38] hover:bg-[#013623] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-[#e9e8e4]" />
          <span className="px-3 text-[11px] text-[#717973] uppercase tracking-wider font-semibold">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-[#e9e8e4]" />
        </div>

        {/* Google Quick Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full h-11 bg-white border border-[#efeeea] rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold text-[#1b1c1a] shadow-xs hover:bg-[#f4f4f0] active:scale-98 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Link back to Sign In */}
        <div className="mt-4 text-center pb-6">
          <p className="text-xs text-[#414943]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigateTo('welcome')}
              className="font-bold text-[#013623] hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
