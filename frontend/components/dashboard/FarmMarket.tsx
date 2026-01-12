"use client";

import React, { useMemo, useState } from 'react';
import { Search, ShoppingBag, Phone, MapPin, Menu, X } from '@/components/dashboard/ui/Icons';

// Types
type Category = 'All' | 'Seeds' | 'Fertilizers' | 'Tools & Equipment';

interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  seller: string;
  image: string;
  inStock: boolean;
}

// Dummy Data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Hybrid Tomato Seeds - Srijana",
    category: "Seeds",
    price: 450,
    seller: "Kathmandu Agro Vets",
    image: "/images/1.jpg",
    inStock: true
  },
  {
    id: 2,
    name: "DAP Fertilizer (50kg)",
    category: "Fertilizers",
    price: 6500,
    seller: "Nepal Krishi Samagri",
    image: "/images/3.jpg",
    inStock: true
  },
  {
    id: 3,
    name: "Hand Sprayer (16L)",
    category: "Tools & Equipment",
    price: 2200,
    seller: "Himalayan Farm Tools",
    image: "/images/6.jpg",
    inStock: true
  },
  {
    id: 4,
    name: "Organic Neem Pesticide",
    category: "Fertilizers",
    price: 350,
    seller: "Eco Farm Solutions",
    image: "/images/4.jpg",
    inStock: true
  },
  {
    id: 5,
    name: "Improved Maize Seeds - Manakamana",
    category: "Seeds",
    price: 320,
    seller: "Annapurna Seed Bank",
    image: "/images/2.jpg",
    inStock: false
  },
  {
    id: 6,
    name: "Garden Spade / Kuto",
    category: "Tools & Equipment",
    price: 850,
    seller: "Bhaktapur Iron Works",
    image: "/images/6.jpg",
    inStock: true
  },
  {
    id: 7,
    name: "Urea Fertilizer (50kg)",
    category: "Fertilizers",
    price: 2800,
    seller: "Salt Trading Corporation",
    image: "/images/5.jpg",
    inStock: true
  },
  {
    id: 8,
    name: "Rice Seeds - Sabitri",
    category: "Seeds",
    price: 180,
    seller: "Terai Agro Center",
    image: "/images/1.jpg",
    inStock: true
  },
  {
    id: 9,
    name: "Water Pump (1HP)",
    category: "Tools & Equipment",
    price: 12500,
    seller: "Chitwan Machinery",
    image: "/images/6.jpg",
    inStock: true
  },
  {
    id: 10,
    name: "Cauliflower Seeds - Snowball",
    category: "Seeds",
    price: 550,
    seller: "Pokhara Seed House",
    image: "/images/2.jpg",
    inStock: true
  }
];

function ProductCard({ product }: { product: Product }) {
  const fallbackByCategory: Record<Category, string> = {
    All: '/images/1.jpg',
    Seeds: '/images/2.jpg',
    Fertilizers: '/images/4.jpg',
    'Tools & Equipment': '/images/6.jpg',
  };

  const [imgSrc, setImgSrc] = useState(product.image);

  return (
    <div className="group relative h-full overflow-hidden rounded-4xl bg-[#1e1e2d] border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      {/* Image */}
      <div className="relative w-full h-56 sm:h-60 lg:h-64 xl:h-72 bg-[#141416] overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${!product.inStock ? 'grayscale opacity-60' : ''}`}
          onError={() => {
            const fallback = fallbackByCategory[product.category] ?? '/images/1.jpg';
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white border border-white/10 shadow-sm uppercase tracking-wide">
            {product.category}
          </div>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="bg-red-500 text-white px-5 py-2 rounded-full text-xs font-extrabold shadow-lg tracking-wide uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col px-7 pt-10 pb-7">
        {/* Price pill */}
        <div className="absolute -top-6 right-6 rounded-2xl bg-emerald-600 text-white px-5 py-2.5 shadow-lg border-[3px] border-[#1e1e2d] transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold opacity-90">Rs.</span>
            <span className="text-2xl font-black tracking-tight">{product.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-white leading-snug tracking-tight line-clamp-2 group-hover:text-emerald-300 transition-colors">
            {product.name}
          </h3>
          <p className="mt-3 text-sm text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="shrink-0">Sold by</span>
            <span className="text-zinc-200 font-semibold truncate">{product.seller}</span>
          </p>
        </div>

        <div className="mt-auto">
          <div className="mb-6 flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg ${
                product.inStock ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {product.inStock && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
              </span>
              {product.inStock ? 'In Stock' : 'Unavailable'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={!product.inStock}
              className={`h-12 rounded-2xl text-base font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                product.inStock
                  ? 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/5'
                  : 'bg-[#2c2c35] text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <Phone className="w-5 h-5" />
              Call
            </button>
            <button className="h-12 rounded-2xl text-base font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-[#2c2c35] border border-white/5 hover:bg-[#34343d] hover:border-white/10 text-gray-200">
              <MapPin className="w-5 h-5" />
              Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function FarmMarket() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'low-high' | 'high-low'>('low-high');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.seller.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortOrder === 'low-high') return a.price - b.price;
      return b.price - a.price;
    });

    return result;
  }, [activeCategory, searchQuery, sortOrder]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#111112]">
      
      {/* Mobile Header for Filters */}
      <div className="md:hidden p-4 bg-[#1e1e2d] border-b border-white/5 flex justify-between items-center">
        <span className="font-semibold text-white">Filters</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg text-white">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Filters */}
        <aside className={`
          absolute md:relative z-20 h-full w-[320px] bg-[#141416]/95 border-r border-[#262626] backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-7 space-y-8 overflow-y-auto custom-scrollbar">
            {/* Search */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-300">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" 
                  placeholder="e.g. Tomato seeds..." 
                  className="w-full pl-9 pr-4 py-3.5 bg-[#1e1e2d] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-300">Categories</label>
              <div className="flex flex-col space-y-1">
                {['All', 'Seeds', 'Fertilizers', 'Tools & Equipment'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                      activeCategory === cat 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-lg shadow-emerald-900/20' 
                        : 'text-gray-400 hover:bg-white/5 border-transparent hover:text-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-300">Sort By Price</label>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full px-4 py-3.5 bg-[#1e1e2d] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 appearance-none cursor-pointer"
                >
                  <option value="low-high">Lowest Price First</option>
                  <option value="high-low">Highest Price First</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-full px-5 py-8 sm:px-8 md:px-10 md:py-10">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Farm Supplies</h2>
                <p className="mt-1 text-sm text-zinc-500 font-medium">Premium seeds, fertilizers & tools • Verified sellers</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-zinc-300 bg-white/5 px-4 py-2 rounded-full border border-white/5 tracking-wide">
                {filteredProducts.length} products found
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500 bg-[#1e1e2d] rounded-2xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                  <ShoppingBag className="w-8 h-8 opacity-40 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-400">No products found.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                  className="mt-4 text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 auto-rows-fr">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
