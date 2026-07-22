import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Upload, 
  Paperclip, 
  Send, 
  Image as ImageIcon, 
  X, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { Category, Condition, Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { addListingToStore } from '../lib/firebase';

interface SellFormProps {
  onSuccess: (newListingId: string) => void;
}

const CATEGORIES: Category[] = ['Books', 'Cycles', 'Electronics', 'Other'];
const CONDITIONS: Condition[] = ['Like New', 'Good', 'Fair'];

export const SellForm: React.FC<SellFormProps> = ({ onSuccess }) => {
  const { user, signInWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Books');
  const [price, setPrice] = useState<string>('');
  const [condition, setCondition] = useState<Condition>('Good');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side image compression & base64 conversion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsProcessingImage(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using Canvas to keep size small (<150KB) for Firestore
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.72);
          setImageBase64(compressedBase64);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setErrorMsg('Failed to process image file.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter an item name.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid price in rupees.');
      return;
    }

    // Auth enforcement as requested in prompt 6
    let activeUser = user;
    if (!activeUser) {
      try {
        activeUser = await signInWithGoogle();
        if (!activeUser) return; // Domain restriction or popup closed
      } catch (err) {
        setErrorMsg('Authentication is required to post a listing.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const newListingData: Omit<Listing, 'id'> = {
        name: name.trim(),
        category,
        price: priceNum,
        condition,
        description: description.trim() || 'No additional description provided.',
        imageBase64: imageBase64 || undefined,
        createdAt: Date.now(),
        sellerId: activeUser.uid,
        sellerName: activeUser.firstName,
        sellerPhoto: activeUser.photoURL || undefined,
        sellerContact: activeUser.email || undefined
      };

      const newId = await addListingToStore(newListingData);

      // Reset Form
      setName('');
      setPrice('');
      setDescription('');
      setImageBase64(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setIsSubmitting(false);

      // Trigger callback to smooth scroll to top of grid
      onSuccess(newId);
    } catch (err: any) {
      console.error('Error posting listing:', err);
      setIsSubmitting(false);
      setErrorMsg('Failed to post listing. Please check your connection and try again.');
    }
  };

  return (
    <section id="sell-form-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      
      {/* Coupon Floating Card */}
      <div className="coupon-border p-6 sm:p-8 rounded-3xl relative">
        
        {/* Coupon Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1B3A5C]/15 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFD93D] text-[#1B3A5C] flex items-center justify-center font-black">
              🏷️
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1B3A5C]">
                Sell an item
              </h2>
              <p className="text-xs text-[#1B3A5C]/70 font-semibold">
                Post your listing to the VIT campus feed in seconds
              </p>
            </div>
          </div>
          <span className="sticky-note px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider hidden sm:inline-block">
            Coupon #VIT-2026
          </span>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-[#E63946]/10 border-1.5 border-[#E63946] text-[#E63946] text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Item Name */}
          <div>
            <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Firefox 21-Speed Hybrid Bicycle, Casio FX-991EX..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#1B3A5C]/20 focus:border-[#1B3A5C] bg-[#FAFBFC] text-sm font-semibold text-[#1B3A5C] placeholder-[#1B3A5C]/40 outline-none transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
              Category *
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-[#E63946] text-white border-[#E63946] shadow-xs'
                        : 'bg-white text-[#1B3A5C] border-[#1B3A5C]/30 hover:border-[#1B3A5C]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Condition Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Price */}
            <div>
              <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
                Price (in Rupees ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E63946] font-black text-base">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="350"
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border-2 border-[#1B3A5C]/20 focus:border-[#1B3A5C] bg-[#FAFBFC] text-sm font-black text-[#1B3A5C] placeholder-[#1B3A5C]/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Condition Chips */}
            <div>
              <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
                Condition *
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {CONDITIONS.map((cond) => {
                  const isSelected = condition === cond;
                  return (
                    <button
                      type="button"
                      key={cond}
                      onClick={() => setCondition(cond)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border-2 ${
                        isSelected
                          ? 'bg-[#E63946] text-white border-[#E63946] shadow-xs'
                          : 'bg-white text-[#1B3A5C] border-[#1B3A5C]/30 hover:border-[#1B3A5C]'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
              Short Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Used for 1 semester, excellent condition. Includes original box/charger. Contact for hostel pickup."
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#1B3A5C]/20 focus:border-[#1B3A5C] bg-[#FAFBFC] text-sm font-medium text-[#1B3A5C] placeholder-[#1B3A5C]/40 outline-none transition-colors resize-none"
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-extrabold text-[#1B3A5C] uppercase tracking-wider mb-2">
              Item Photo (Optional)
            </label>
            
            {imageBase64 ? (
              <div className="relative inline-block border-2 border-[#1B3A5C]/30 rounded-2xl p-2 bg-white">
                <img
                  src={imageBase64}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setImageBase64(null)}
                  className="absolute -top-2 -right-2 bg-[#E63946] text-white p-1 rounded-full shadow-md hover:bg-[#d62839] cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#1B3A5C]/30 hover:border-[#1B3A5C] bg-[#FAFBFC] rounded-2xl p-6 text-center cursor-pointer transition-colors group"
              >
                {isProcessingImage ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#E63946]">
                    <Send className="w-4 h-4 animate-spin text-[#E63946]" />
                    <span>Processing photo...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload className="w-6 h-6 text-[#1B3A5C]/50 group-hover:text-[#E63946] transition-colors" />
                    <p className="text-xs font-bold text-[#1B3A5C]">
                      Click to upload photo or drag & drop
                    </p>
                    <p className="text-[11px] text-[#1B3A5C]/50">
                      JPG, PNG, WEBP (compressed automatically)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isProcessingImage}
              className="w-full btn-notebook-red py-4 text-base flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Send className="w-5 h-5 animate-spin" />
                  <span>Publishing to Campus Feed...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Post Listing Now</span>
                </>
              )}
            </button>
            {!user && (
              <p className="text-center text-[11px] text-[#1B3A5C]/60 font-semibold mt-2">
                * Posting will ask you to sign in with your VIT student account.
              </p>
            )}
          </div>

        </form>
      </div>
    </section>
  );
};
