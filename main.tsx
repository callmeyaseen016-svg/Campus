import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  Trash2, 
  BookOpen, 
  Bike, 
  Laptop, 
  Package, 
  MessageSquare,
  Share2,
  Check,
  UserCheck
} from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { deleteListingFromStore } from '../lib/firebase';

interface ListingCardProps {
  listing: Listing;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onMessageClick: (listing: Listing) => void;
  onShareSuccess: (msg: string) => void;
  cardIndex: number;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFav,
  onToggleFav,
  onMessageClick,
  onShareSuccess,
  cardIndex
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Slight tilt effect for physical notebook index-card feel
  const tilts = ['-rotate-1', 'rotate-1', '-rotate-0.5', 'rotate-0.5'];
  const cardTilt = tilts[cardIndex % tilts.length];

  const isOwner = user && user.uid === listing.sellerId;

  // Render placeholder category icon if no image provided
  const renderCategoryPlaceholder = () => {
    switch (listing.category) {
      case 'Books':
        return (
          <div className="w-full h-48 bg-[#C9E2F5]/30 flex flex-col items-center justify-center text-[#1B3A5C]/60 rounded-t-2xl">
            <BookOpen className="w-12 h-12 text-[#1B3A5C]/40 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Book Listing</span>
          </div>
        );
      case 'Cycles':
        return (
          <div className="w-full h-48 bg-[#FFD93D]/20 flex flex-col items-center justify-center text-[#1B3A5C]/60 rounded-t-2xl">
            <Bike className="w-12 h-12 text-[#1B3A5C]/40 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Campus Cycle</span>
          </div>
        );
      case 'Electronics':
        return (
          <div className="w-full h-48 bg-[#E63946]/10 flex flex-col items-center justify-center text-[#1B3A5C]/60 rounded-t-2xl">
            <Laptop className="w-12 h-12 text-[#1B3A5C]/40 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Electronics</span>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-[#FAFBFC] flex flex-col items-center justify-center text-[#1B3A5C]/60 rounded-t-2xl border-b border-[#1B3A5C]/10">
            <Package className="w-12 h-12 text-[#1B3A5C]/40 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">General Item</span>
          </div>
        );
    }
  };

  const handleShare = async () => {
    const url = window.location.href.split('#')[0];
    const text = `${listing.name} — ₹${listing.price}, ${listing.condition}. Check it out on Campus Cart: ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Campus Cart: ${listing.name}`,
          text,
          url
        });
      } catch (err) {
        // Fallback to clipboard if share dismissed
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShareSuccess('Copied share link to clipboard!');
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${listing.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteListingFromStore(listing.id);
      } catch (e) {
        console.error('Delete error:', e);
        setIsDeleting(false);
      }
    }
  };

  return (
    <article className={`notebook-card rounded-2xl relative flex flex-col justify-between overflow-hidden ${cardTilt} animate-fade-in-up`}>
      
      {/* Top Banner & Photo Area */}
      <div className="relative">
        
        {/* Sticky-Note Yellow Category Tag in Top Left Corner */}
        <div className="absolute top-3 left-3 z-10">
          <span className="sticky-note px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border border-[#1B3A5C]/15 shadow-xs">
            {listing.category}
          </span>
        </div>

        {/* Doodle Heart Favourite Icon in Top Right Corner */}
        <button
          onClick={() => onToggleFav(listing.id)}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-xs p-2 rounded-full border border-[#1B3A5C]/20 shadow-xs hover:scale-110 transition-transform cursor-pointer"
          title={isFav ? "Remove from favourites" : "Save to favourites"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#E63946] text-[#E63946]' : 'text-[#1B3A5C]/70'
            }`} 
          />
        </button>

        {/* Item Photo or Category Illustration */}
        {listing.imageBase64 ? (
          <div className="w-full h-48 overflow-hidden bg-black/5 border-b border-[#1B3A5C]/10">
            <img
              src={listing.imageBase64}
              alt={listing.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          renderCategoryPlaceholder()
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-extrabold text-base text-[#1B3A5C] leading-snug line-clamp-2">
              {listing.name}
            </h3>
            <span className="text-lg font-black text-[#E63946] shrink-0">
              ₹{listing.price.toLocaleString()}
            </span>
          </div>

          {/* Condition Badge & Seller Tag */}
          <div className="flex items-center justify-between gap-2 my-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1B3A5C]/10 text-[#1B3A5C] border border-[#1B3A5C]/20">
              {listing.condition}
            </span>

            {/* Seller profile info */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1B3A5C]/70">
              {listing.sellerPhoto ? (
                <img
                  src={listing.sellerPhoto}
                  alt={listing.sellerName || 'Seller'}
                  className="w-5 h-5 rounded-full object-cover border border-[#1B3A5C]/20"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#C9E2F5] text-[#1B3A5C] flex items-center justify-center text-[9px] font-black">
                  {(listing.sellerName || 'S').charAt(0)}
                </div>
              )}
              <span className="max-w-[100px] truncate">
                {listing.sellerName || 'Campus Seller'}
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-[#1B3A5C]/80 line-clamp-2 leading-relaxed mb-4">
            {listing.description}
          </p>
        </div>

        {/* Card Footer Action Buttons */}
        <div className="pt-3 border-t border-[#1B3A5C]/10 flex items-center gap-2">
          
          {/* Message Seller Button */}
          <button
            onClick={() => onMessageClick(listing)}
            className="flex-1 btn-notebook-red py-2 px-3 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message seller</span>
          </button>

          {/* Share Button (Paper Plane Icon) */}
          <button
            onClick={handleShare}
            className="p-2 bg-white text-[#1B3A5C] border border-[#1B3A5C]/20 rounded-xl hover:bg-[#C9E2F5]/30 transition-colors cursor-pointer"
            title="Share listing"
          >
            <Send className="w-4 h-4 text-[#1B3A5C]" />
          </button>

          {/* Delete Option (for Seller Owner) */}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/30 rounded-xl hover:bg-[#E63946]/20 transition-colors cursor-pointer"
              title="Delete my listing"
            >
              <Trash2 className="w-4 h-4 stroke-[2]" />
            </button>
          )}

        </div>

      </div>

    </article>
  );
};
