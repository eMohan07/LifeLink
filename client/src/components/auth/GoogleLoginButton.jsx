import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import {
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  checkGoogleRedirectResult,
} from '../../firebase';
import { BLOOD_GROUPS } from '../../utils/bloodCompatibility';
import { Droplet, Phone, ArrowRight, X, Loader2, AlertCircle } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
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
);

export const GoogleLoginButton = ({ redirect = '/', label = 'Continue with Google' }) => {
  const { loginWithGoogle } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingIdToken, setPendingIdToken] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [phone, setPhone] = useState('');
  const [submittingModal, setSubmittingModal] = useState(false);

  // Check for redirect result on page mount (for fallback flow)
  useEffect(() => {
    let isMounted = true;
    const processRedirectResult = async () => {
      try {
        const redirectData = await checkGoogleRedirectResult();
        if (redirectData && isMounted) {
          setLoading(true);
          setInlineError(null);
          const res = await loginWithGoogle({ idToken: redirectData.idToken });
          if (res?.needsProfile) {
            setPendingIdToken(redirectData.idToken);
            setPendingName(res.name || redirectData.user?.displayName || 'Donor');
            setShowModal(true);
          } else if (res?._id) {
            showSuccess(`Welcome, ${res.name}!`);
            handleRedirect(res);
          }
        }
      } catch (err) {
        if (isMounted) {
          classifyAndSetError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    processRedirectResult();
    return () => {
      isMounted = false;
    };
  }, []);

  const classifyAndSetError = (err) => {
    // 1. Popup closed or cancelled by user: reset silently
    if (
      err.code === 'auth/popup-closed-by-user' ||
      err.code === 'auth/cancelled-popup-request'
    ) {
      setInlineError(null);
      return;
    }

    // 2. Popup blocked by browser
    if (err.code === 'auth/popup-blocked') {
      setInlineError({
        type: 'popup_blocked',
        message: 'Popup was blocked by your browser. Please allow popups for this site, or try redirect sign-in.',
      });
      return;
    }

    // 3. Unauthorized domain in Firebase Console
    if (err.code === 'auth/unauthorized-domain') {
      setInlineError({
        type: 'unauthorized_domain',
        message: 'This domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).',
      });
      return;
    }

    // 4. Provider disabled in Firebase Console
    if (err.code === 'auth/operation-not-allowed') {
      setInlineError({
        type: 'operation_not_allowed',
        message: 'Google sign-in is not enabled in Firebase Console (Authentication > Sign-in method).',
      });
      return;
    }

    // 5. 15s timeout
    if (
      err.code === 'ECONNABORTED' ||
      err.code === 'auth/popup-timeout' ||
      err.message?.toLowerCase().includes('timeout')
    ) {
      setInlineError({
        type: 'timeout',
        message: 'Authentication timed out after 15 seconds. Please check your backend server and try again.',
      });
      return;
    }

    // 6. Network / server unreachable
    if (
      err.code === 'ERR_NETWORK' ||
      err.code === 'auth/network-request-failed' ||
      err.response?.status === 502 ||
      err.response?.status === 503 ||
      err.message?.includes('Network Error') ||
      err.message?.includes("Can't reach the LifeLink server")
    ) {
      setInlineError({
        type: 'unreachable',
        message: "Can't reach the LifeLink server. Please check that the backend is running and try again.",
      });
      return;
    }

    // 7. Account type not allowed
    if (
      err.response?.status === 403 ||
      err.response?.data?.errors?.code === 'ACCOUNT_TYPE_NOT_ALLOWED' ||
      err.response?.data?.message?.toLowerCase().includes('account type') ||
      err.message?.toLowerCase().includes('account type')
    ) {
      setInlineError({
        type: 'account_type',
        message: err.response?.data?.message || 'This account type is not permitted for Google sign-in. Please use email and password.',
      });
      return;
    }

    // 8. Token rejected
    if (
      err.response?.status === 401 ||
      err.message?.toLowerCase().includes('invalid or expired') ||
      err.message?.toLowerCase().includes('token')
    ) {
      setInlineError({
        type: 'token_rejected',
        message: err.response?.data?.message || 'Google authentication token was rejected. Please try again.',
      });
      return;
    }

    // Fallback general error
    setInlineError({
      type: 'general',
      message: err.response?.data?.message || err.message || 'Google sign-in failed. Please try again.',
    });
  };

  const handleGoogleClick = async () => {
    setInlineError(null);
    setLoading(true);
    try {
      const { idToken, user } = await signInWithGooglePopup();
      const res = await loginWithGoogle({ idToken });

      if (res?.needsProfile) {
        setPendingIdToken(idToken);
        setPendingName(res.name || user.displayName || 'Donor');
        setShowModal(true);
      } else if (res?._id) {
        showSuccess(`Welcome, ${res.name}!`);
        handleRedirect(res);
      }
    } catch (err) {
      classifyAndSetError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectSignIn = async () => {
    setInlineError(null);
    setLoading(true);
    try {
      await signInWithGoogleRedirect();
    } catch (err) {
      classifyAndSetError(err);
      setLoading(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!bloodGroup) {
      setInlineError({
        type: 'blood_group_required',
        message: 'Please select your blood group to complete registration.',
      });
      return;
    }

    setSubmittingModal(true);
    try {
      const res = await loginWithGoogle({
        idToken: pendingIdToken,
        bloodGroup,
        phone,
      });

      if (res?._id) {
        showSuccess(`Account setup complete! Welcome, ${res.name}!`);
        setShowModal(false);
        handleRedirect(res);
      }
    } catch (err) {
      classifyAndSetError(err);
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleRedirect = (user) => {
    if (redirect && redirect !== '/') {
      navigate(redirect);
    } else {
      const type = user.accountType || user.role;
      switch (type) {
        case 'hospital':
          navigate('/hospital/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'user':
        case 'donor':
        default:
          navigate('/donor/dashboard');
          break;
      }
    }
  };

  return (
    <>
      <button
        type="button"
        id="google-signin-btn"
        onClick={handleGoogleClick}
        disabled={loading}
        className="btn-secondary w-full py-3 px-4 rounded-xl text-xs font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-info" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleIcon />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Inline Friendly Error State with Try Again action */}
      {inlineError && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-3 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
          <div className="flex-1 text-[11px] leading-relaxed">
            <span className="font-semibold text-danger">{inlineError.message}</span>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setInlineError(null);
                  handleGoogleClick();
                }}
                className="font-extrabold underline hover:text-danger-hover cursor-pointer"
              >
                Try again
              </button>
              {inlineError.type === 'popup_blocked' && (
                <button
                  type="button"
                  onClick={handleRedirectSignIn}
                  className="font-extrabold underline hover:text-danger-hover cursor-pointer"
                >
                  Use redirect sign-in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Blood Group and Phone when needsProfile === true */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-md rounded-2xl p-6 sm:p-8 bg-surface border border-hairline shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-primary transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-info/10 border border-info/25 flex items-center justify-center mb-3">
                <Droplet className="w-5 h-5 text-info" />
              </div>
              <h2 className="text-lg font-black text-primary font-heading">
                Complete Donor Profile
              </h2>
              <p className="text-xs text-secondary mt-1">
                Hi {pendingName}! To connect you with emergency blood requests, please specify your blood group.
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1.5 text-secondary">
                  Blood Group *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-info">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <select
                    id="google-modal-blood-group"
                    required
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="glass-select w-full pl-10 text-xs px-3.5 py-3 rounded-xl border border-theme bg-surface text-primary"
                    style={{ colorScheme: 'light dark' }}
                  >
                    <option value="" disabled className="bg-surface text-muted">Select your blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg} className="bg-surface text-primary">
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1.5 text-secondary">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="google-modal-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="glass-input w-full pl-10 text-xs px-3.5 py-3 rounded-xl border border-theme bg-surface text-primary"
                    style={{ colorScheme: 'light dark' }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingModal || !bloodGroup}
                  className="btn-primary w-full py-3.5 rounded-xl text-xs justify-center flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {submittingModal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete &amp; Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
