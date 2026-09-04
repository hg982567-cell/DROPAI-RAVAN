import React, { useState } from 'react';
import { Lock, ShieldAlert, X, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface PinAuthModalProps {
  actionDescription: string;
  onAuthorized: () => void;
  onCancel: () => void;
}

export const PinAuthModal: React.FC<PinAuthModalProps> = ({
  actionDescription,
  onAuthorized,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        verify(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => (prev ? prev.slice(0, -1) : ''));
    setError(null);
  };

  const verify = async (pinToVerify: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await api.verifyPin(pinToVerify);
      if (res.valid) {
        onAuthorized();
      } else {
        setError(res.error || 'Incorrect security PIN. Default is 1234.');
        setPin('');
      }
    } catch (err: any) {
      setError('Verification failed. Try again.');
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/85 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111113] border border-[#1F1F21] p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
          <div className="flex items-center space-x-2 text-[#D97706]">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-serif text-[#E2E8F0]">Security PIN Authorization</h3>
          </div>
          <button onClick={onCancel} className="text-[#64748B] hover:text-[#E2E8F0] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#151517] border border-[#D97706]/30 text-xs text-[#D97706] space-y-1">
          <span className="font-bold">Authorizing High-Risk Action:</span>
          <p className="text-[#94A3B8] leading-relaxed font-mono text-[11px]">{actionDescription}</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center space-x-3 py-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > i
                  ? 'bg-[#D97706] border-[#D97706] scale-110 shadow-sm shadow-[#D97706]/50'
                  : 'border-[#2D2D30] bg-[#0A0A0B]'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="text-center text-xs text-rose-400 font-mono flex items-center justify-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num.toString())}
              disabled={isVerifying}
              className="h-11 rounded-xl bg-[#151517] border border-[#2D2D30] hover:border-[#1F1F21] text-[#E2E8F0] font-bold text-base hover:bg-[#1F1F21] transition-all active:scale-95 cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin('1234')}
            className="h-11 rounded-xl text-[10px] font-mono text-[#D97706] hover:bg-[#151517] cursor-pointer"
            title="Auto-fill default demo PIN"
          >
            DEMO: 1234
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            disabled={isVerifying}
            className="h-11 rounded-xl bg-[#151517] border border-[#2D2D30] hover:border-[#1F1F21] text-[#E2E8F0] font-bold text-base hover:bg-[#1F1F21] transition-all active:scale-95 cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-11 rounded-xl bg-[#151517] border border-[#2D2D30] hover:border-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] text-xs font-mono transition-all cursor-pointer"
          >
            DEL
          </button>
        </div>

        <div className="text-center text-[10px] text-[#64748B] font-mono">
          Default development PIN is <strong className="text-[#94A3B8]">1234</strong>
        </div>
      </div>
    </div>
  );
};
