import React, { useState } from 'react';
import {
  Headphones,
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  User,
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';

interface AISupportCopilotProps {
  orders: Order[];
  initialOrderNumber?: string;
  onOpenOrderModal: (order: Order) => void;
}

export const AISupportCopilot: React.FC<AISupportCopilotProps> = ({
  orders,
  initialOrderNumber = '',
  onOpenOrderModal,
}) => {
  const [inquiryText, setInquiryText] = useState('');
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber);
  const [messages, setMessages] = useState<
    Array<{ role: 'customer' | 'ai'; text: string; matchedOrder?: string; escalate?: boolean; time: string }>
  >([
    {
      role: 'ai',
      text: 'Hello! I am the DropAI Customer Support Copilot. I answer customer inquiries with verified order data directly from your connected stores. Ask me about tracking, transit stages, or return requests.',
      time: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (query?: string, ordNum?: string) => {
    const textToSend = query || inquiryText;
    const numToSend = ordNum !== undefined ? ordNum : orderNumberInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      role: 'customer' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInquiryText('');
    setIsLoading(true);

    try {
      const response = await api.askSupportCopilot(textToSend, numToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai' as const,
          text: response.reply,
          matchedOrder: response.matchedOrderNumber || undefined,
          escalate: response.escalateToHuman,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai' as const,
          text: 'Unable to query database currently. Please verify your connection.',
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-support-copilot-container" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-2 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] text-xs font-mono">
          <Headphones className="w-3.5 h-3.5 text-[#D97706]" />
          <span>ZERO-HALLUCINATION ORDER COPILOT</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
          AI Customer Support Copilot
        </h1>
        <p className="text-xs text-[#94A3B8] max-w-xl">
          Automated customer inquiry handling grounded exclusively in verified store orders, carrier tracking statuses, and store refund policies.
        </p>
      </div>

      {/* Main Chat Frame */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Top order selector */}
        <div className="p-3 bg-[#151517] border-b border-[#1F1F21] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8] font-mono">Filter by Order #:</span>
            <input
              type="text"
              placeholder="e.g. DA-84910"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#111113] border border-[#2D2D30] text-[#D97706] font-mono text-xs w-32 focus:outline-none focus:border-[#D97706]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-[#64748B]">Preset Queries:</span>
            <button
              onClick={() => {
                setOrderNumberInput('DA-84910');
                handleSend('Where is my package and what is the tracking status?', 'DA-84910');
              }}
              className="px-2 py-0.5 rounded bg-[#111113] hover:bg-[#1F1F21] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0] text-[11px] font-mono cursor-pointer transition-colors"
            >
              Order #DA-84910
            </button>
            <button
              onClick={() => {
                setOrderNumberInput('DA-84913');
                handleSend('My item arrived with broken glass, can I get a refund?', 'DA-84913');
              }}
              className="px-2 py-0.5 rounded bg-[#111113] hover:bg-[#1F1F21] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0] text-[11px] font-mono cursor-pointer transition-colors"
            >
              Order #DA-84913
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === 'customer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.role === 'customer'
                    ? 'bg-[#D97706] text-black font-medium rounded-br-none shadow-md'
                    : 'bg-[#151517] border border-[#1F1F21] text-[#E2E8F0] rounded-bl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between space-x-4 text-[10px] opacity-75 font-mono mb-1">
                  <span>{msg.role === 'customer' ? 'Customer Inquiry' : 'DropAI Support Agent'}</span>
                  <span>{msg.time}</span>
                </div>

                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.matchedOrder && (
                  <div className="pt-2 border-t border-[#1F1F21] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#D97706]">
                      Verified Match: #{msg.matchedOrder}
                    </span>
                    {orders.find((o) => o.orderNumber === msg.matchedOrder) && (
                      <button
                        onClick={() => {
                          const ord = orders.find((o) => o.orderNumber === msg.matchedOrder);
                          if (ord) onOpenOrderModal(ord);
                        }}
                        className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer font-mono"
                      >
                        <span>Open Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[#94A3B8] font-mono p-2">
              <div className="w-3 h-3 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
              <span>Checking database orders & carrier telemetry...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#151517] border-t border-[#1F1F21] flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Type customer message or query..."
            value={inquiryText}
            onChange={(e) => setInquiryText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#111113] border border-[#2D2D30] text-xs text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#D97706]"
          />

          <button
            type="submit"
            disabled={!inquiryText.trim() || isLoading}
            className="p-2.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-[#D97706]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
