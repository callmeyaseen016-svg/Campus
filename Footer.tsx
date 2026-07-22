import React from 'react';
import { AlertTriangle, X, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DomainErrorStickyNote: React.FC = () => {
  const { 
    domainError, 
    clearDomainError, 
    signInWithGoogle, 
    signInAsDemoUser, 
    setBypassDomainCheck 
  } = useAuth();

  if (!domainError) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-fade-in-up">
      <div className="sticky-note p-5 rounded-2xl border-2 border-[#1B3A5C] shadow-2xl relative rotate-1">
        
        {/* Close Button */}
        <button
          onClick={clearDomainError}
          className="absolute top-3 right-3 text-[#1B3A5C]/60 hover:text-[#1B3A5C] p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E63946] text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div>
            <h3 className="font-extrabold text-base text-[#1B3A5C] mb-1">
              This marketplace is for VIT students only
            </h3>
            <p className="text-xs font-semibold text-[#1B3A5C]/80 leading-relaxed mb-3">
              Your account (<span className="underline">{domainError}</span>) is not a valid student email ending in <strong className="text-[#E63946]">@vitstudent.ac.in</strong>.
            </p>

            <div className="flex flex-col gap-2 pt-1 border-t border-[#1B3A5C]/15">
              <button
                onClick={() => {
                  clearDomainError();
                  signInWithGoogle();
                }}
                className="btn-notebook-red py-2 px-3 text-xs w-full cursor-pointer"
              >
                Sign in with @vitstudent.ac.in
              </button>

              <button
                onClick={() => {
                  clearDomainError();
                  signInAsDemoUser();
                }}
                className="py-2 px-3 text-xs font-bold bg-white text-[#1B3A5C] border border-[#1B3A5C]/40 rounded-xl hover:bg-[#1B3A5C]/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Sign in as Demo Student (Rahul Sharma)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
