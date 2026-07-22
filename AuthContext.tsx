import { Listing } from '../types';

export const DEFAULT_LISTINGS: Listing[] = [
  {
    id: 'listing-dsa-book',
    name: 'Data Structures & Algorithms in C++ (4th Ed)',
    category: 'Books',
    price: 450,
    condition: 'Like New',
    description: 'Essential textbook for CS201/CS202 courses. Zero pencil markings, firm spine. Includes code CD & problem sets.',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    sellerId: 'seller-rahul-01',
    sellerName: 'Rahul Sharma',
    sellerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    sellerContact: 'rahul.s2023@vitstudent.ac.in'
  },
  {
    id: 'listing-bicycle-firefox',
    name: 'Firefox 21-Speed Hybrid Bicycle + Helmet',
    category: 'Cycles',
    price: 3800,
    condition: 'Good',
    description: 'Perfect for riding between MH-A and SJT/TT blocks. Dual disc brakes, brand new tires fitted last month. Comes with a heavy-duty cable lock.',
    createdAt: Date.now() - 86400000 * 1, // 1 day ago
    sellerId: 'seller-ananya-02',
    sellerName: 'Ananya Verma',
    sellerPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    sellerContact: 'ananya.v2022@vitstudent.ac.in'
  },
  {
    id: 'listing-calculator-casio',
    name: 'Casio FX-991EX ClassWiz Scientific Calculator',
    category: 'Electronics',
    price: 850,
    condition: 'Good',
    description: 'Allowed in all FAT exams! Solar powered with 552 functions. Hard protective slider case included.',
    createdAt: Date.now() - 3600000 * 4, // 4 hours ago
    sellerId: 'seller-varun-03',
    sellerName: 'Varun Kumar',
    sellerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    sellerContact: 'varun.k2024@vitstudent.ac.in'
  }
];
