import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, Fingerprint, Delete, KeyRound, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

interface SecurityLockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  pinHint: string;
}

export const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({ isLocked, onUnlock, pinHint }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownSeconds > 0) {
      timer = setTimeout(() => setCooldownSeconds((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  // Handle keyboard typing
  useEffect(() => {
    if (!isLocked) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cooldownSeconds > 0) return;
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          handleDigit(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          submitPin(pin);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, pin, cooldownSeconds]);

  const handleDigit = (digit: string) => {
    if (cooldownSeconds > 0) return;
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');
      if (nextPin.length === 4) {
        submitPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => (prev ? prev.slice(0, -1) : ''));
    setErrorMsg('');
  };

  const submitPin = async (candidatePin: string) => {
    setIsVerifying(true);
    try {
      const res = await api.verifyPin(candidatePin);
      if (res.success) {
        setPin('');
        setErrorMsg('');
        onUnlock();
      } else {
        setPin('');
        setErrorMsg(res.error || 'Incorrect security PIN');
        if (res.attemptsRemaining !== undefined) {
          setAttemptsRemaining(res.attemptsRemaining);
        }
        if (res.attemptsRemaining === 0) {
          setCooldownSeconds(60);
        }
      }
    } catch (err) {
      setErrorMsg('Verification failed. Check network connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (cooldownSeconds > 0) return;
    setIsVerifying(true);
    // Simulate instantaneous biometric secure enclave authentication
    setTimeout(async () => {
      const res = await api.verifyPin('1234');
      if (res.success) {
        onUnlock();
      } else {
        setErrorMsg('Biometric mismatch. Please enter manual PIN.');
      }
      setIsVerifying(false);
    }, 600);
  };

  if (!isLocked) return null;

  return (
    <div id="security-lock-screen" className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/95 backdrop-blur-xl p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl bg-[#111113] border border-[#1F1F21] p-8 shadow-2xl flex flex-col items-center text-center space-y-6"
      >
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#151517] border border-[#2D2D30] flex items-center justify-center shadow-inner">
          <Lock className="w-7 h-7 text-[#D97706]" />
        </div>

        <div>
          <h2 className="text-xl font-serif text-[#E2E8F0]">DropAI Security Lock</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Protected session. Enter your 4-digit security PIN to resume operational controls.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center space-x-4 py-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#D97706] border-[#D97706] scale-110 shadow-lg shadow-[#D97706]/40'
                    : 'border-[#2D2D30] bg-[#0A0A0B]'
                }`}
              />
            );
          })}
        </div>

        {/* Error or Cooldown feedback */}
        {cooldownSeconds > 0 ? (
          <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Lockout active. Try again in {cooldownSeconds}s</span>
          </div>
        ) : errorMsg ? (
          <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs text-[#64748B] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Attempts remaining: {attemptsRemaining}/5</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              id={`keypad-${num}`}
              onClick={() => handleDigit(num)}
              disabled={cooldownSeconds > 0 || isVerifying}
              className="h-12 rounded-xl bg-[#151517] hover:bg-[#1F1F21] text-[#E2E8F0] font-mono text-lg font-semibold border border-[#2D2D30] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}

          {/* Biometric Trigger */}
          <button
            id="keypad-biometric"
            onClick={handleBiometricAuth}
            disabled={cooldownSeconds > 0 || isVerifying}
            className="h-12 rounded-xl bg-[#151517] hover:bg-[#1F1F21] text-[#D97706] border border-[#2D2D30] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
            title="Biometric Authentication"
          >
            <Fingerprint className="w-5 h-5" />
          </button>

          {/* Zero */}
          <button
            id="keypad-0"
            onClick={() => handleDigit('0')}
            disabled={cooldownSeconds > 0 || isVerifying}
            className="h-12 rounded-xl bg-[#151517] hover:bg-[#1F1F21] text-[#E2E8F0] font-mono text-lg font-semibold border border-[#2D2D30] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            0
          </button>

          {/* Backspace */}
          <button
            id="keypad-backspace"
            onClick={handleBackspace}
            disabled={cooldownSeconds > 0 || isVerifying}
            className="h-12 rounded-xl bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Hint Helper */}
        <div className="w-full pt-3 border-t border-[#1F1F21] text-left">
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Hint:</span>
            </span>
            <span className="font-mono text-slate-300 font-medium">{pinHint}</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">
            High-risk operations (e.g., refunds {'>'} $100) require PIN re-confirmation.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
