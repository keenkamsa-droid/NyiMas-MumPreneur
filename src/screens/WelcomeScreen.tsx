import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND } from '../data/mockData';

export const WelcomeScreen: React.FC = () => {
  const { signIn, navigateTo, showToast } = useApp();

  const [email, setEmail] = useState('keenkamsa@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setEmailError('Please enter your password.');
      return;
    }
    setEmailError('');
    setIsLoading(true);

    const result = await signIn(email, password);
    setIsLoading(false);
    if (!result.success && result.error) {
      setEmailError(result.error);
    }
  };

  const handleGuestBrowse = () => {
    showToast('Browsing as guest. Welcome to NyiMas Kitchen!');
    navigateTo('home');
  };

  const handleGoogleSignIn = () => {
    showToast('Please sign in with Email and Password.', 'info');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email', 'error');
      return;
    }
    showToast(`Password reset link sent to ${forgotEmail}. Check your inbox!`);
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf9f5] relative overflow-hidden pb-8">
      {/* Ambient Decorative Glows */}
      <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-[#ffdea9]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-80 -right-24 w-80 h-80 rounded-full bg-[#bbeed1]/25 blur-3xl pointer-events-none" />

      {/* Top Silhouette Bar */}
      <div className="w-full flex justify-center pt-3 pb-1">
        <div className="h-1 w-12 rounded-full bg-[#f2be5f]/40" />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-5 py-4">
        {/* Brand Emblem & Identity Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-5">
          {/* Emblem Avatar with Barakah Gold Glow */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#f2be5f] via-[#013623] to-[#ffc969] shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-[#013623]/5" />
                <span
                  className="material-symbols-outlined text-[#013623] text-[34px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  skillet
                </span>
                <span className="font-serif-display text-[#013623] text-[10px] tracking-widest uppercase font-bold -mt-0.5">
                  NYIMAS
                </span>
              </div>
            </div>
            {/* Halal Trust Mini Badge */}
            <div className="absolute -bottom-1 -right-1.5 bg-[#ffc969] text-[#271900] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold">100% Halal</span>
            </div>
          </div>

          {/* Official Business Title & Location */}
          <h1 className="font-serif-display text-2xl font-bold text-[#013623] tracking-tight">
            NyiMas MumPreneur
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-[#414943] text-xs font-semibold">
            <span>Muslim-Owned</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#7d5800]" />
            <span>Singapore</span>
            <span
              className="material-symbols-outlined text-[15px] text-[#013623]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              spa
            </span>
          </div>

          {/* Tagline Pill Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdea9]/40 text-[#271900] shadow-sm">
            <span
              className="material-symbols-outlined text-[#7d5800] text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold">
              Cooked with Love • Fresh Daily • Halal Certified
            </span>
          </div>

          {/* Editorial Welcoming Copy */}
          <div className="mt-4 space-y-1.5">
            <h2 className="font-serif-display text-3xl text-[#013623] leading-tight font-bold">
              Good Food,<br />
              <span className="italic font-normal text-[#7d5800]">Made with Love.</span>
            </h2>
            <p className="text-sm text-[#414943] px-2 leading-relaxed max-w-xs">
              Welcome to NyiMas MumPreneur. Discover our signature homemade meals, premium rice
              dishes, catering platters, and Friday Infaq food-sharing packages.
            </p>
          </div>
        </div>

        {/* Sign In Form Container */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#efeeea] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f2be5f] via-[#013623] to-[#ffc969] opacity-80" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="email-input" className="text-xs font-bold text-[#1b1c1a]">
                  Email Address
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('nabilah.rahman@gmail.com');
                    setPassword('Password123!');
                    setEmailError('');
                  }}
                  className="text-[10px] text-[#013623] hover:underline font-bold"
                >
                  Quick Demo Login
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="e.g. name@email.com"
                  className="w-full bg-[#f4f4f0] text-[#1b1c1a] placeholder:text-[#717973]/70 text-sm pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-[#013623] transition-all"
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-[#ba1a1a] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password-input" className="text-xs font-bold text-[#1b1c1a]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#013623] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#f4f4f0] text-[#1b1c1a] placeholder:text-[#717973]/70 text-sm pl-11 pr-11 py-3 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-[#013623] transition-all"
                  required
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-[#717973] hover:text-[#1b1c1a]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* PDPA Note */}
            <div className="bg-[#f4f4f0] rounded-xl p-2.5 flex items-start gap-2">
              <span
                className="material-symbols-outlined text-[#7d5800] text-[16px] mt-0.5 shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_with_heart
              </span>
              <p className="text-[11px] text-[#414943] leading-snug">
                Protected by Singapore PDPA &amp; instant OTP security verification for MumPreneur club members.
              </p>
            </div>

            {/* Sign In CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#013623] hover:bg-[#1e4d38] active:scale-[0.98] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-[18px] text-[#ffdea9]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-4 pt-2 text-center">
            <p className="text-xs text-[#414943]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('create-account')}
                className="text-[#013623] font-bold underline underline-offset-2 ml-0.5 hover:text-[#1e4d38]"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center my-4">
            <div className="flex-grow h-px bg-[#efeeea]" />
            <span className="flex-shrink mx-3 text-[10px] text-[#717973] uppercase tracking-wider bg-white px-1">
              or continue with
            </span>
            <div className="flex-grow h-px bg-[#efeeea]" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-11 bg-[#f4f4f0] hover:bg-[#efeeea] text-[#1b1c1a] font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-colors active:scale-[0.99] border border-[#efeeea]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Guest Exploration */}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleGuestBrowse}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f4f0] hover:bg-[#efeeea] text-[#414943] text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">travel_explore</span>
              <span>Browse as Guest</span>
              <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Security & Halal Reassurance */}
        <div className="mt-4 bg-[#f4f4f0] rounded-xl p-2.5 flex items-center justify-around text-center border border-[#efeeea]">
          <div className="flex items-center gap-1 text-[#414943]">
            <span
              className="material-symbols-outlined text-[#7d5800] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              restaurant_menu
            </span>
            <span className="text-[10px] font-bold">100% Halal Muslim Kitchen</span>
          </div>
          <div className="w-1 h-3 rounded-full bg-[#c0c9c1]" />
          <div className="flex items-center gap-1 text-[#414943]">
            <span
              className="material-symbols-outlined text-[#013623] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock_clock
            </span>
            <span className="text-[10px] font-bold">PDPA &amp; SSL Encrypted</span>
          </div>
        </div>

        {/* Culinary Highlight Preview Card */}
        <div
          onClick={() => navigateTo('menu')}
          className="mt-4 rounded-xl border border-[#efeeea] bg-white p-2.5 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-[#f4f4f0] transition-colors"
        >
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#efeeea]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZmSHz0Z2Mh1MEqt8oLAyAZSQjllSr0G29sF73XZxOcSbLGvSuOrK505C_J_-e9DG2Z_ogz0-qCzW9CIDElZfyF5jQWH8sHwP_zTXvkn4RKzSYLtAqR46Opkw0jN2KMXvrGNmluAWqhVTA8JXpIdLr8b9dcqxrIjPzfTWETUEWLUVlby0Nkl1tcy48a5SghkZlPP44NhaiFOfnJmIvdlZlyIwt19_bQEiG6tzcAN-8XTfP4wFvJY0"
              alt="Signature Nasi Ambeng"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 bg-[#013623]/90 text-white rounded px-1 text-[8px] font-bold uppercase">
              Infaq
            </div>
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[#7d5800] text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-[11px] text-[#7d5800] font-bold">4.9 / 5.0</span>
              <span className="text-[#414943] text-[10px]">• 1,240+ platters served</span>
            </div>
            <p className="font-serif-display text-xs text-[#013623] font-bold truncate mt-0.5">
              Signature Rice Dishes &amp; Friday Infaq
            </p>
            <p className="text-[10px] text-[#717973] truncate">
              Handcrafted with maternal devotion in Pasir Ris &amp; Tampines.
            </p>
          </div>
        </div>

        {/* Legal Footer */}
        <footer className="mt-5 text-center">
          <p className="text-[11px] text-[#414943]">
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="underline font-semibold text-[#013623] hover:text-[#1e4d38]"
            >
              Terms &amp; Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="underline font-semibold text-[#013623] hover:text-[#1e4d38]"
            >
              Privacy Policy
            </button>
            .
          </p>
          <p className="mt-1 text-[10px] text-[#717973] uppercase tracking-wider font-semibold">
            NyiMas MumPreneur SG • Berkat, Lazat, Suci
          </p>
        </footer>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-lg font-bold text-[#013623]">
                Lupa Kata Laluan?
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-7 h-7 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#414943] mt-2">
              Masukkan alamat emel berdaftar anda untuk menerima pautan penetapan semula kata laluan.
            </p>
            <form onSubmit={handleResetPassword} className="mt-3 space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="cth: keenkamsa@gmail.com"
                className="w-full bg-[#f4f4f0] text-sm p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#013623]"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#013623] text-white font-bold text-xs"
              >
                Hantar Pautan Reset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-lg font-bold text-[#013623]">
                Terms &amp; Privacy Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="text-xs text-[#414943] space-y-3 py-3 leading-relaxed">
              <p>
                <strong>1. Halal Compliance &amp; Kitchen Standard:</strong> NyiMas MumPreneur is a 100% Muslim-owned Singapore home culinary business. All meats are sourced from MUIS-halal certified suppliers.
              </p>
              <p>
                <strong>2. Pre-Order &amp; Batch Dispatch:</strong> Orders require 24h advance reservation. Cancellation within 12 hours of batch cooking is non-refundable.
              </p>
              <p>
                <strong>3. Friday Infaq Contributions:</strong> Friday Mosque Infaq contributions are distributed directly to partner mosque welfare bureaus before Friday prayers. Photos and WhatsApp updates are dispatched following distribution.
              </p>
              <p>
                <strong>4. PDPA Compliance:</strong> Your mobile number and delivery addresses are collected strictly for delivery dispatch and verification.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white font-bold text-xs"
            >
              Saya Faham (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
