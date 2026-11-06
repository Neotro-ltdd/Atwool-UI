import React from 'react';
import { AttwoolLogo } from './AttwoolLogo';
import { ShieldCheck, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Brand Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#94A3B8] via-[#C8102E] to-[#0B4F9C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Col 1: Identity & Safeguarding */}
          <div className="space-y-3 max-w-lg">
            <div className="bg-white/95 p-2.5 rounded-xl inline-block shadow-sm">
              <AttwoolLogo size="sm" showSubtitle={false} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attwool Schools Academic Governance &amp; Weekly Reporting Portal. Confidential by design under the Nigeria Data Protection Act 2023.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg px-3 py-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>NDPA 2023 Safeguarding &amp; Student Privacy Certified</span>
            </div>
          </div>

          {/* Col 2: Academic IT Desk & Support */}
          <div className="space-y-2 text-xs text-slate-400">
            <div className="text-sm font-bold text-white uppercase tracking-wider font-brand-sans mb-1">
              Academic IT Desk
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href="mailto:portal@attwoolcollege.com" className="hover:text-white transition-colors">
                portal@attwoolcollege.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+234 (0) 803 000 0000</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Support Hours: Mon – Fri (7:30 AM – 5:30 PM WAT)
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              powered by Neotro Ltd • .NET 9 &amp; React
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Attwool Schools. All rights reserved. Registered in Nigeria.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Safeguarding Guidelines</a>
            <a href="#support" className="hover:text-slate-300 transition-colors">Staff Handbook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
