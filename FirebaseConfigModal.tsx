import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Heart, ShoppingBag, FolderOpen, AlertCircle } from 'lucide-react';
import { Category, Listing } from '../types';
import { ListingCard } from './ListingCard';
import { useAuth } from '../context/AuthContext';

interface ListingsSectionProps {
  listings: Listing[];
  activeTab: 'all' | 'favourites' | 'my-listings';
  setActiveTab: (tab: 'all' | 'favourites' | 'my-listings') => void;
  favourites: string[];
  onToggleFav: (id: string) => void;
  onMessageClick: (listing: Listing) => void;
  onShareSuccess: (msg: string) => void;
  newAddedId?: string | null;
}

const CATEGORY_CHIPS: ('All' | Category)[] = ['All', 'Books', 'Cycles', 'Electronics', 'Other'];

export const ListingsSection: React.FC<ListingsSectionProps> = ({
  listings,
  activeTab,
  setActiveTab,
  favourites,
  onToggleFav,
  onMessageClick,
  onShareSuccess,
  newAddedId
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');

  // Counter counting up from 0 to total number of live listings
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const target = listings.length;
    if (target === 0) {
      setDisplayCount(0);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.floor(target / 12));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(current);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [listings.length]);

  // Filter listings based on Tab, Category chip, and Search term
  const filteredListings = listings.filter((item) => {
    // 1. Tab filter
    if (activeTab === 'favourites') {
      if (!favourites.includes(item.id)) return false;
    } else if (activeTab === 'my-listings') {
      if (!user || item.sellerId !== user.uid) return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // 3. Search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const nameMatch = item.name.toLowerCase().includes(term);
      const descMatch = item.description.toLowerCase().includes(term);
      const catMatch = item.category.toLowerCase().includes(term);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    return true;
  });

  return (
    <section id="listings-grid" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Header & Animated Live Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B3A5C]">
              Campus Marketplace Feed
            </h2>
            
            {/* Animated Live Counter Badge */}
            <div className="sticky-note px-3 py-1 rounded-xl font-black text-xs sm:text-sm border border-[#1B3A5C]/20 shadow-xs flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#E63946]" />
              <span>{displayCount} Live {displayCount === 1 ? 'Item' : 'Listings'}</span>
            </div>
          </div>
          <p className="text-xs text-[#1B3A5C]/70 font-semibold mt-1">
            Real-time campus items listed by verified students
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="inline-flex p-1 bg-white border-2 border-[#1B3A5C]/20 rounded-2xl shadow-2xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#E63946] text-white shadow-xs'
                : 'text-[#1B3A5C] hover:bg-[#C9E2F5]/30'
            }`}
          >
            All Listings
          </button>

          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'favourites'
                ? 'bg-[#E63946] text-white shadow-xs'
                : 'text-[#1B3A5C] hover:bg-[#C9E2F5]/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favourites.length > 0 ? 'fill-current' : ''}`} />
            <span>Favourites ({favourites.length})</span>
          </button>

          {user && (
            <button
              onClick={() => setActiveTab('my-listings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-listings'
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'text-[#1B3A5C] hover:bg-[#C9E2F5]/30'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Listings</span>
            </button>
          )}
        </div>
      </div>

      {/* (1) Search Bar: paper-white pill shape matching theme */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B3A5C]/50" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for books, cycles, electronics…"
          className="w-full pl-12 pr-4 py-3.5 rounded-full border-2 border-[#1B3A5C]/20 focus:border-[#1B3A5C] bg-[#FAFBFC] text-sm font-semibold text-[#1B3A5C] placeholder-[#1B3A5C]/50 shadow-xs outline-none transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#E63946] hover:underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* (2) Category Filter Chips directly below search bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        <span className="text-xs font-black text-[#1B3A5C] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3 text-[#E63946]" /> Filter:
        </span>
        {CATEGORY_CHIPS.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer border-2 ${
                isActive
                  ? 'bg-[#E63946] text-white border-[#E63946] shadow-xs'
                  : 'bg-white text-[#1B3A5C] border-[#1B3A5C]/20 hover:border-[#1B3A5C]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Listing Cards */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <div
              key={listing.id}
              className={newAddedId === listing.id ? 'ring-4 ring-[#E63946] rounded-2xl animate-bounce' : ''}
            >
              <ListingCard
                listing={listing}
                isFav={favourites.includes(listing.id)}
                onToggleFav={onToggleFav}
                onMessageClick={onMessageClick}
                onShareSuccess={onShareSuccess}
                cardIndex={index}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border-2 border-dashed border-[#1B3A5C]/20 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FFD93D] text-[#1B3A5C] flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-xs">
            🎒
          </div>
          <h3 className="font-extrabold text-lg text-[#1B3A5C] mb-1">
            No items found
          </h3>
          <p className="text-xs font-semibold text-[#1B3A5C]/70 mb-4">
            {activeTab === 'favourites'
              ? 'You have not added any items to your favourites yet. Click the heart icon on any listing card!'
              : activeTab === 'my-listings'
              ? "You haven't posted any listings yet. Use the 'Sell an item' form above to list your first item!"
              : 'Try clearing your search or selecting a different category filter.'}
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="btn-notebook-red py-2 px-4 text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

    </section>
  );
};
