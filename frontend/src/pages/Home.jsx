import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_CATEGORIES = [
  "Groceries", "Detergents", "Rice & Grains", "Cooking Oil",
  "Beverages", "Snacks", "Baby Care", "Personal Care",
];

const HERO_SLIDES = [
  {
    tag: "Fresh Arrivals",
    headline: "Shop Ghana's\nFreshest Groceries",
    sub: "Delivered to your door — pay with MoMo or cash.",
    cta: "Shop Now",
    badge: "Up to 30% off",
    bg: "from-red-700 to-red-900",
    img: "🛒",
    accent: "#fbbf24",
  },
  {
    tag: "Top Deals",
    headline: "Premium\nDetergents & Cleaning",
    sub: "Keep your home spotless with top brands at best prices.",
    cta: "View Deals",
    badge: "Buy 2 Get 1 Free",
    bg: "from-red-600 to-rose-800",
    img: "🧴",
    accent: "#34d399",
  },
  {
    tag: "Flash Sale",
    headline: "Wholesale\nPrices on Rice & Oil",
    sub: "Stock up on staples — bulk orders available nationwide.",
    cta: "Grab Deals",
    badge: "Limited Time",
    bg: "from-red-800 to-red-950",
    img: "🌾",
    accent: "#60a5fa",
  },
];

const FLASH_DEALS = [
  { id: 1, name: "Mama's Choice Detergent 5kg", price: 85, oldPrice: 120, img: "🧺", sold: 78, total: 100, tag: "Bestseller" },
  { id: 2, name: "Golden Penny Rice 25kg Bag", price: 220, oldPrice: 280, img: "🌾", sold: 45, total: 60, tag: "Bulk Save" },
  { id: 3, name: "Frytol Vegetable Oil 5L", price: 110, oldPrice: 145, img: "🫙", sold: 60, total: 80, tag: "Hot" },
  { id: 4, name: "Omo Washing Powder 2kg", price: 48, oldPrice: 65, img: "🫧", sold: 90, total: 100, tag: "Almost Gone" },
  { id: 5, name: "Milo Cocoa Drink 400g", price: 55, oldPrice: 72, img: "🍫", sold: 30, total: 50, tag: "Popular" },
  { id: 6, name: "Dettol Antiseptic 500ml", price: 38, oldPrice: 55, img: "🧴", sold: 55, total: 70, tag: "Essential" },
];

