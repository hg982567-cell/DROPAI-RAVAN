import React from 'react';
import {
  BookOpen,
  Key,
  ShieldCheck,
  Server,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const HelpDocsView: React.FC = () => {
  return (
    <div id="help-docs-view-container" className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Documentation & Integration Guide
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Developer instructions for connecting live store adapters, configuring API keys, and operational security.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
          <span>SDK Version 3.4.0 (Production)</span>
        </div>
      </div>

      {/* Integration Adapter Guides */}
      <div className="space-y-6">
        {/* Shopify Adapter */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#1F1F21] pb-3">
            <div className="p-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#D97706]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-white">Connecting Shopify Custom App Adapter</h2>
              <p className="text-xs text-[#94A3B8]">Secure API access token handshake for orders and catalog sync.</p>
            </div>
          </div>

          <ol className="space-y-2 text-xs text-[#94A3B8] list-decimal pl-5 leading-relaxed">
            <li>Log into your Shopify Admin dashboard and navigate to <strong>Settings &gt; Apps and sales channels</strong>.</li>
            <li>Click <strong>Develop apps</strong> and select <strong>Create an app</strong>. Name it <code className="font-mono bg-[#151517] border border-[#2D2D30] px-1.5 py-0.5 rounded text-[#D97706]">DropAI Automation Adapter</code>.</li>
            <li>Under <strong>Configuration &gt; Admin API integration</strong>, select the following scopes:
              <div className="mt-1 p-2.5 rounded-lg bg-[#151517] border border-[#1F1F21] font-mono text-[11px] text-[#E2E8F0]">
                write_products, read_products, write_orders, read_orders, write_inventory, read_inventory
              </div>
            </li>
            <li>Click <strong>Install app</strong> and reveal the <strong>Admin API access token</strong> (starts with <code className="font-mono text-[#D97706]">shpat_...</code>).</li>
            <li>In DropAI, navigate to <strong>Stores &gt; Configure API Credentials</strong> and paste your token.</li>
          </ol>
        </div>

        {/* Security & PIN Policy */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#1F1F21] pb-3">
            <div className="p-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#D97706]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-white">Zero-Trust PIN Enforcement Policy</h2>
              <p className="text-xs text-[#94A3B8]">Why and how operator security is mathematically separated from AI agents.</p>
            </div>
          </div>

          <div className="text-xs text-[#94A3B8] space-y-2 leading-relaxed">
            <p>
              In accordance with strict security requirements, the autonomous AI agent running on the server does <strong>NEVER</strong> possess access to your operator PIN, master passwords, or raw banking credentials.
            </p>
            <p>
              When an action involves high financial risk (e.g. initiating customer refunds exceeding $100, mass price reductions across your entire catalog, or delisting items), DropAI enters an <strong>Authorization Gate</strong>. Only an authenticated human operator entering the 4-digit PIN can sign the transaction.
            </p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#1F1F21] pb-3">
            <div className="p-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#D97706]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-white">Server Environment Variables (.env)</h2>
              <p className="text-xs text-[#94A3B8]">Required backend secrets for production deployments.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] font-mono text-xs text-[#94A3B8] space-y-1.5 overflow-x-auto">
            <div className="text-[#64748B]"># Google Gemini AI SDK Key</div>
            <div className="text-[#E2E8F0]">GEMINI_API_KEY=your_gemini_api_key_here</div>
            <div className="text-[#64748B] pt-1"># Shopify Integration Credentials (Optional Server-side)</div>
            <div className="text-[#E2E8F0]">SHOPIFY_API_KEY=shpat_live_xxxxxxxxxxxxxxxx</div>
            <div className="text-[#64748B] pt-1"># Carrier Tracking Webhook Secret</div>
            <div className="text-[#E2E8F0]">TRACKING_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx</div>
          </div>
        </div>
      </div>
    </div>
  );
};
