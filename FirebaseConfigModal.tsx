import React from 'react';
import { Heart, Sparkles, Pencil } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-2 border-[#1B3A5C]/15 bg-[#FAFBFC] py-10 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E63946] text-white flex items-center justify-center font-black">
            <Pencil className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-black text-lg text-[#1B3A5C] tracking-tight">
            Shaik<span className="text-[#E63946]">Cart</span>
          </span>
        </div>

        {/* Required Footer text */}
        <p className="text-sm font-bold text-[#1B3A5C] bg-[#FFD93D] inline-block px-4 py-1.5 rounded-full border border-[#1B3A5C]/20 shadow-xs rotate-[-0.5deg]">
          Built live at the VinnovateIT Vibe Coding Workshop
        </p>

        <p className="text-xs font-semibold text-[#1B3A5C]/60 mt-1">
          Designed with paper-white, graph-paper grid & notebook aesthetic for VIT students.
        </p>

      </div>
    </footer>
  );
};
