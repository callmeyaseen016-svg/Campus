import React, { useState } from 'react';
import { X, Send, Mail, MessageCircle, Copy, Check, Sparkles } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../context/AuthContext';

interface MessageSellerModalProps {
  listing: Listing | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const MessageSellerModal: React.FC<MessageSellerModalProps> = ({
  listing,
  onClose,
  onToast
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const defaultMsg = `Hi ${listing.sellerName || 'there'}! I saw your "${listing.name}" listed for ₹${listing.price} on Campus Cart. Is it still available for campus pickup?`;
  const [message, setMessage] = useState(defaultMsg);

  const sellerEmail = listing.sellerContact || `${listing.sellerName?.toLowerCase().replace(/\s+/g, '.')}@vitstudent.ac.in`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    onToast('Message copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Campus Cart Inquiry: ${listing.name}`);
    const body = encodeURIComponent(message);
    window.open(`mailto:${sellerEmail}?subject=${subject}&body=${body}`, '_blank');
    onToast('Opening mail app...');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3A5C]/40 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-[#FAFBFC] border-2 border-[#1B3A5C] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1B3A5C]/60 hover:text-[#1B3A5C] p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          {listing.sellerPhoto ? (
            <img
              src={listing.sellerPhoto}
              alt={listing.sellerName || 'Seller'}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#1B3A5C]/20 shadow-xs"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[#FFD93D] text-[#1B3A5C] flex items-center justify-center font-black text-lg border-2 border-[#1B3A5C]/20">
              {(listing.sellerName || 'S').charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-extrabold text-lg text-[#1B3A5C]">
              Message {listing.sellerName || 'Seller'}
            </h3>
            <p className="text-xs text-[#1B3A5C]/70 font-semibold truncate">
              Inquiring about: <strong className="text-[#E63946]">{listing.name}</strong> (₹{listing.price})
            </p>
          </div>
        </div>

        {/* Seller Email Pill */}
        <div className="sticky-note p-3 rounded-2xl border border-[#1B3A5C]/20 text-xs font-bold mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1B3A5C]">
            <Mail className="w-4 h-4 text-[#E63946]" />
            <span className="truncate">{sellerEmail}</span>
          </div>
          <span className="text-[10px] font-black uppercase text-[#1B3A5C]/60">Verified VIT Student</span>
        </div>

        {/* Message Area */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
            Your Message
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-[#1B3A5C]/20 focus:border-[#1B3A5C] bg-white text-sm font-medium text-[#1B3A5C] outline-none resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSendEmail}
            className="w-full sm:flex-1 btn-notebook-red py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email Direct</span>
          </button>

          <button
            onClick={handleCopyMessage}
            className="w-full sm:w-auto py-3 px-4 rounded-full bg-white text-[#1B3A5C] font-bold text-xs border-2 border-[#1B3A5C] hover:bg-[#C9E2F5]/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