const CATEGORIES = [
  { name: "Groceries", emoji: "🥦", color: "bg-green-50 border-green-200", text: "text-green-700" },
  { name: "Detergents", emoji: "🫧", color: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  { name: "Rice & Grains", emoji: "🌾", color: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  { name: "Cooking Oil", emoji: "🫙", color: "bg-yellow-50 border-yellow-200", text: "text-yellow-700" },
  { name: "Beverages", emoji: "🥤", color: "bg-red-50 border-red-200", text: "text-red-700" },
  { name: "Snacks", emoji: "🍪", color: "bg-orange-50 border-orange-200", text: "text-orange-700" },
  { name: "Baby Care", emoji: "🍼", color: "bg-pink-50 border-pink-200", text: "text-pink-700" },
  { name: "Personal Care", emoji: "🪥", color: "bg-purple-50 border-purple-200", text: "text-purple-700" },
];

const FEATURED = [
  { id: 7, name: "Sunlight Dishwashing Liquid 750ml", price: 28, oldPrice: 38, img: "🫧", rating: 4.8, reviews: 312 },
  { id: 8, name: "Cowbell Milk Powder 400g", price: 62, oldPrice: 80, img: "🥛", rating: 4.6, reviews: 187 },
  { id: 9, name: "Indomie Instant Noodles (40 pcs)", price: 95, oldPrice: 115, img: "🍜", rating: 4.9, reviews: 524 },
  { id: 10, name: "Afia Tomato Paste 70g ×12", price: 72, oldPrice: 90, img: "🍅", rating: 4.7, reviews: 298 },
  { id: 11, name: "Morning Fresh Detergent 2L", price: 55, oldPrice: 75, img: "🧴", rating: 4.5, reviews: 143 },
  { id: 12, name: "Tasty Tom Tomato Stew Base", price: 45, oldPrice: 60, img: "🥫", rating: 4.8, reviews: 411 },
  { id: 13, name: "Eva Table Water 1.5L ×12", price: 42, oldPrice: 55, img: "💧", rating: 4.7, reviews: 205 },
  { id: 14, name: "Ariel Automatic 1.5kg", price: 78, oldPrice: 100, img: "🌊", rating: 4.6, reviews: 167 },
];

const BANNERS = [
  { label: "Buy More, Save More", sub: "5% off orders above ₵500", emoji: "📦", bg: "bg-amber-400", text: "text-amber-900" },
  { label: "Free Delivery", sub: "On orders above ₵200 in Accra", emoji: "🚚", bg: "bg-green-400", text: "text-green-900" },
  { label: "Pay with MoMo", sub: "MTN, Vodafone, AirtelTigo", emoji: "📱", bg: "bg-blue-400", text: "text-blue-900" },
];

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────

function useCountdown(hours = 5) {
  const end = useRef(Date.now() + hours * 3600 * 1000);
  const [time, setTime] = useState({ h: hours, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, end.current - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.floor(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, compact = false }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const disc = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image area */}
      <div className="relative bg-gray-50 flex items-center justify-center h-40">
        <span className="text-6xl select-none">{product.img}</span>
        {/* Discount badge */}
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{disc}%
        </span>
        {/* Tag */}
        {product.tag && (
          <span className="absolute top-2 right-10 bg-amber-400 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <svg className={`w-4 h-4 ${wished ? "text-red-500 fill-red-500" : "text-gray-400"}`} fill={wished ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{product.name}</p>

        {product.rating && (
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[11px] text-gray-400">({product.reviews})</span>
          </div>
        )}

        {/* Flash sale progress bar */}
        {product.sold !== undefined && (
          <div className="mt-1">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-red-500 to-orange-400 rounded-full transition-all"
                style={{ width: `${(product.sold / product.total) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{product.sold} sold</p>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-base font-bold text-red-600">₵{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₵{product.oldPrice}</span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className={`mt-1 w-full py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            added
              ? "bg-green-500 text-white"
              : "bg-red-600 hover:bg-red-700 text-white active:scale-95"
          }`}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ─── HERO SLIDER ─────────────────────────────────────────────────────────────

function HeroSlider() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_SLIDES[active];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${slide.bg} transition-all duration-700 min-h-80 md:min-h-80 flex items-center`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full px-8 md:px-14 py-10 gap-6">
        {/* Text */}
        <div className="flex-1 text-white">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-4">
            {slide.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight whitespace-pre-line mb-3" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
            {slide.headline}
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-6 max-w-sm">{slide.sub}</p>
          <div className="flex items-center gap-4">
            <button className="bg-white text-red-700 font-bold px-7 py-3 rounded-xl hover:bg-red-50 active:scale-95 transition-all shadow-lg text-sm">
              {slide.cta}
            </button>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/40 text-white">
              🏷️ {slide.badge}
            </span>
          </div>
        </div>

        {/* Emoji icon */}
        <div className="text-[120px] md:text-[160px] select-none leading-none drop-shadow-2xl animate-bounce" style={{ animationDuration: "3s" }}>
          {slide.img}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-white" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── FLASH SALE SECTION ───────────────────────────────────────────────────────

function FlashSaleSection() {
  const { h, m, s } = useCountdown(5);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-black text-gray-900">Flash Deals</h2>
          <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
            <span>{pad(h)}</span><span className="opacity-60 animate-pulse">:</span>
            <span>{pad(m)}</span><span className="opacity-60 animate-pulse">:</span>
            <span>{pad(s)}</span>
          </div>
        </div>
        <button className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
          See all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {FLASH_DEALS.map((p) => <ProductCard key={p.id} product={p} compact />)}
      </div>
    </section>
  );
}

// ─── CATEGORIES SECTION ───────────────────────────────────────────────────────

function CategoriesSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
        <button className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
          All categories <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${cat.color} hover:scale-105 active:scale-95 transition-all duration-200`}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className={`text-[11px] font-semibold text-center leading-tight ${cat.text}`}>{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── MINI BANNERS ─────────────────────────────────────────────────────────────

function MiniBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {BANNERS.map((b) => (
        <div key={b.label} className={`${b.bg} rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity`}>
          <span className="text-3xl">{b.emoji}</span>
          <div>
            <p className={`font-black text-sm ${b.text}`}>{b.label}</p>
            <p className={`text-xs ${b.text} opacity-80`}>{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────

function FeaturedSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-900">🛍️ Featured Products</h2>
        <button className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
          View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {FEATURED.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [search, setSearch] = useState("");
  const [cartCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-red-700 text-white text-xs py-1.5 px-4 text-center font-medium">
        🚚 Free delivery on orders above ₵200 in Accra | Pay with MoMo 📱
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <a href="#" className="shrink-0 flex items-center gap-2">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-black text-base">M</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-gray-900 text-lg leading-none">Mart</span>
            <span className="font-black text-red-600 text-lg leading-none">Ghana</span>
          </div>
        </a>

        {/* Location */}
        <button className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:border-red-300 transition-colors shrink-0">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="font-medium">Accra</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
        </button>

        {/* Search */}
        <div className="flex-1 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groceries, detergents, rice..."
            className="w-full border-2 border-gray-200 focus:border-red-500 rounded-xl pl-4 pr-12 py-2.5 text-sm outline-none transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden sm:flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors px-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span className="text-[10px] font-medium">Account</span>
          </button>
          <button className="hidden sm:flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors px-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span className="text-[10px] font-medium">Wishlist</span>
          </button>
          <button className="relative flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors px-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span className="text-[10px] font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-0 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          {/* Mobile menu */}
          <button className="sm:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      {/* Category nav strip */}
      <div className="border-t border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2 min-w-max">
          <button className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            All Categories
          </button>
          {NAV_CATEGORIES.map((c) => (
            <button key={c} className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap shrink-0">
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="font-black text-white text-lg">MartGhana</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">Ghana's trusted online store for groceries, detergents and household essentials.</p>
          <div className="flex gap-3 mt-4">
            {["📘","🐦","📸","▶️"].map((s,i)=>(
              <button key={i} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors text-sm">{s}</button>
            ))}
          </div>
        </div>
        {[
          { title: "Quick Links", links: ["Home", "Flash Sales", "New Arrivals", "Best Sellers", "Track Order"] },
          { title: "Categories", links: ["Groceries", "Detergents", "Rice & Grains", "Beverages", "Baby Care"] },
          { title: "Support", links: ["Contact Us", "FAQs", "Return Policy", "Privacy Policy", "Terms of Service"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-white mb-4 text-sm">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-red-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p className="text-xs text-gray-500">© 2025 MartGhana. All rights reserved.</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>We accept:</span>
          <span className="bg-gray-800 px-2 py-1 rounded font-medium">MoMo 📱</span>
          <span className="bg-gray-800 px-2 py-1 rounded font-medium">Visa 💳</span>
          <span className="bg-gray-800 px-2 py-1 rounded font-medium">Cash 💵</span>
        </div>
      </div>
    </footer>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: "🚚", title: "Nationwide Delivery", sub: "Accra, Kumasi & more" },
    { icon: "📱", title: "MoMo Payments", sub: "MTN, Vodafone, AirtelTigo" },
    { icon: "↩️", title: "Easy Returns", sub: "7-day return policy" },
    { icon: "🔒", title: "Secure Checkout", sub: "100% safe & encrypted" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <p className="text-sm font-bold text-gray-800">{item.title}</p>
            <p className="text-[11px] text-gray-400">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10">
        {/* Hero */}
        <HeroSlider />

        {/* Trust Bar */}
        <TrustBar />

        {/* Categories */}
        <CategoriesSection />

        {/* Flash Sale */}
        <FlashSaleSection />

        {/* Mini Banners */}
        <MiniBanners />

        {/* Featured */}
        <FeaturedSection />

        {/* Newsletter */}
        <div className="bg-linear-to-br from-red-600 to-red-800 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
          <div className="relative text-white">
            <h3 className="text-2xl font-black mb-1">Get the best deals first! 🎉</h3>
            <p className="text-white/80 text-sm">Subscribe for exclusive deals, new arrivals and weekly offers.</p>
          </div>
          <div className="relative flex gap-2 w-full md:w-auto">
            <input
              placeholder="Enter your email or phone"
              className="flex-1 md:w-72 bg-white/10 border border-white/30 text-white placeholder-white/60 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/20 transition"
            />
            <button className="bg-white text-red-700 font-bold px-6 py-3 rounded-xl hover:bg-red-50 active:scale-95 transition-all text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
