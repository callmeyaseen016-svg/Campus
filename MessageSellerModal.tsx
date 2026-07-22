import React from 'react';
import { ArrowDown, Sparkles, BookOpen, Bike, Laptop, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onBrowseClick: () => void;
  onSellClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseClick, onSellClick }) => {
  return (
    <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
      
      {/* Floating Tilted Sticky Note 1 (Left Top) */}
      <div className="absolute top-2 left-4 md:left-12 sticky-note px-3 py-1.5 rounded-lg text-xs font-black shadow-md transform -rotate-6 hidden sm:flex items-center gap-1 border border-[#1B3A5C]/20 z-10">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" />
        <span>2nd-hand ✓</span>
      </div>

      {/* Floating Tilted Sticky Note 2 (Right Top) */}
      <div className="absolute top-4 right-4 md:right-16 sticky-note px-3 py-1.5 rounded-lg text-xs font-black shadow-md transform rotate-6 hidden sm:flex items-center gap-1 border border-[#1B3A5C]/20 z-10">
        <Sparkles className="w-3.5 h-3.5 text-[#1B3A5C]" />
        <span>No fees</span>
      </div>

      {/* Floating Tilted Sticky Note 3 (Right Bottom) */}
      <div className="absolute bottom-6 right-8 md:right-24 bg-[#C9E2F5] text-[#1B3A5C] px-3 py-1.5 rounded-lg text-xs font-black shadow-md transform -rotate-3 hidden md:flex items-center gap-1 border border-[#1B3A5C]/20 z-10">
        <span>Same day pickup ⚡</span>
      </div>

      {/* Main Headline */}
      <div className="relative inline-block max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1B3A5C] tracking-tight leading-[1.1] mb-6">
          Sell it. Find it.{' '}
          <span className="inline-block marker-underline text-[#1B3A5C]">
            Campus only.
          </span>
        </h1>
        
        {/* One-Line Subheading */}
        <p className="text-lg sm:text-xl font-medium text-[#1B3A5C]/80 max-w-2xl mx-auto leading-relaxed mb-8">
          The official student-to-student marketplace for buying & selling used textbooks, hostel cycles, calculators & electronics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onBrowseClick}
            className="btn-notebook-red px-8 py-4 text-base sm:text-lg flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Browse listings</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          <button
            onClick={onSellClick}
            className="px-6 py-4 rounded-full bg-white text-[#1B3A5C] font-bold text-base border-2 border-[#1B3A5C] hover:bg-[#C9E2F5]/40 transition-all cursor-pointer shadow-xs"
          >
            + Post an item
          </button>
        </div>

        {/* Category Icons Bar */}
        <div className="mt-12 inline-flex items-center gap-6 px-6 py-2.5 rounded-full bg-white/80 border border-[#1B3A5C]/15 backdrop-blur-xs text-xs font-bold text-[#1B3A5C]">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#E63946]" />
            Books
          </span>
          <span className="text-[#1B3A5C]/30">•</span>
          <span className="flex items-center gap-1.5">
            <Bike className="w-4 h-4 text-[#E63946]" />
            Cycles
          </span>
          <span className="text-[#1B3A5C]/30">•</span>
          <span className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-[#E63946]" />
            Electronics
          </span>
        </div>
      </div>
    </section>
  );
};
