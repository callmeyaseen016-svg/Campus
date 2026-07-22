import React, { useState } from 'react';
import { 
  Pencil, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  PlusCircle, 
  Sparkles,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  favCount: number;
  activeTab: 'all' | 'favourites' | 'my-listings';
  setActiveTab: (tab: 'all' | 'favourites' | 'my-listings') => void;
  onOpenSellForm: () => void;
  onOpenFirebaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favCount,
  activeTab,
  setActiveTab,
  onOpenSellForm,
  onOpenFirebaseModal
}) => {
  const { user, signInWithGoogle, signOutUser, signInAsDemoUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFBFC] border-b border-[#1B3A5C]/15 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Logo Mark */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E63946] text-white flex items-center justify-center shadow-xs transform group-hover:rotate-6 transition-transform">
            <Pencil className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-[#1B3A5C] tracking-tight">
                Shaik<span className="text-[#E63946]">Cart</span>
              </span>
              <span className="sticky-note text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider -rotate-2">
                VIT
              </span>
            </div>
            <p className="text-[11px] text-[#1B3A5C]/70 font-medium leading-none">
              Student Marketplace
            </p>
          </div>
        </a>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Sell Button CTA */}
          <button
            onClick={onOpenSellForm}
            className="hidden sm:flex items-center gap-1.5 btn-notebook-red px-4 py-2 text-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Item</span>
          </button>

          {/* Favourites Shortcut */}
          <button
            onClick={() => {
              setActiveTab('favourites');
              const el = document.getElementById('listings-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
              activeTab === 'favourites'
                ? 'bg-[#E63946] text-white border-[#E63946]'
                : 'bg-white text-[#1B3A5C] border-[#1B3A5C]/20 hover:bg-[#C9E2F5]/30'
            }`}
            title="View Favourites"
          >
            <Heart className={`w-4 h-4 ${favCount > 0 ? 'fill-current text-[#E63946]' : ''}`} />
            <span className="hidden md:inline">Favourites</span>
            {favCount > 0 && (
              <span className="bg-[#FFD93D] text-[#1B3A5C] font-extrabold text-xs px-1.5 py-0.2 rounded-full">
                {favCount}
              </span>
            )}
          </button>

          {/* Firebase Settings Button */}
          {onOpenFirebaseModal && (
            <button
              onClick={onOpenFirebaseModal}
              className="p-2 rounded-xl bg-white text-[#1B3A5C] border border-[#1B3A5C]/20 hover:bg-[#C9E2F5]/40 transition-colors cursor-pointer"
              title="Firebase Config"
            >
              <Sparkles className="w-4 h-4 text-[#FFD93D] fill-current stroke-[#1B3A5C]" />
            </button>
          )}

          {/* User Profile / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white border-1.5 border-[#1B3A5C]/20 rounded-full pl-1.5 pr-3 py-1 cursor-pointer hover:border-[#1B3A5C] transition-all shadow-2xs"
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt={user.firstName}
                  className="w-7 h-7 rounded-full object-cover border border-[#1B3A5C]/20"
                />
                <span className="text-xs font-bold text-[#1B3A5C] max-w-[90px] truncate">
                  {user.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1B3A5C]/60" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border-2 border-[#1B3A5C]/20 rounded-2xl shadow-xl py-2 z-50 animate-fade-in-up"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-[#1B3A5C]/10 mb-1">
                    <p className="text-xs font-bold text-[#1B3A5C] truncate">{user.displayName || user.firstName}</p>
                    <p className="text-[10px] text-[#1B3A5C]/60 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('my-listings');
                      setDropdownOpen(false);
                      const el = document.getElementById('listings-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1B3A5C] hover:bg-[#C9E2F5]/40 flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>My Listings</span>
                  </button>

                  <button
                    onClick={() => {
                      signOutUser();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#E63946] hover:bg-[#E63946]/10 flex items-center gap-2 cursor-pointer border-t border-[#1B3A5C]/10 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signInWithGoogle()}
                className="btn-notebook-red px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign in</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
