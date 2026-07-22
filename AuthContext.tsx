export type Category = 'Books' | 'Cycles' | 'Electronics' | 'Other';
export type Condition = 'Like New' | 'Good' | 'Fair';

export interface Listing {
  id: string;
  name: string;
  category: Category;
  price: number;
  condition: Condition;
  description: string;
  imageBase64?: string;
  createdAt: number;
  sellerId: string;
  sellerName?: string;
  sellerPhoto?: string;
  sellerContact?: string; // Optional email or phone or hostel info
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName: string;
  isVitStudent: boolean;
}
