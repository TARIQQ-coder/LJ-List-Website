import { useState, useEffect, useRef } from 'react'
import {
  auth as authApi,
  profile as profileApi,
  applications as applicationsApi,
  conversations as convsApi,
  adminApplications,
  adminProducts,
  adminConversations,
  pollMessages,
} from './api.js'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CATEGORIES
//  To add a new category: add an entry here. That's it.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CATEGORIES = [
  { id: 'rice',       label: 'Rice, Spaghetti & Grains',      description: 'Rice, spaghetti, noodles & grains' },
  { id: 'oil',        label: 'Cooking Oil',                   description: 'Vegetable oil, palm oil & blended oils' },
  { id: 'canned',     label: 'Canned Fish & Tin Tomatoes',    description: 'Mackerel, sardines, baked beans, corned beef & more' },
  { id: 'provisions', label: 'Provisions',                    description: 'Milk, Milo, cereals, sugar, biscuits, water & everyday essentials' },
  { id: 'frozen',     label: 'Frozen Foods',                  description: 'Frozen chicken, fish & meats' },
  { id: 'cleaning',   label: 'Detergents',                    description: 'Washing powder, soaps, disinfectants & cleaning products' },
  { id: 'fresh',      label: 'Vegetables',                    description: 'Fresh vegetables, fruits & produce' },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PRODUCTS
//  To add a product: add one object to this array.
//  Fields: id (unique number), name, cat (must match a CATEGORIES id above),
//          price, oldPrice, unit, emoji (fallback), img (optional — put file
//          in public/images/ and set img: '/images/filename.png')
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PRODUCTS = [
  // ── RICE, SPAGHETTI & GRAINS ──────────────────────────────────────────────
  { id: 101, name: 'Royal Aroma 25kg (5*5)',            cat: 'rice', price: 400, oldPrice: 440, unit: 'bag',      img: '/images/royal.jpg',                 tag: 'In Stock' },
  { id: 109, name: 'Millicent Fragrant 25kg (5*5)',     cat: 'rice', price: 405, oldPrice: 445, unit: 'bag',      img: '/images/Millicent-Rice-25kg_R.jpg',  tag: 'In Stock' },
  { id: 112, name: 'Everest Viet (Yellow) 25kg (5*5)',  cat: 'rice', price: 400, oldPrice: 440, unit: 'bag',      img: '/images/Everest-viet-yellow.webp',   tag: 'In Stock' },
  { id: 113, name: 'Ginny Viet 25kg (5*5)',             cat: 'rice', price: 330, oldPrice: 370, unit: 'bag',      img: '/images/ginny45kg.png',              tag: 'In Stock' },
  { id: 114, name: 'Ginny Gold Thai 25kg (5*5)',        cat: 'rice', price: 595, oldPrice: 650, unit: 'bag',      img: '/images/ginny-gold-4.5kg.png',       tag: 'Premium' },
  { id: 115, name: 'Everest Thai Holm 25kg (5*5) Red', cat: 'rice', price: 720, oldPrice: 780, unit: 'bag',      img: '/images/Everest-Thai-Holm.jpg',      tag: 'Premium' },
  { id: 301, name: 'Spaghetti Big Size 400g ×20',      cat: 'rice', price: 150, oldPrice: 175, unit: 'half box', img: '/images/Oba-Spagetti-405x330.jpg',   tag: 'In Stock' },

  // ── COOKING OIL ───────────────────────────────────────────────────────────
  { id: 201, name: 'Frytol/Sunflower Oil 1L', cat: 'oil', price: 40,  oldPrice: 50,  unit: 'bottle', img: '/images/Cindy-Sunflower-1L.jpg',  tag: 'In Stock' },
  { id: 202, name: 'Sunflower Oil 5L',        cat: 'oil', price: 180, oldPrice: 210, unit: 'gallon', img: '/images/Magic-Sunflower-5L.jpg', tag: 'In Stock' },

  // ── CANNED FISH & TIN TOMATOES ────────────────────────────────────────────
  { id: 401, name: 'Tasty Tom Tomato 2.2kg', cat: 'canned', price: 230, oldPrice: 265, unit: 'full can',     img: '/images/Taste-Tom-2.2kg.jpg',     tag: 'In Stock' },
  { id: 402, name: 'Rosa/Hondi Tomato 2.2kg',   cat: 'canned', price: 45,  oldPrice: 55,  unit: ' full can',              img: '/images/Rosa-tomato-paste.webp',               tag: 'In Stock' },
  { id: 403, name: 'Mackerel 420g ×24',         cat: 'canned', price: 420, oldPrice: 470, unit: 'quarter box (6pcs)', img: '/images/African-Queen-420g.jpeg', tag: 'In Stock' },
  { id: 404, name: 'Mackerel 155g ×50',         cat: 'canned', price: 430, oldPrice: 480, unit: 'quarter box (12pcs)',img: '/images/Magic-Mackerel.jpg',              tag: 'In Stock' },
  { id: 405, name: 'Sardine ×50',               cat: 'canned', price: 430, oldPrice: 480, unit: 'quarter box (12pcs)',img: '/images/Loki-Sardine.jpg',      tag: 'In Stock' },

  // ── PROVISIONS — sold as packages only (see PROVISIONS_PACKAGES) ──────────

  // ── FROZEN FOODS ──────────────────────────────────────────────────────────
  { id: 601, name: 'Frozen Chicken Thigh 10kg (Hard)', cat: 'frozen', price: 435, oldPrice: 480, unit: 'full box', img: '/images/Chicken-thigh.jpeg', tag: 'Frozen' },
  { id: 602, name: 'Frozen Chicken Thigh 10kg (Soft)', cat: 'frozen', price: 370, oldPrice: 415, unit: 'full box', img: '/images/Chicken-thigh.jpeg', tag: 'Frozen' },

  // ── DETERGENTS — sold as packages only (see DETERGENT_PACKAGES) ────────────

  // ── VEGETABLES ────────────────────────────────────────────────────────────
  { id: 1001, name: 'Fresh Tomatoes (Basket)',        cat: 'fresh', price: null, oldPrice: null, unit: 'basket', img: '/images/Basket-tomatoes.png', tag: 'Seasonal' },
  { id: 1002, name: 'Fresh Onions (Basket)',          cat: 'fresh', price: null, oldPrice: null, unit: 'basket', img: '/images/Basket-Onions.jpg',   tag: 'Seasonal' },
  { id: 1003, name: 'Fresh Pepper (Basket)',          cat: 'fresh', price: null, oldPrice: null, unit: 'basket', img: '/images/Basket-pepper.webp',  tag: 'Seasonal' },
]

const MIN_ORDER = 549

const PACKAGE_OPTIONS = [
  'ABUSUA ASOMDWEE (GHC569)',
  'MEDAASE MEDO (GHC769)',
  'YOU DO ALL (GHC900)',
  'SUPER LOVE (GHC1,289)',
  'SUPER LOVE GYE WO TWO (GHC1,980)',
  'VALENTINE PACKAGE (GHC1,260)',
  'CUSTOMIZED REQUEST (Call/WhatsApp 0244854206)',
]

const FIXED_PACKAGES = [
  {
    id: 'abusua',
    name: 'Abusua Asomdwee',
    tagline: 'Perfect for individuals & small families',
    price: 'GH₵569',
    monthly: 'GH₵190/mo',
    tag: 'Starter',
    popular: false,
    riceOptions: 'Ginny Viet · Ginny Gold · Everest Viet',
    items: [
      { productId: 113, qty: 1, label: 'Rice 25kg (5*5)',               emoji: '🌾', img: '/images/ginny45kg.png' },
      { productId: 202, qty: 2, label: '1L Sunflower Oil',              emoji: '🫙', img: '/images/Cindy-Sunflower-1L.jpg' },
      { productId: 402, qty: 1, label: 'Rosa/Hondi Tomato 2.2kg',       emoji: '🍅', img: '/images/Rosa-tomato-paste.webp' },
      { productId: 301, qty: 1, label: '¼ Box Spaghetti',               emoji: '🍝', img: '/images/Oba-Spagetti-405x330.jpg' },
    ],
  },
  {
    id: 'medaase',
    name: 'Medaase Medo',
    tagline: 'Great value for medium households',
    price: 'GH₵769',
    monthly: 'GH₵257/mo',
    tag: 'Popular',
    popular: true,
    riceOptions: 'Royal Aroma · Millicent · Everest Viet',
    items: [
      { productId: 101, qty: 1, label: 'Rice 25kg (5*5)',               emoji: '🌾', img: '/images/royal.jpg' },
      { productId: 202, qty: 3, label: '1L Sunflower Oil',              emoji: '🫙', img: '/images/Cindy-Sunflower-1L.jpg' },
      { productId: 402, qty: 1, label: 'Rosa/Hondi Tomato 2.2kg',       emoji: '🍅', img: '/images/Rosa-tomato-paste.webp' },
      { productId: 301, qty: 1, label: '¼ Box Spaghetti',               emoji: '🍝', img: '/images/Oba-Spagetti-405x330.jpg' },
      { productId: 403, qty: 1, label: '¼ Box Mackerel 420g',           emoji: '🐟', img: '/images/African-Queen-420g.jpeg' },
    ],
  },
  {
    id: 'youdo',
    name: 'You Do All',
    tagline: 'Complete grocery bundle for the whole family',
    price: 'GH₵900',
    monthly: 'GH₵300/mo',
    tag: 'Family',
    popular: false,
    riceOptions: 'Royal Aroma · Millicent · Everest Viet',
    items: [
      { productId: 101, qty: 1, label: 'Rice 25kg (5*5)',               emoji: '🌾', img: '/images/royal.jpg' },
      { productId: 202, qty: 1, label: '5L Sunflower Oil',              emoji: '🫙', img: '/images/Magic-Sunflower-5L.jpg' },
      { productId: 402, qty: 2, label: 'Rosa/Hondi Tomato 2.2kg',       emoji: '🍅', img: '/images/Rosa-tomato-paste.webp' },
      { productId: 301, qty: 1, label: '½ Box Spaghetti',               emoji: '🍝', img: '/images/Oba-Spagetti-405x330.jpg' },
      { productId: 403, qty: 1, label: '¼ Box Mackerel 420g',           emoji: '🐟', img: '/images/African-Queen-420g.jpeg' },
    ],
  },
  {
    id: 'superlove',
    name: 'Super Love',
    tagline: 'For families that want the very best',
    price: 'GH₵1,289',
    monthly: 'GH₵430/mo',
    tag: 'Premium',
    popular: false,
    riceOptions: 'Ginny Gold Thai · Everest Thai Holm',
    items: [
      { productId: 114, qty: 1, label: 'Rice 25kg (5*5)',               emoji: '🌾', img: '/images/ginny-gold-4.5kg.png' },
      { productId: 202, qty: 1, label: '5L Sunflower Oil',              emoji: '🫙', img: '/images/Sunflower-Oil-5L.jpeg' },
      { productId: 401, qty: 2, label: 'Tasty Tom Tomato 2.2kg',     emoji: '🍅', img: '/images/Taste-Tom-2.2kg.jpg' },
      { productId: 301, qty: 1, label: '1 Box Spaghetti',               emoji: '🍝', img: '/images/Oba-Spagetti-405x330.jpg' },
      { productId: 403, qty: 1, label: '½ Box Mackerel 420g',           emoji: '🐟', img: '/images/African-Queen-420g.jpeg' },
    ],
  },
  {
    id: 'superlovegye',
    name: 'Super Love Gye Wo Two',
    tagline: 'The full abundance package — nothing left out',
    price: 'GH₵1,980',
    monthly: 'GH₵660/mo',
    tag: 'Ultimate',
    popular: false,
    riceOptions: 'Millicent Fragrant · Everest Thai Holm',
    items: [
      { productId: 109, qty: 1, label: 'Rice 25kg (5*5)',               emoji: '🌾', img: '/images/Millicent-Rice-25kg_R.jpg' },
      { productId: 202, qty: 1, label: '5L Sunflower Oil',              emoji: '🫙', img: '/images/Sunflower-Oil-5L.jpeg' },
      { productId: 401, qty: 2, label: 'Tasty Tom Tomato 2.2kg',     emoji: '🍅', img: '/images/Taste-Tom-2.2kg.jpg' },
      { productId: 301, qty: 1, label: '1 Box Spaghetti',               emoji: '🍝', img: '/images/Oba-Spagetti-405x330.jpg' },
      { productId: 403, qty: 1, label: '1 Box Mackerel 420g',           emoji: '🐟', img: '/images/African-Queen-420g.jpeg' },
      { productId: 405, qty: 1, label: '½ Box Sardine ×50',             emoji: '🐟', img: '/images/titus-sardines.png' },
    ],
  },
  {
    id: 'valentine',
    name: 'Love Package',
    tagline: 'You Do All + a full box of chicken — spoil them right!',
    price: 'GH₵1,260',
    monthly: 'GH₵420/mo',
    tag: '❤️ Special',
    popular: false,
    riceOptions: 'Royal Aroma · Millicent · Everest Viet',
    items: [
      { productId: 101, qty: 1, label: 'Rice 25kg (5*5)',               emoji: '🌾', img: '/images/royal.jpg' },
      { productId: 202, qty: 1, label: '5L Sunflower Oil',              emoji: '🫙', img: '/images/Magic-Sunflower-5L.jpg' },
      { productId: 402, qty: 2, label: 'Tasty Tom Tomato 2.2kg',       emoji: '🍅', img: '/images/Taste-Tom-2.2kg.jpg' },
      { productId: 301, qty: 1, label: '½ Box Spaghetti',               emoji: '🍝', img: '/images/Oba-Spagetti-405x330.jpg' },
      { productId: 403, qty: 1, label: '¼ Box Mackerel 420g',           emoji: '🐟', img: '/images/African-Queen-420g.jpeg' },
      { productId: 601, qty: 1, label: 'Box of Chicken 10kg',             emoji: '🍗', img: '/images/Chicken-thigh.jpeg' },
    ],
  },
  {
    id: 'custom',
    name: 'Customized Request',
    tagline: 'Build your own — call or WhatsApp us',
    price: 'Call us',
    monthly: 'Flexible',
    tag: 'Custom',
    popular: false,
    items: [],
  },
]

// ── PROVISIONS PACKAGES (displayed in Provisions department section) ──────────
const PROVISIONS_PACKAGES = [
  {
    id: 'maakye',
    name: 'Maakye',
    price: 250,
    items: '1 Milo tin or 2 strips of 20g Milo · ¼ Carton of Milk / 2 strips of Nido (Small) · 1 pack of oats · Sugar (½ olonka) · Gari (1 olonka) · 1 Box of Lipton',
  },
  {
    id: 'metwa',
    name: 'Me Twa Menum',
    price: 350,
    items: '2 tins of Milo or 4 strips of 20g Milo · ¼ Carton of Milk + 2 strips of Nido (Small) or ½ carton of milk · Sugar (1 olonka) · Gari (1 olonka) · Tombrown (1 olonka) · 2 packs of oats · 1 pack of Lipton · 1 pack of school biscuit',
  },
  {
    id: 'abusuaanopa',
    name: 'Abusua Anopa',
    price: 529,
    items: '3 strips of 20g Milo · ¼ Carton of Milk + 2 strips of Nido (Small) or ½ carton of milk · Sugar (½ olonka) · Gari (1 olonka) · Tombrown (½ olonka) · 1 pack of oats · 1 Box of Lipton · 1 pack of school biscuit',
  },
]

// ── DETERGENT PACKAGES (displayed in Detergents department section) ───────────
const DETERGENT_PACKAGES = [
  {
    id: 'mawohonte',
    name: 'Ma Wo Ho Nte',
    price: 270,
    items: 'Madar / Kleesoft 400g (¼ Box) · Madar / Kleesoft Soap (¼ Box) · 1 Parazone · Geisha Soap (4) · Mosquito Coil (1) · After wash (1L) · Toilet Roll 1 pack · Toothbrush (3)',
  },
  {
    id: 'sooclean',
    name: 'Soo Clean',
    price: 490,
    items: 'Madar / Kleesoft 400g (½ Box) · Madar / Kleesoft Soap (½ Box) · 1 Parazone · Geisha Soap (¼) · Mosquito Coil / Mosquito Spray (2) · After wash (3L) · Toilet Roll 1 pack · Toothbrush (3)',
  },
]

const HERO_IMAGES = [
  { src: '/images/Cover-Image1.png', alt: 'Grocery package with rice and essentials' },
  { src: '/images/Cover-Image2.png', alt: 'Ginny Gold rice and grocery bundle' },
  { src: '/images/Cover-Image3.png', alt: 'Royal Aroma and Millicent rice packages' },
  { src: '/images/slider-2.jpg',     alt: 'Fresh vegetables' },
]

const TRUST = [
  { icon: '📅', title: '1–3 Month Plans', sub: 'Pay in easy instalments' },
  { icon: '🏛️', title: 'Govt Workers Only', sub: 'All Ghana public sector' },
  { icon: '🚚', title: 'Bulk Delivery', sub: 'Nationwide across Ghana' },
  { icon: '📞', title: 'Call or WhatsApp', sub: '0244854206 · 0593041474' },
]

const fmt = (n) => `GH₵${Number(n).toLocaleString()}`
const disc = (p, op) => Math.round(((op - p) / op) * 100)

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const LogoMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="gld" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f5c842" /><stop offset="60%" stopColor="#d4a017" /><stop offset="100%" stopColor="#a07010" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="46" stroke="url(#gld)" strokeWidth="6" />
    <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="Georgia,serif" fill="url(#gld)">J</text>
  </svg>
)

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ cartCount, onCartOpen, onApply, onDeptClick, onSearch, onAccountClick, user }) => {
  const [search, setSearch] = useState('')

  const handleSearch = (val) => {
    setSearch(val)
    onSearch && onSearch(val.trim().toLowerCase())
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') onSearch && onSearch(search.trim().toLowerCase())
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-amber-400 py-2.5 text-center tracking-widest font-black text-sm uppercase">
        🛒 Buy Groceries in Bulk and Pay Within 3 Months
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <LogoMark size={38} />
          <div className="hidden sm:block leading-tight">
            <p className="font-black text-gray-900 text-base leading-none">List <span className="text-amber-500">"J"</span></p>
            <p className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase">Grocery Shop</p>
          </div>
        </div>

        <div className="flex-1 relative max-w-xl">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={search} onChange={e => handleSearch(e.target.value)} onKeyDown={handleKey}
            placeholder="Search rice, oil, sardines, chicken..."
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none transition-all" />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Account icon — GH Basket style */}
          <button onClick={onAccountClick}
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-800 transition-colors relative">
            {user ? (
              <>
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-black text-xs">
                  {(user.display_name || user.name)?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-semibold max-w-[52px] truncate">{(user.display_name || user.name)?.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="text-[10px]">Sign In</span>
              </>
            )}
          </button>

          {/* Cart */}
          <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span className="text-[10px]">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>

          <button onClick={onApply}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm uppercase tracking-wider">
            Apply Now
          </button>
        </div>
      </div>

      {/* Category strip — evenly distributed */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-stretch w-full">
          <button onClick={() => onDeptClick && onDeptClick('all')}
            className="flex items-center justify-center gap-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 text-xs font-bold transition-colors flex-1 border-r border-gray-200 min-w-0">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span className="hidden lg:inline truncate">All</span>
          </button>
          <button onClick={() => onDeptClick && onDeptClick('packages')}
            className="flex items-center justify-center text-amber-700 bg-amber-50 hover:bg-amber-100 border-r border-amber-100 px-3 py-2.5 text-xs font-bold flex-1 transition-colors min-w-0">
            <span className="truncate">📦 Packages</span>
          </button>
          {CATEGORIES.map((cat, i) => (
            <button key={cat.id} onClick={() => onDeptClick && onDeptClick(cat.id)}
              className={`flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-2.5 text-xs font-medium flex-1 transition-colors min-w-0 ${i < CATEGORIES.length - 1 ? 'border-r border-gray-100' : ''}`}>
              <span className="truncate text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

// ─── AUTH FIELD (shared input — defined outside components to prevent remount) ──
const AuthField = ({ label, name, type = 'text', placeholder, value, onChange, required }) => (
  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input name={name} value={value} onChange={onChange} type={type}
      placeholder={placeholder} autoComplete="off"
      className="w-full border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white text-gray-800 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-all" />
  </div>
)

// ─── CLIENT AUTH PAGE  (GH Basket split-column — API wired) ──────────────────
const ClientAuthPage = ({ onClose, onLogin }) => {
  // Login state
  const [loginForm, setLoginForm] = useState({ phone_number: '', password: '' })
  const [loginErr,  setLoginErr]  = useState('')
  const [loginLoad, setLoginLoad] = useState(false)

  // Register state
  const [regForm,  setRegForm]  = useState({
    display_name: '', phone_number: '', staff_number: '',
    institution: '', ghana_card_number: '', password: '', confirm: ''
  })
  const [regErr,   setRegErr]   = useState('')
  const [regLoad,  setRegLoad]  = useState(false)

  // OTP verification state — shown after successful signup
  const [otpStep,       setOtpStep]       = useState(false)
  const [otpPhone,      setOtpPhone]      = useState('')
  const [otp,           setOtp]           = useState('')
  const [otpErr,        setOtpErr]        = useState('')
  const [otpLoad,       setOtpLoad]       = useState(false)
  const [resendLoad,    setResendLoad]    = useState(false)
  const [resendMsg,     setResendMsg]     = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ── Login ──────────────────────────────────────────────────────────────────
  const doLogin = async (e) => {
    e.preventDefault()
    setLoginErr(''); setLoginLoad(true)
    try {
      const data = await authApi.login({
        phone_number: loginForm.phone_number,
        password:     loginForm.password,
      })
      // Fetch full profile so we have all fields
      const profileData = await profileApi.get()
      const user = profileData.user || data.user
      localStorage.setItem('lj_current_user', JSON.stringify(user))
      onLogin(user)
      onClose()
    } catch (err) {
      // Handle unactivated account — direct them to OTP step
      if (err.code === 'FORBIDDEN') {
        setOtpPhone(loginForm.phone_number)
        setOtpStep(true)
      } else {
        setLoginErr(err.errors?.auth?.[0] || err.message || 'Incorrect phone number or password.')
      }
    } finally {
      setLoginLoad(false)
    }
  }

  // ── Register ───────────────────────────────────────────────────────────────
  const doRegister = async (e) => {
    e.preventDefault()
    setRegErr(''); setRegLoad(true)

    if (regForm.password !== regForm.confirm) {
      setRegErr('Passwords do not match.'); setRegLoad(false); return
    }

    try {
      const data = await authApi.signup({
        display_name:      regForm.display_name,
        phone_number:      regForm.phone_number,
        staff_number:      regForm.staff_number,
        institution:       regForm.institution,
        ghana_card_number: regForm.ghana_card_number,
        password:          regForm.password,
      })
      // Move to OTP verification step
      setOtpPhone(data.verification?.phone_number || regForm.phone_number)
      setOtpStep(true)
    } catch (err) {
      // Surface field-level errors cleanly
      const errs = err.errors || {}
      const first = Object.values(errs).flat()[0]
      setRegErr(first || err.message || 'Registration failed. Please check your details.')
    } finally {
      setRegLoad(false)
    }
  }

  // ── OTP verify ─────────────────────────────────────────────────────────────
  const doVerifyOtp = async (e) => {
    e.preventDefault()
    setOtpErr(''); setOtpLoad(true)
    try {
      const data = await authApi.verifyOtp({ phone_number: otpPhone, otp })
      // Account activated — fetch full profile
      const profileData = await profileApi.get()
      const user = profileData.user || data.user
      localStorage.setItem('lj_current_user', JSON.stringify(user))
      onLogin(user)
      onClose()
    } catch (err) {
      setOtpErr(err.errors?.otp?.[0] || err.message || 'Invalid or expired code. Please try again.')
    } finally {
      setOtpLoad(false)
    }
  }

  const doResendOtp = async () => {
    setResendLoad(true); setResendMsg('')
    try {
      await authApi.resendOtp(otpPhone)
      setResendMsg('A new code has been sent to your phone.')
    } catch {
      setResendMsg('Could not resend. Please wait a moment and try again.')
    } finally {
      setResendLoad(false)
    }
  }

  // ── Shared field component ─────────────────────────────────────────────────
  // ── OTP step ───────────────────────────────────────────────────────────────
  if (otpStep) return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-900 px-8 py-7 text-center">
          <LogoMark size={40} />
          <p className="text-white font-black text-lg mt-3">Verify Your Number</p>
          <p className="text-gray-400 text-xs mt-1">We sent a 6-digit code to</p>
          <p className="text-amber-400 text-sm font-black mt-0.5">{otpPhone}</p>
        </div>
        <form onSubmit={doVerifyOtp} className="px-8 py-7 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5">Verification Code <span className="text-red-400">*</span></label>
            <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
              placeholder="123456" inputMode="numeric" maxLength={6}
              className="w-full border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white text-gray-800 placeholder-gray-400 rounded-lg px-4 py-3 text-xl text-center font-black tracking-widest outline-none transition-all" />
            <p className="text-gray-400 text-xs mt-1.5 text-center">Code expires in 10 minutes</p>
          </div>

          {otpErr && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 font-medium">{otpErr}</p>}
          {resendMsg && <p className="text-green-700 text-xs bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 font-medium">{resendMsg}</p>}

          <button type="submit" disabled={otpLoad || otp.length < 6}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60">
            {otpLoad ? 'Verifying...' : 'Verify & Continue →'}
          </button>

          <div className="text-center space-y-2">
            <button type="button" onClick={doResendOtp} disabled={resendLoad}
              className="text-amber-600 hover:underline text-xs font-semibold disabled:opacity-50">
              {resendLoad ? 'Sending...' : "Didn't receive it? Resend code"}
            </button>
            <br />
            <button type="button" onClick={() => setOtpStep(false)}
              className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  // ── Main auth page ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onClose}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Store
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <LogoMark size={28} />
            <p className="font-black text-gray-900 text-sm">My Account</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <h1 className="text-2xl font-black text-gray-900 mb-1">My Account</h1>
        <p className="text-gray-500 text-sm">Sign in to your account or create a new one below.</p>
      </div>

      {/* Two-column — GH Basket layout */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT — Sign In */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-gray-100">
            <h2 className="text-gray-900 font-black text-lg">Sign In</h2>
            <p className="text-gray-400 text-xs mt-0.5">If you have an account, sign in with your phone number and password.</p>
          </div>
          <form onSubmit={doLogin} className="px-7 py-6 space-y-4">
            <AuthField label="Phone Number" name="phone_number" type="tel" placeholder="+233244000000"
              value={loginForm.phone_number} onChange={e => setLoginForm(p => ({ ...p, phone_number: e.target.value }))} required />
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Password <span className="text-red-400">*</span></label>
              <input name="password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                type="password" placeholder="••••••••"
                className="w-full border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white text-gray-800 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-all" />
              <div className="text-right mt-1.5">
                <button type="button" className="text-xs text-amber-600 hover:underline font-medium">Lost your password?</button>
              </div>
            </div>

            {loginErr && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 font-medium">{loginErr}</p>}

            <button type="submit" disabled={loginLoad}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60">
              {loginLoad ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* RIGHT — Register */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-gray-100">
            <h2 className="text-gray-900 font-black text-lg">Register</h2>
            <p className="text-gray-400 text-xs mt-0.5">Don't have an account yet? Register below — it takes less than a minute.</p>
          </div>
          <form onSubmit={doRegister} className="px-7 py-6 space-y-4">
            <AuthField label="Full Name" name="display_name" placeholder="e.g. Kwame Asante"
              value={regForm.display_name} onChange={e => setRegForm(p => ({ ...p, display_name: e.target.value }))} required />
            <AuthField label="Phone Number" name="phone_number" type="tel" placeholder="+233244000000"
              value={regForm.phone_number} onChange={e => setRegForm(p => ({ ...p, phone_number: e.target.value }))} required />
            <AuthField label="Staff Number" name="staff_number" placeholder="e.g. GHS-2024-001"
              value={regForm.staff_number} onChange={e => setRegForm(p => ({ ...p, staff_number: e.target.value }))} required />
            <AuthField label="Institution / Employer" name="institution" placeholder="e.g. Ghana Health Service"
              value={regForm.institution} onChange={e => setRegForm(p => ({ ...p, institution: e.target.value }))} required />
            <AuthField label="Ghana Card Number" name="ghana_card_number" placeholder="GHA-000000000-0"
              value={regForm.ghana_card_number} onChange={e => setRegForm(p => ({ ...p, ghana_card_number: e.target.value }))} required />
            <AuthField label="Password" name="password" type="password" placeholder="Minimum 8 characters"
              value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} required />
            <AuthField label="Confirm Password" name="confirm" type="password" placeholder="Repeat your password"
              value={regForm.confirm} onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))} required />

            {regErr && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 font-medium">{regErr}</p>}

            <p className="text-gray-400 text-xs leading-relaxed">
              Your personal data will be used to support your experience, manage your account, and process your grocery applications.
            </p>

            <button type="submit" disabled={regLoad}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60">
              {regLoad ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

// ─── CLIENT ACCOUNT PAGE ──────────────────────────────────────────────────────
const ClientAccountPage = ({ user, onClose, onLogout, onApply }) => {
  const [tab, setTab] = useState('overview')
  const memberSince = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : new Date(user.created_at || Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // ── Orders ─────────────────────────────────────────────────────────────────
  const [orders,      setOrders]      = useState([])
  const [ordersLoad,  setOrdersLoad]  = useState(false)

  // ── Messages ───────────────────────────────────────────────────────────────
  const [conv,        setConv]        = useState(null)   // current conversation object
  const [messages,    setMessages]    = useState([])
  const [msgInput,    setMsgInput]    = useState('')
  const [msgLoading,  setMsgLoading]  = useState(false)
  const [convLoading, setConvLoading] = useState(false)
  const [unreadMsgs,  setUnreadMsgs]  = useState(0)
  const msgEnd = useRef(null)

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])

  // Load orders on mount
  useEffect(() => {
    setOrdersLoad(true)
    applicationsApi.list().then(data => {
      setOrders(data.applications || [])
    }).catch(() => {}).finally(() => setOrdersLoad(false))
  }, [])

  // Load conversation when Messages tab opens
  useEffect(() => {
    if (tab !== 'messages') return
    setConvLoading(true)
    convsApi.list({ limit: 1 }).then(async data => {
      const existing = (data.conversations || [])[0]
      if (existing) {
        setConv(existing)
        const msgData = await convsApi.messages(existing.id, { limit: 50 })
        const msgs = msgData.messages || []
        setMessages(msgs)
        setUnreadMsgs(0)
        setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 150)
      }
    }).catch(() => {}).finally(() => setConvLoading(false))
  }, [tab])

  // Poll for new messages while on messages tab
  useEffect(() => {
    if (tab !== 'messages' || !conv) return
    const stop = pollMessages(conv.id, (msgs) => {
      setMessages(msgs)
      setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }, 8000)
    return stop
  }, [tab, conv])

  const sendMsg = async () => {
    if (!msgInput.trim() || msgLoading) return
    const text = msgInput.trim()
    setMsgInput(''); setMsgLoading(true)
    try {
      if (!conv) {
        // Start a new conversation
        const data = await convsApi.start(text)
        const newConv = data.conversation || data
        setConv(newConv)
        const msgData = await convsApi.messages(newConv.id, { limit: 50 })
        setMessages(msgData.messages || [])
      } else {
        await convsApi.send(conv.id, text)
        const msgData = await convsApi.messages(conv.id, { limit: 50 })
        setMessages(msgData.messages || [])
      }
      setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch { } finally { setMsgLoading(false) }
  }

  // Logout via API
  const doLogout = async () => {
    try { await authApi.logout() } catch { }
    localStorage.removeItem('lj_current_user')
    onLogout()
    onClose()
  }

  const unreadCount = messages.filter(m => m.sender_id !== user.id && !m.read_at).length

  const statusStyle = (s) => ({
    pending:   'bg-amber-100 text-amber-700',
    reviewed:  'bg-purple-100 text-purple-700',
    approved:  'bg-green-100 text-green-700',
    declined:  'bg-red-100 text-red-700',
  }[s] || 'bg-gray-100 text-gray-600')

  const displayName = user.display_name || user.name || 'User'

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders',   label: 'My Orders' },
    { id: 'messages', label: `Messages${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { id: 'profile',  label: 'Profile' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Store
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <LogoMark size={26} />
              <p className="font-black text-gray-900 text-sm">My Account</p>
            </div>
          </div>
          <button onClick={doLogout}
            className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors">
            Sign Out
          </button>
        </div>

        {/* Tab strip */}
        <div className="border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 flex gap-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${tab === t.id ? 'border-amber-400 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Profile card — always visible at top */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-black text-xl flex-shrink-0">
            {displayName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-black text-lg">{displayName}</p>
            <p className="text-gray-400 text-sm">{user.phone_number || user.phone}</p>
            {user.staff_number && <p className="text-gray-400 text-xs mt-0.5">Staff No: {user.staff_number}</p>}
            {user.institution  && <p className="text-gray-400 text-xs">{user.institution}</p>}
            <p className="text-gray-300 text-xs mt-0.5">Member since {memberSince}</p>
          </div>
          <button onClick={() => { onApply(); onClose() }}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xs px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
            Apply Now
          </button>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders',   value: ordersLoad ? '...' : String(orders.length) },
                { label: 'Active Plans',   value: ordersLoad ? '...' : String(orders.filter(o => o.status === 'approved').length) },
                { label: 'Pending Review', value: ordersLoad ? '...' : String(orders.filter(o => o.status === 'pending' || o.status === 'reviewed').length) },
                { label: 'Member Status',  value: 'Active' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                  <p className="text-gray-900 font-black text-2xl">{s.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-gray-900 font-black text-sm mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Apply for Package', action: () => { onApply(); onClose() }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/> },
                  { label: 'My Orders',         action: () => setTab('orders'),   icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/> },
                  { label: 'Messages',          action: () => setTab('messages'), icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/> },
                  { label: 'Call / WhatsApp',   action: () => window.open('https://wa.me/233244854206'), icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/> },
                  { label: 'Edit Profile',      action: () => setTab('profile'),  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/> },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-xl px-4 py-3.5 transition-all group text-left">
                    <div className="w-8 h-8 bg-white group-hover:bg-amber-100 border border-gray-200 group-hover:border-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-all">
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">{a.icon}</svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-amber-700 leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-amber-800 font-black text-sm mb-2">How it works</p>
              <ol className="space-y-2">
                {['Apply for a package using the Apply Now button.','Our team reviews your mandate number and Ghana Card.','Once approved, your package is delivered and a 3-month payment plan begins.','Check your orders here to see status and payment schedule.','Message us directly from the Messages tab for any questions.'].map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-amber-800">
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-gray-900 font-black text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ── MY ORDERS ── */}
        {tab === 'orders' && (
          ordersLoad ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-gray-700 font-black text-base mb-2">No orders yet</p>
              <p className="text-gray-400 text-sm mb-5">Once you apply and your order is approved, it will appear here.</p>
              <button onClick={() => { onApply(); onClose() }}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-8 py-3 rounded-xl transition-colors active:scale-95">
                Apply for a Package
              </button>
              <p className="text-gray-400 text-xs mt-3">Already applied? <a href="https://wa.me/233244854206" className="text-amber-600 font-semibold">WhatsApp us</a> for an update.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-gray-900 font-black">{o.package_name || o.package_type}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${statusStyle(o.status)}`}>{o.status}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 flex-wrap gap-2">
                    <span>Total: <span className="font-black text-gray-900">{fmt(o.total_amount)}</span></span>
                    <span>Monthly: <span className="font-black text-gray-900">{fmt(o.monthly_amount)}/mo</span></span>
                    <span>Type: <span className="font-black text-gray-900 capitalize">{o.package_type}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── MESSAGES ── API-wired */}
        {tab === 'messages' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <LogoMark size={22} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-black text-sm">List "J" Support</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <p className="text-gray-400 text-xs">We reply within a few hours</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50">
              {convLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">No messages yet</p>
                  <p className="text-gray-400 text-xs">Send us a message below about your order or application.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender_id !== user.id
                  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  const date = new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[72%] flex flex-col gap-1 ${isAdmin ? 'items-start' : 'items-end'}`}>
                        {isAdmin && <p className="text-gray-400 text-[10px] px-1">List "J" Support</p>}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAdmin ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm' : 'bg-gray-900 text-white rounded-tr-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <p className="text-gray-300 text-[10px] px-1">{date} · {time}</p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={msgEnd} />
            </div>

            {/* Compose */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3 items-end">
              <textarea value={msgInput} onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
                placeholder="Type your message... (Enter to send)"
                rows={2}
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none" />
              <button onClick={sendMsg} disabled={!msgInput.trim() || msgLoading}
                className="w-11 h-11 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95">
                {msgLoading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 max-w-lg">
            {[
              { label: 'Full Name',     value: displayName },
              { label: 'Phone',         value: user.phone_number || user.phone || '—' },
              { label: 'Staff Number',  value: user.staff_number || '—' },
              { label: 'Institution',   value: user.institution || '—' },
              { label: 'Ghana Card',    value: user.ghana_card_number || '—' },
              { label: 'Member Since',  value: memberSince },
            ].map(row => (
              <div key={row.label} className="px-6 py-4 flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold w-28 flex-shrink-0">{row.label}</span>
                <span className="text-gray-800 text-sm font-semibold text-right">{row.value}</span>
              </div>
            ))}
            <div className="px-6 py-4">
              <p className="text-gray-400 text-xs">To update your details, contact us on <a href="https://wa.me/233244854206" className="text-amber-600 font-semibold">WhatsApp 0244854206</a>.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onShop, onApply }) => {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [prevIdx, setPrevIdx] = useState(null)

  useEffect(() => {
    const id = setInterval(() => {
      const next = (active + 1) % HERO_IMAGES.length
      setPrevIdx(active); setFading(true)
      setTimeout(() => { setActive(next); setPrevIdx(null); setFading(false) }, 500)
    }, 4500)
    return () => clearInterval(id)
  }, [active])

  const goTo = (i) => {
    if (i === active) return
    setPrevIdx(active); setFading(true)
    setTimeout(() => { setActive(i); setPrevIdx(null); setFading(false) }, 500)
  }

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row gap-4">

        {/* LEFT — static message panel */}
        <div className="w-full md:w-[44%] flex-shrink-0 bg-white border border-gray-200 rounded-2xl px-8 py-10 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-6 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              🇬🇭 Open to Govt Workers in Ghana
            </div>

            <div className="flex items-center gap-3 mb-5">
              <LogoMark size={52} />
              <div>
                <p className="text-gray-800 font-black text-xl leading-none">List <span className="text-amber-500">"J"</span></p>
                <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Grocery Shop</p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2" style={{ fontFamily: 'Georgia,serif' }}>
              Feast in <span className="text-amber-500">Comfort.</span>
            </h1>
            <p className="text-gray-500 text-base italic mb-4" style={{ fontFamily: 'Georgia,serif' }}>Super 3 Months Plan</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-sm">
              Buy your groceries in bulk and pay over <span className="text-gray-800 font-semibold">1–3 months</span>.
              No interest, no stress. Pick from our packages or build your own.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mb-7">
              {['📅 Pay in 3 months', '🚚 Bulk delivery', '🏛️ Govt workers', '📞 WhatsApp us'].map(t => (
                <span key={t} className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">{t}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onShop}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-7 py-3.5 rounded-xl active:scale-95 transition-all shadow-sm">
                🛒 Build Your Package
              </button>
              <a href="#packages"
                className="border border-gray-300 text-gray-700 font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-all text-center">
                View Fixed Plans
              </a>
            </div>

            <p className="mt-5 text-gray-400 text-xs">
              Questions? <a href="https://wa.me/233244854206" className="text-amber-600 hover:underline font-semibold">WhatsApp 0244854206</a>
            </p>
          </div>
        </div>

        {/* RIGHT — image slider */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-200" style={{ minHeight: '360px' }}>
          {prevIdx !== null && (
            <img key={`p${prevIdx}`} src={HERO_IMAGES[prevIdx].src} alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.5s', zIndex: 1 }} />
          )}
          <img key={`a${active}`} src={HERO_IMAGES[active].src} alt={HERO_IMAGES[active].alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.5s', zIndex: 2 }} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === active ? '24px' : '8px', height: '8px', background: i === active ? '#fbbf24' : 'rgba(255,255,255,0.6)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
const TrustBar = () => (
  <section className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {TRUST.map(t => (
        <div key={t.title} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{t.icon}</div>
          <div>
            <p className="text-gray-800 font-bold text-sm">{t.title}</p>
            <p className="text-gray-400 text-xs">{t.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)

// ─── CATEGORY BANNER DATA ────────────────────────────────────────────────────
// Each category gets a background colour + up to 3 product images to display.
// As you add real images to public/images/, slot them in here.
const CAT_BANNERS = {
  rice:       { bg: 'bg-amber-50',   border: 'border-amber-100',  title: 'text-amber-800',  imgs: ['/images/royal25.webp', '/images/Oba-Spagetti-405x330.jpg'] },
  oil:        { bg: 'bg-yellow-50',  border: 'border-yellow-100', title: 'text-yellow-800', imgs: ['/images/Sunflower-Oil-1L.png', '/images/Sunflower-Oil-5L.jpeg'] },
  canned:     { bg: 'bg-red-50',     border: 'border-red-100',    title: 'text-red-800',    imgs: ['/images/African-Queen-420g.jpeg', '/images/Hondi.jpg'] },
  provisions: { bg: 'bg-purple-50',  border: 'border-purple-100', title: 'text-purple-800', imgs: ['/images/Milo-Antigen-E-400g-405x330.jpg', '/images/cornflakes.jpg'] },
  frozen:     { bg: 'bg-sky-50',     border: 'border-sky-100',    title: 'text-sky-800',    imgs: ['/images/Chicken-thigh.jpeg', '/images/drumstick.jpeg'] },
  cleaning:   { bg: 'bg-blue-50',    border: 'border-blue-100',   title: 'text-blue-800',   imgs: ['/images/power-zone-405x330.jpg', '/images/Madar-Soap-Large-Size-405x330.png'] },
  fresh:      { bg: 'bg-lime-50',    border: 'border-lime-100',   title: 'text-lime-800',   imgs: ['/images/Basket-tomatoes.png', '/images/Basket-Onions.jpg'] },
}

// ─── CATEGORY TILES ───────────────────────────────────────────────────────────
const CategoryTiles = ({ onCatClick }) => (
  <section className="bg-white py-6 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto">
      <SectionTitle label="Shop by Department" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const banner = CAT_BANNERS[cat.id] || { bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-800', imgs: [] }
          const imgs = banner.imgs
          return (
            <button
              key={cat.id}
              onClick={() => onCatClick(cat.id)}
              className={`group relative overflow-hidden rounded-xl border ${banner.border} ${banner.bg} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left`}
              style={{ height: '130px' }}
            >
              {/* Product image collage */}
              {imgs.length === 1 && (
                <img
                  src={imgs[0]} alt={cat.label}
                  className="absolute right-0 bottom-0 h-full w-2/3 object-cover object-left opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)' }}
                />
              )}
              {imgs.length >= 2 && (
                <div className="absolute right-0 bottom-0 h-full w-3/5 flex gap-1 p-1">
                  {imgs.slice(0, 2).map((src, i) => (
                    <img key={i} src={src} alt=""
                      className="flex-1 h-full object-contain object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                  ))}
                </div>
              )}

              {/* Text label — always on top left */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                <p className={`text-xs font-black leading-snug ${banner.title} max-w-[55%]`}>{cat.label}</p>
                <p className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Shop now →</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  </section>
)

// ─── SECTION TITLE helper ─────────────────────────────────────────────────────
const SectionTitle = ({ label, onSeeAll }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
      <h2 className="text-base font-black text-gray-800">{label}</h2>
    </div>
    {onSeeAll && (
      <button onClick={onSeeAll} className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 hover:underline">
        See all
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    )}
  </div>
)

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
const ProductDetail = ({ product, qty, onAdd, onRemove, onBack, onViewProduct, cartCount, onCartOpen, onDeptClick }) => {
  const [localQty, setLocalQty] = useState(1)
  const [added, setAdded] = useState(false)
  const cat = CATEGORIES.find(c => c.id === product.cat)
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 6)

  const handleAddToCart = () => {
    for (let i = 0; i < localQty; i++) onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Full Navbar — so cart count stays visible */}
      <Navbar
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onApply={onBack}
        onDeptClick={(catId) => { onBack(); setTimeout(() => onDeptClick(catId), 100) }}
      />

      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <span className="text-gray-300">|</span>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">Home</button>
            <span>/</span>
            <button
              onClick={() => { onBack(); setTimeout(() => onDeptClick(product.cat), 150) }}
              className="text-amber-600 hover:text-amber-700 hover:underline font-semibold transition-colors">
              {cat?.label}
            </button>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main product section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">

            {/* LEFT — product image */}
            <div className="w-full md:w-[420px] flex-shrink-0 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex items-center justify-center p-10" style={{ minHeight: '380px' }}>
              {product.img
                ? <img src={product.img} alt={product.name} className="max-h-72 w-full object-contain drop-shadow-sm" />
                : <span className="text-[120px] select-none leading-none">{product.emoji}</span>
              }
            </div>

            {/* RIGHT — product info */}
            <div className="flex-1 p-8 flex flex-col">
              {/* Category badge */}
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full mb-3 w-fit">
                {cat?.label}
              </span>

              {/* Name */}
              <h1 className="text-2xl font-black text-gray-900 leading-tight mb-3">{product.name}</h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-xs">(Available in stock)</span>
              </div>

              {/* Price block */}
              <div className="flex items-baseline gap-3 mb-1">
                {product.price !== null && product.price !== undefined
                  ? <span className="text-3xl font-black text-gray-900">{fmt(product.price)}</span>
                  : <span className="text-2xl font-black text-lime-700">Price on Request</span>
                }
              </div>
              <p className="text-gray-400 text-xs mb-6">Per <span className="font-semibold text-gray-600">{product.unit}</span></p>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3 mb-4">
                {product.price === null || product.price === undefined ? (
                  <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20enquire%20about%20the%20price%20for%20a%20basket%20of%20vegetables."
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 h-11 rounded-xl font-black text-sm bg-lime-100 hover:bg-lime-200 text-lime-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    💬 WhatsApp to Request Price
                  </a>
                ) : !added ? (
                  <>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setLocalQty(q => Math.max(1, q - 1))}
                        className="w-10 h-11 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black text-lg flex items-center justify-center transition-colors">
                        −
                      </button>
                      <span className="w-12 text-center font-black text-base text-gray-800 border-x border-gray-200 h-11 flex items-center justify-center">
                        {localQty}
                      </span>
                      <button
                        onClick={() => setLocalQty(q => q + 1)}
                        className="w-10 h-11 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black text-lg flex items-center justify-center transition-colors">
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-11 rounded-xl font-black text-sm bg-amber-400 hover:bg-amber-500 text-gray-900 transition-all active:scale-95">
                      Add {localQty > 1 ? `(${localQty}) ` : ''}to Cart
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onCartOpen}
                    className="w-full h-11 rounded-xl font-black text-sm bg-gray-800 hover:bg-gray-900 text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    View Cart
                  </button>
                )}
              </div>

              {/* Product meta */}
              <div className="border-t border-gray-100 pt-5 space-y-2.5">
                {[
                  { label: 'Category',    value: cat?.label },
                  { label: 'Unit',        value: product.unit },
                  { label: 'SKU',         value: `LJ-${String(product.id).padStart(4,'0')}` },
                  { label: 'Availability',value: 'In Stock' },
                  { label: 'Payment',     value: '3-Month Hire Purchase Plan' },
                ].map(row => (
                  <div key={row.label} className="flex gap-3 text-sm">
                    <span className="text-gray-400 w-24 flex-shrink-0">{row.label}:</span>
                    <span className="text-gray-700 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
              <h2 className="text-base font-black text-gray-800">More from {cat?.label}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {related.map(p => (
                <ProductCard key={p.id} product={p}
                  qty={0}
                  onAdd={() => {}}
                  onRemove={() => {}}
                  onView={() => onViewProduct(p)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, qty, onAdd, onRemove, onView }) => {
  const [added, setAdded] = useState(false)
  const hasPrice = product.price !== null && product.price !== undefined
  const pct = hasPrice ? disc(product.price, product.oldPrice) : 0

  const handleAdd = (e) => {
    e.stopPropagation()
    onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div
      onClick={() => onView && onView(product)}
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image / Emoji */}
      <div className="relative bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden" style={{ height: '130px' }}>
        {product.img
          ? <img src={product.img} alt={product.name} className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300" />
          : <span className="text-5xl group-hover:scale-110 transition-transform duration-200 select-none">{product.emoji}</span>
        }
        {/* Only show discount badge if product has a price */}
        {hasPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">-{pct}%</span>
        )}
        {product.tag && (
          <span className={`absolute bottom-2 right-2 bg-white border text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${product.tag === 'Seasonal' ? 'border-lime-300 text-lime-700' : 'border-gray-200 text-gray-600'}`}>{product.tag}</span>
        )}
        {qty > 0 && (
          <span className="absolute top-2 right-2 bg-amber-400 text-gray-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">{qty}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-gray-800 text-xs font-semibold line-clamp-2 leading-snug mb-1">{product.name}</p>
        <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide mb-auto">{product.unit}</p>

        {hasPrice ? (
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-gray-900 font-black text-sm">{fmt(product.price)}</span>
            <span className="text-gray-300 text-[10px] line-through">{fmt(product.oldPrice)}</span>
          </div>
        ) : (
          <p className="text-lime-700 font-black text-xs mt-2">Price on Request</p>
        )}

        {/* WhatsApp CTA for price-on-request items, Add to cart for priced items */}
        {!hasPrice ? (
          <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20enquire%20about%20the%20price%20for%20a%20basket%20of%20vegetables."
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mt-2 w-full py-1.5 rounded-lg text-xs font-bold bg-lime-100 hover:bg-lime-200 text-lime-800 text-center transition-all active:scale-95 block">
            💬 Request Price
          </a>
        ) : qty === 0 ? (
          <button onClick={handleAdd}
            className={`mt-2 w-full py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${added ? 'bg-gray-800 text-white' : 'bg-amber-400 hover:bg-amber-500 text-gray-900'}`}>
            {added ? '✓ Added' : '+ Add'}
          </button>
        ) : (
          <div className="mt-2 flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={handleRemove} className="flex-1 h-7 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-black text-base active:scale-90 transition-all">−</button>
            <span className="w-8 text-center font-black text-sm text-gray-800 border-x border-gray-200">{qty}</span>
            <button onClick={handleAdd} className="flex-1 h-7 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 font-black text-base active:scale-90 transition-all">+</button>
          </div>
        )}
      </div>
    </div>
  )
}


// ─── PRODUCT ROW (one per category on homepage) ───────────────────────────────
const ProductRow = ({ catId, cart, onAdd, onRemove, onSeeAll, onView }) => {
  const cat = CATEGORIES.find(c => c.id === catId)
  const items = PRODUCTS.filter(p => p.cat === catId).slice(0, 6)
  if (!cat || items.length === 0) return null

  return (
    <section className="bg-white py-7 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <SectionTitle label={cat.label} onSeeAll={() => onSeeAll(catId)} />
        <p className="text-gray-400 text-xs mb-4 -mt-3">{cat.description}</p>

        {/* Rice custom request notice */}
        {catId === 'rice' && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <span className="text-xl flex-shrink-0 mt-0.5">🌾</span>
            <p className="text-amber-800 text-xs leading-relaxed">
              <span className="font-black">Don't see your preferred rice brand?</span> We can source and deliver any rice brand on request.{' '}
              <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20request%20a%20specific%20rice%20brand."
                className="underline font-bold hover:text-amber-900 transition-colors" target="_blank" rel="noopener noreferrer">
                WhatsApp us to request →
              </a>
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {items.map(p => (
            <ProductCard key={p.id} product={p}
              qty={cart[p.id] || 0}
              onAdd={() => onAdd(p.id)}
              onRemove={() => onRemove(p.id)}
              onView={onView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURED GRID (3 rows of mixed products — GH Basket style) ───────────────
// Pick 2 products from each category, shuffle them into a single flat grid.
// 3 rows × 6 columns = 18 cards on desktop, 3 rows × 2 cols = 18 on mobile.
const FEATURED_IDS = [
  // Rice
  101, 109, 112, 113, 114, 115,
  // Oil, Canned, Spaghetti
  201, 202, 401, 402, 403, 301,
  // Canned, Frozen & Vegetables
  404, 405, 601, 602, 1001, 1002,
]

const FeaturedGrid = ({ cart, onAdd, onRemove, onShop, onView }) => {
  const featured = FEATURED_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)
  return (
    <section className="bg-white py-7 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
            <h2 className="text-base font-black text-gray-800">Featured Products</h2>
          </div>
          <button onClick={onShop}
            className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 hover:underline">
            View all products
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <p className="text-gray-400 text-xs mb-5">A mix of our most popular items across all departments</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {featured.map(p => (
            <ProductCard key={p.id} product={p}
              qty={cart[p.id] || 0}
              onAdd={() => onAdd(p.id)}
              onRemove={() => onRemove(p.id)}
              onView={onView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROMO STRIP ──────────────────────────────────────────────────────────────
const PromoStrip = ({ onApply, onShop }) => (
  <section className="bg-gray-50 py-6 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { bg: 'bg-gray-800', textColor: 'text-white', sub: 'text-gray-400', icon: '🛒', title: 'Build Your Own Package', sub2: 'Choose exactly what you need', action: onShop },
        { bg: 'bg-amber-400', textColor: 'text-gray-900', sub: 'text-gray-700', icon: '📋', title: 'Apply in Minutes', sub2: 'Quick form — fast approval', action: onApply },
        { bg: 'bg-gray-100', textColor: 'text-gray-800', sub: 'text-gray-500', icon: '📅', title: 'Pay Over 3 Months', sub2: 'No interest · No stress', action: null },
      ].map(b => (
        <div key={b.title} onClick={b.action}
          className={`${b.bg} rounded-2xl px-5 py-4 flex items-center gap-4 ${b.action ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : ''} transition-all border border-transparent hover:border-gray-200`}>
          <span className="text-3xl">{b.icon}</span>
          <div>
            <p className={`font-black text-sm ${b.textColor}`}>{b.title}</p>
            <p className={`text-xs ${b.sub}`}>{b.sub2}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)

// ─── PACKAGE DETAIL PAGE ──────────────────────────────────────────────────────
const PackageDetail = ({ pkg, onBack, onApply, idx }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const totalItems = pkg.items.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <span className="text-gray-300">|</span>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">Home</button>
            <span>/</span>
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">Packages</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">{pkg.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${pkg.popular ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {pkg.tag}
              </span>
              {pkg.popular && (
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-400 text-gray-900">
                  Most Popular
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">{pkg.name}</h1>
            <p className="text-gray-500 text-sm">{pkg.tagline}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-black text-gray-900">{pkg.price}</p>
            <p className="text-gray-400 text-sm mt-0.5">≈ {pkg.monthly} over 3 months</p>
            <p className="text-gray-400 text-xs mt-0.5">{totalItems} items included</p>
          </div>
        </div>

        {/* 3-month callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-4">
          <span className="text-2xl flex-shrink-0">📅</span>
          <div>
            <p className="text-amber-800 font-black text-sm">Pay comfortably over 3 months</p>
            <p className="text-amber-700 text-xs mt-0.5">
              No interest · Open to all Ghana govt workers · Ghana Card & Mandate Number required
            </p>
          </div>
        </div>

        {/* Rice options callout */}
        {pkg.riceOptions && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-4">
            <span className="text-2xl flex-shrink-0">🌾</span>
            <div>
              <p className="text-green-800 font-black text-sm">Rice Options</p>
              <p className="text-green-700 text-xs mt-0.5 font-semibold">{pkg.riceOptions}</p>
              <p className="text-green-600 text-xs mt-0.5">WhatsApp us your preferred brand after applying.</p>
            </div>
          </div>
        )}

        {/* Items list */}
        {pkg.id === 'custom' ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center mb-6">
            <p className="text-4xl mb-4">📞</p>
            <h2 className="text-gray-800 font-black text-lg mb-2">Customized Request</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-5">
              Tell us exactly what you need and we'll build a custom package tailored to your household.
            </p>
            <a href="https://wa.me/233244854206"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              💬 WhatsApp 0244854206
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Image</div>
              <div className="col-span-6">Item</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit</div>
            </div>

            {/* Items rows */}
            {pkg.items.map((item, i) => (
              <div key={i}
                className={`grid grid-cols-12 gap-3 items-center px-5 py-4 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                {/* Row number */}
                <div className="col-span-1 text-gray-300 text-sm font-bold">{String(i + 1).padStart(2, '0')}</div>

                {/* Product image / emoji */}
                <div className="col-span-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                    {item.img
                      ? <img src={item.img} alt={item.label} className="w-full h-full object-contain p-1.5" />
                      : <span className="text-2xl">{item.emoji}</span>
                    }
                  </div>
                </div>

                {/* Item name */}
                <div className="col-span-6">
                  <p className="text-gray-800 text-sm font-semibold">{item.label}</p>
                  {item.qty > 1 && (
                    <p className="text-amber-600 text-xs font-bold mt-0.5">× {item.qty} units</p>
                  )}
                </div>

                {/* Qty badge */}
                <div className="col-span-1 flex justify-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${item.qty > 1 ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 text-gray-600'}`}>
                    {item.qty}
                  </span>
                </div>

                {/* Unit type from PRODUCTS */}
                <div className="col-span-2 text-right">
                  {(() => {
                    const p = PRODUCTS.find(pr => pr.id === item.productId)
                    return <span className="text-gray-400 text-xs uppercase tracking-wider">{p?.unit || '—'}</span>
                  })()}
                </div>
              </div>
            ))}

            {/* Total row */}
            <div className="grid grid-cols-12 gap-3 items-center px-5 py-4 bg-gray-800 text-white">
              <div className="col-span-9 font-black text-sm">Total Items in Package</div>
              <div className="col-span-1 flex justify-center">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-black">{totalItems}</span>
              </div>
              <div className="col-span-2 text-right font-black text-sm">{pkg.price}</div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { onApply(pkg.id === 'custom' ? PACKAGE_OPTIONS[5] : PACKAGE_OPTIONS[idx]); onBack() }}
            className={`flex-1 py-4 rounded-2xl font-black text-base transition-all active:scale-95 shadow-sm ${pkg.popular ? 'bg-amber-400 hover:bg-amber-500 text-gray-900' : 'bg-gray-800 hover:bg-gray-900 text-white'}`}>
            {pkg.id === 'custom' ? '💬 WhatsApp Us to Customise' : 'Select This Package & Apply →'}
          </button>
          <button onClick={onBack}
            className="sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
            View Other Packages
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── FIXED PACKAGES ───────────────────────────────────────────────────────────
const FixedPackages = ({ onApplyWithPackage, onViewPackage }) => (
  <section id="packages" className="bg-white py-10 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto">
      <SectionTitle label="Ready-Made Packages" />
      <p className="text-gray-400 text-xs mb-6 -mt-3">Choose a plan that fits your household — click to see full item list.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIXED_PACKAGES.map((pkg, idx) => (
          <div key={pkg.id}
            className={`relative rounded-2xl border overflow-hidden hover:-translate-y-0.5 transition-all duration-200 ${pkg.popular ? 'border-amber-400 shadow-lg shadow-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
            {pkg.popular && <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider z-10">Most Popular</div>}
            <div className={`h-1 w-full ${pkg.popular ? 'bg-amber-400' : 'bg-gray-200'}`} />
            <div className="p-5 bg-white">
              <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 ${pkg.popular ? 'bg-amber-100 text-amber-700' : pkg.id === 'valentine' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>
                {pkg.tag}
              </span>
              <h3 className="text-gray-900 font-black text-base mb-1">{pkg.name}</h3>
              <p className="text-gray-400 text-xs mb-2">{pkg.tagline}</p>
              <p className="text-gray-900 font-black text-xl mb-0.5">{pkg.price}</p>
              <p className="text-gray-400 text-xs mb-2">≈ {pkg.monthly} over 3 months</p>

              {/* Rice options */}
              {pkg.riceOptions && (
                <p className="text-green-700 text-[11px] font-bold mb-4">🌾 Rice: {pkg.riceOptions}</p>
              )}

              {/* Item previews — show first 4 with images/emoji */}
              {pkg.items.length > 0 && (
                <div className="flex items-center gap-1.5 mb-4">
                  {pkg.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" title={item.label}>
                      {item.img
                        ? <img src={item.img} alt={item.label} className="w-full h-full object-contain p-0.5" />
                        : <span className="text-lg">{item.emoji}</span>
                      }
                    </div>
                  ))}
                  {pkg.items.length > 4 && (
                    <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-[10px] font-black">+{pkg.items.length - 4}</span>
                    </div>
                  )}
                  <span className="text-gray-400 text-xs ml-1">{pkg.items.length} items</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                {pkg.id !== 'custom' && (
                  <button
                    onClick={() => onViewPackage(pkg, idx)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                    View Items
                  </button>
                )}
                <button
                  onClick={() => onApplyWithPackage(pkg.id === 'custom' ? PACKAGE_OPTIONS[PACKAGE_OPTIONS.length - 1] : PACKAGE_OPTIONS[idx])}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${pkg.popular ? 'bg-amber-400 hover:bg-amber-500 text-gray-900' : pkg.id === 'valentine' ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {pkg.id === 'custom' ? 'Call 0244854206' : 'Apply →'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── DEPT PACKAGE SECTION (provisions & detergents — full card style) ────────
const DeptPackageSection = ({ packages, accentColor = 'amber', onApply }) => {
  const [viewing, setViewing] = useState(null)

  const accent = {
    amber: { top: 'bg-amber-400', tag: 'bg-amber-100 text-amber-700', price: 'text-gray-900', btn: 'bg-amber-400 hover:bg-amber-500 text-gray-900', border: 'border-gray-200', viewBtn: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
    blue:  { top: 'bg-blue-500',  tag: 'bg-blue-100 text-blue-700',   price: 'text-gray-900', btn: 'bg-blue-600 hover:bg-blue-700 text-white',       border: 'border-gray-200', viewBtn: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
  }[accentColor] || {}

  return (
    <>
      {/* Package cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {packages.map((pkg, idx) => (
          <div key={pkg.id} className={`relative rounded-2xl border overflow-hidden hover:-translate-y-0.5 transition-all duration-200 ${accent.border}`}>
            <div className={`h-1 w-full ${accent.top}`} />
            <div className="p-5 bg-white">
              <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 ${accent.tag}`}>
                Package {idx + 1}
              </span>
              <h3 className="text-gray-900 font-black text-base mb-1">{pkg.name}</h3>
              {pkg.price
                ? <p className={`font-black text-xl mb-0.5 ${accent.price}`}>GH₵{pkg.price}</p>
                : <p className="text-gray-400 text-sm mb-0.5 italic">Price on request</p>
              }
              {pkg.price && <p className="text-gray-400 text-xs mb-4">≈ GH₵{Math.ceil(pkg.price / 3)}/mo over 3 months</p>}

              {/* Item dot previews */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {pkg.items.split(' · ').slice(0, 4).map((item, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.split('(')[0].trim()}</span>
                ))}
                {pkg.items.split(' · ').length > 4 && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">+{pkg.items.split(' · ').length - 4} more</span>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setViewing(pkg)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${accent.viewBtn}`}>
                  View Items
                </button>
                <button onClick={() => onApply && onApply(pkg.name + (pkg.price ? ` (GHC${pkg.price})` : ''))}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${accent.btn}`}>
                  Apply →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Items modal overlay */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`h-1.5 w-full ${accent.top}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full mb-2 ${accent.tag}`}>Package Details</span>
                  <h2 className="text-gray-900 font-black text-xl">{viewing.name}</h2>
                  {viewing.price && <p className="text-gray-500 text-sm mt-0.5">GH₵{viewing.price} · ≈ GH₵{Math.ceil(viewing.price / 3)}/mo</p>}
                </div>
                <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none mt-1">×</button>
              </div>
              <ul className="space-y-2 mb-6">
                {viewing.items.split(' · ').map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${accent.top}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => setViewing(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                  Close
                </button>
                <button onClick={() => { onApply && onApply(viewing.name + (viewing.price ? ` (GHC${viewing.price})` : '')); setViewing(null) }}
                  className={`flex-1 py-3 rounded-xl font-black text-sm transition-all active:scale-95 ${accent.btn}`}>
                  Apply for this →
                </button>
              </div>
              <p className="text-center text-gray-400 text-xs mt-3">
                Requirements: Ghana Card & Mandate Number
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── ROTATING PRODUCT SHOWCASE ────────────────────────────────────────────────
// Picks 3 products from each category, rotates through them every 4s.
// Clicking "Browse all" or a category pill opens the full cart drawer flow.
const SHOWCASE_SIZE = 9   // 3 columns × 3 rows visible at once
const ROTATE_MS    = 4000 // ms between rotations

// Build a pool: 3 products per category, shuffled so rotation feels varied
const buildPool = () => {
  const pool = []
  CATEGORIES.forEach(cat => {
    const catProducts = PRODUCTS.filter(p => p.cat === cat.id)
    // Take up to 3 from each category
    for (let i = 0; i < Math.min(3, catProducts.length); i++) {
      pool.push(catProducts[i])
    }
  })
  return pool
}
const SHOWCASE_POOL = buildPool()

const ShopSection = ({ cart, onAdd, onRemove, onCartOpen, cartTotal, cartCount, onView, defaultCat, onApply }) => {
  const [offset, setOffset]       = useState(0)
  const [visible, setVisible]     = useState(true)
  const [activeCat, setActiveCat] = useState(defaultCat || 'all')
  const pct = Math.min(100, Math.round((cartTotal / MIN_ORDER) * 100))

  // Sync when parent changes department via navbar
  useEffect(() => {
    if (defaultCat) { setActiveCat(defaultCat); setOffset(0); setVisible(true) }
  }, [defaultCat])

  // Filter pool by active category
  const pool = activeCat === 'all'
    ? SHOWCASE_POOL
    : PRODUCTS.filter(p => p.cat === activeCat)

  const total = pool.length
  // Clamp offset when pool shrinks
  const safeOffset = total <= SHOWCASE_SIZE ? 0 : offset % total

  // Auto-rotate — ONLY when showing "All" categories
  useEffect(() => {
    if (activeCat !== 'all') return      // ← static when a department is selected
    if (total <= SHOWCASE_SIZE) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setOffset(o => (o + SHOWCASE_SIZE) % total)
        setVisible(true)
      }, 350)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [total, activeCat])

  // Reset offset when category changes
  useEffect(() => { setOffset(0); setVisible(true) }, [activeCat])

  // Slice window of products to show
  const shown = total === 0 ? [] : Array.from({ length: Math.min(SHOWCASE_SIZE, total) }, (_, i) =>
    pool[(safeOffset + i) % total]
  )

  // Dot indicators — one per page
  const pages = total <= SHOWCASE_SIZE ? 1 : Math.ceil(total / SHOWCASE_SIZE)
  const currentPage = Math.floor(safeOffset / SHOWCASE_SIZE)

  return (
    <section id="shop" className="bg-white py-10 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-1 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
              <h2 className="text-base font-black text-gray-800">Build Your Own Package</h2>
            </div>
            <p className="text-gray-400 text-xs ml-3.5">
              Add items to your cart — pay over 3 months. Items rotate automatically.
            </p>
          </div>

          {/* Cart pill */}
          {cartCount > 0 && (
            <button onClick={onCartOpen}
              className="flex-shrink-0 flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {cartCount} items · {fmt(cartTotal)}
              {pct < 100 && <span className="text-amber-300 font-medium">· {fmt(MIN_ORDER - cartTotal)} to min</span>}
              {pct >= 100 && <span className="text-green-400 font-medium">· ✓ Ready</span>}
            </button>
          )}
        </div>

        {/* Progress bar — only when cart has items */}
        {cartCount > 0 && (
          <div className="ml-3.5 mb-5 mt-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gray-800' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-xs font-bold ${pct >= 100 ? 'text-gray-800' : 'text-amber-600'}`}>
                {pct}% of min order
              </span>
            </div>
          </div>
        )}

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 mt-4">
          <button onClick={() => setActiveCat('all')}
            className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all flex-shrink-0 ${activeCat === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all flex-shrink-0 ${activeCat === cat.id ? 'bg-gray-800 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vegetables seasonal notice */}
        {activeCat === 'fresh' && (
          <div className="flex items-start gap-3 bg-lime-50 border border-lime-200 rounded-xl px-4 py-3 mb-5">
            <span className="text-xl flex-shrink-0 mt-0.5">🌿</span>
            <p className="text-lime-800 text-xs leading-relaxed">
              <span className="font-black">Seasonal availability.</span> Fresh vegetables depend on harvest seasons and may not always be in stock. Prices may also vary with market conditions.{' '}
              <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20check%20on%20vegetable%20availability."
                className="underline font-bold hover:text-lime-900 transition-colors" target="_blank" rel="noopener noreferrer">
                WhatsApp us to confirm availability →
              </a>
            </p>
          </div>
        )}

        {/* Rice custom request notice — shown when rice dept is selected */}
        {activeCat === 'rice' && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <span className="text-xl flex-shrink-0 mt-0.5">🌾</span>
            <p className="text-amber-800 text-xs leading-relaxed">
              <span className="font-black">Don't see your preferred rice brand?</span> We can source and deliver any rice brand on request.{' '}
              <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20request%20a%20specific%20rice%20brand."
                className="underline font-bold hover:text-amber-900 transition-colors" target="_blank" rel="noopener noreferrer">
                WhatsApp us to request →
              </a>
            </p>
          </div>
        )}

        {/* Provisions sub-packages */}
        {activeCat === 'provisions' && (
          <div className="mb-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
              <h3 className="text-sm font-black text-gray-800">Choose a Provisions Package</h3>
            </div>
            <DeptPackageSection packages={PROVISIONS_PACKAGES} accentColor="amber" onApply={onApply} />
          </div>
        )}

        {/* Detergent sub-packages */}
        {activeCat === 'cleaning' && (
          <div className="mb-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1 h-5 bg-blue-400 rounded-full inline-block" />
              <h3 className="text-sm font-black text-gray-800">Choose a Detergent Package</h3>
            </div>
            <DeptPackageSection packages={DETERGENT_PACKAGES} accentColor="blue" onApply={onApply} />
          </div>
        )}

        {/* Rotating 3-column grid — hidden for provisions & cleaning (packages only) */}
        {activeCat === 'provisions' || activeCat === 'cleaning' ? null : shown.length === 0 ? (
          <div className="text-center py-14 px-6">
            <span className="text-5xl block mb-4">🥦</span>
            <h3 className="text-gray-700 font-black text-base mb-2">
              {activeCat === 'fresh' ? 'No Vegetables in Stock Right Now' : 'No products in this category yet'}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              {activeCat === 'fresh'
                ? 'Fresh vegetable stock changes regularly. WhatsApp us to check current availability or place a specific request.'
                : 'Check back soon or WhatsApp us for availability.'
              }
            </p>
            {activeCat === 'fresh' && (
              <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20ask%20about%20vegetable%20availability."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
                💬 Ask about availability
              </a>
            )}
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-3 gap-3 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              {shown.map((p, i) => (
                <ProductCard key={`${p.id}-${i}`} product={p}
                  qty={cart[p.id] || 0}
                  onAdd={() => onAdd(p.id)}
                  onRemove={() => onRemove(p.id)}
                  onView={onView} />
              ))}
            </div>

            {/* Dots + nav */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {/* Prev */}
                <button
                  onClick={() => {
                    setVisible(false)
                    setTimeout(() => {
                      setOffset(o => (o - SHOWCASE_SIZE + total) % total)
                      setVisible(true)
                    }, 300)
                  }}
                  className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button key={i}
                      onClick={() => { setOffset(i * SHOWCASE_SIZE); setVisible(true) }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === currentPage ? '20px' : '6px',
                        height: '6px',
                        background: i === currentPage ? '#1f2937' : '#d1d5db',
                      }} />
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={() => {
                    setVisible(false)
                    setTimeout(() => {
                      setOffset(o => (o + SHOWCASE_SIZE) % total)
                      setVisible(true)
                    }, 300)
                  }}
                  className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Auto-rotate indicator — only for All */}
            {pages > 1 && activeCat === 'all' && (
              <p className="text-center text-gray-300 text-[11px] mt-2">
                Rotating every {ROTATE_MS / 1000}s · {total} products available
              </p>
            )}
            {pages > 1 && activeCat !== 'all' && (
              <p className="text-center text-gray-300 text-[11px] mt-2">
                {total} products · use arrows to browse
              </p>
            )}
          </>
        )}

        {/* View full catalogue CTA — only for depts with individual products */}
        {activeCat !== 'provisions' && activeCat !== 'cleaning' && (
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            Showing {shown.length} of {total} products
            {activeCat !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCat)?.label}`}
          </p>
          <button onClick={onCartOpen}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-6 py-2.5 rounded-xl transition-colors active:scale-95">
            View Cart & Apply →
          </button>
        </div>
        )}

      </div>
    </section>
  )
}

// ─── FULL CART PAGE (GH Basket style) ────────────────────────────────────────
const CartPage = ({ cart, onAdd, onRemove, onClear, onBack, onCheckout, cartCount, onCartOpen, onDeptClick, onShop }) => {
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0)
  const subtotal  = cartItems.reduce((s, [id, q]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id)); return s + (p ? p.price * q : 0)
  }, 0)
  const pct       = Math.min(100, Math.round((subtotal / MIN_ORDER) * 100))
  const remaining = Math.max(0, MIN_ORDER - subtotal)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} onApply={onBack}
        onDeptClick={(catId) => { onBack(); setTimeout(() => onDeptClick(catId), 100) }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <button onClick={onShop} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Continue Shopping
          </button>
          <span className="text-gray-300">|</span>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button onClick={onBack} className="hover:text-gray-700">Home</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">Your Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">
          Your Cart
          {cartCount > 0 && <span className="ml-2 text-base font-normal text-gray-400">({cartCount} items)</span>}
        </h1>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 className="text-gray-700 font-black text-lg mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Add some products to get started on your 3-month package.</p>
            <button onClick={onShop} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-8 py-3 rounded-xl transition-colors active:scale-95">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* LEFT — cart table */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Cart rows */}
                {cartItems.map(([id, qty], rowIdx) => {
                  const p = PRODUCTS.find(pr => pr.id === parseInt(id))
                  if (!p) return null
                  return (
                    <div key={id}
                      className={`flex flex-col md:grid md:grid-cols-12 gap-4 items-center px-6 py-5 border-b border-gray-50 last:border-0 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>

                      {/* Product col */}
                      <div className="col-span-5 flex items-center gap-4 w-full">
                        {/* Remove button */}
                        <button onClick={() => {
                          // Remove all qty of this item
                          const n = { ...cart }; delete n[parseInt(id)]
                          onClear(parseInt(id))
                        }}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                          title="Remove item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                        {/* Image */}
                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.img
                            ? <img src={p.img} alt={p.name} className="w-full h-full object-contain p-1.5"/>
                            : <span className="text-2xl">{p.emoji}</span>}
                        </div>
                        {/* Name + unit */}
                        <div>
                          <p className="text-gray-800 text-sm font-semibold leading-snug">{p.name}</p>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">{p.unit}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="text-gray-700 font-semibold text-sm">{fmt(p.price)}</span>
                      </div>

                      {/* Qty stepper */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => onRemove(p.id)}
                            className="w-8 h-8 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-black text-base flex items-center justify-center transition-colors">
                            −
                          </button>
                          <span className="w-10 text-center font-black text-sm text-gray-800 border-x border-gray-200 h-8 flex items-center justify-center">
                            {qty}
                          </span>
                          <button onClick={() => onAdd(p.id)}
                            className="w-8 h-8 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 font-black text-base flex items-center justify-center transition-colors">
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-right">
                        <span className="text-gray-900 font-black text-sm">{fmt(p.price * qty)}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Table footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => onClear('all')}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
                    Clear cart
                  </button>
                  <button onClick={onShop}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                    ← Continue shopping
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — order summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-[140px]">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-black text-gray-800 text-base">Order Summary</h2>
                </div>

                <div className="px-5 py-4 space-y-3">
                  {/* Min order progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-gray-600">Minimum Order</span>
                      <span className="font-black text-gray-800">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gray-800' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[11px] text-gray-400">
                      <span>{fmt(subtotal)} added</span>
                      {pct < 100
                        ? <span className="text-amber-600 font-semibold">Add {fmt(remaining)} more</span>
                        : <span className="text-gray-800 font-bold">✓ Minimum reached!</span>}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal ({cartCount} items)</span>
                      <span className="font-semibold text-gray-700">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Payment plan</span>
                      <span className="font-semibold text-gray-700">3 months</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Monthly instalment</span>
                      <span className="font-semibold text-gray-700">{fmt(Math.ceil(subtotal / 3))}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-black text-gray-800 text-base">Total</span>
                      <span className="font-black text-gray-900 text-2xl">{fmt(subtotal)}</span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">Pay over 3 months — no interest</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 pt-1 space-y-2">
                  <button
                    onClick={onCheckout}
                    disabled={pct < 100}
                    className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${pct >= 100 ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                    {pct >= 100 ? 'Proceed to Apply →' : `Add ${fmt(remaining)} more to continue`}
                  </button>
                  <button onClick={onShop}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Continue Shopping
                  </button>
                </div>

                {/* Trust badges */}
                <div className="px-5 pb-5 space-y-2 border-t border-gray-100 pt-4">
                  {[
                    { icon: '🏛️', text: 'Open to all Ghana govt workers' },
                    { icon: '📅', text: 'Pay over 1–3 months, no interest' },
                    { icon: '🚚', text: 'Nationwide delivery' },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{b.icon}</span><span>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

// ─── CART DRAWER (quick slide-in) ─────────────────────────────────────────────
const CartDrawer = ({ open, onClose, cart, onAdd, onRemove, onClear, onCheckout, total }) => {
  const pct = Math.min(100, Math.round((total / MIN_ORDER) * 100))
  const remaining = Math.max(0, MIN_ORDER - total)
  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0)

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl border-l border-gray-200 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 className="font-black text-gray-800 text-base">Your Package</h2>
            <span className="text-gray-400 text-xs">({cartItems.length} items)</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-bold text-gray-700">Minimum Order</span>
            <span className="font-black text-gray-800">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gray-800' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[11px] mt-1.5 text-gray-400">
            <span>Cart: <span className="text-gray-700 font-bold">{fmt(total)}</span></span>
            {pct < 100
              ? <span>Add <span className="text-amber-600 font-bold">{fmt(remaining)}</span> more</span>
              : <span className="text-gray-800 font-bold">✓ Minimum reached!</span>}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🛒</span>
              <p className="text-gray-400 text-sm mt-4">Your cart is empty</p>
            </div>
          ) : cartItems.map(([id, qty]) => {
            const p = PRODUCTS.find(pr => pr.id === parseInt(id))
            if (!p) return null
            return (
              <div key={id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-contain p-1" />
                         : <span className="text-xl">{p.emoji}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-gray-500 text-xs">{fmt(p.price)} × {qty} = <span className="font-bold text-gray-800">{fmt(p.price * qty)}</span></p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <button onClick={() => onRemove(p.id)} className="w-6 h-6 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-black text-sm flex items-center justify-center active:scale-90 transition-all">−</button>
                  <span className="w-6 text-center font-black text-xs text-gray-800 border-x border-gray-200">{qty}</span>
                  <button onClick={() => onAdd(p.id)} className="w-6 h-6 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 font-black text-sm flex items-center justify-center active:scale-90 transition-all">+</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-gray-900 font-black text-xl">{fmt(total)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Monthly (÷3)</span>
            <span className="font-semibold text-gray-600">{fmt(Math.ceil(total / 3))}/mo</span>
          </div>
          <button onClick={onCheckout} disabled={pct < 100}
            className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${pct >= 100 ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
            {pct >= 100 ? 'Proceed to Apply →' : `Add ${fmt(remaining)} more to continue`}
          </button>
          {cartItems.length > 0 && (
            <button onClick={onClear} className="w-full py-2 text-gray-300 hover:text-red-400 text-xs transition-colors">Clear cart</button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── APPLY FORM ───────────────────────────────────────────────────────────────
const Field = ({ label, name, type = 'text', placeholder, value, onChange, required, note }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="bg-white border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-gray-800 placeholder-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
    {note && <p className="text-gray-400 text-[11px]">{note}</p>}
  </div>
)

const ApplySection = ({ prefilledPackage, cartTotal, cartItems }) => {
  const hasCustomCart = cartItems.length > 0 && cartTotal >= MIN_ORDER
  // A "dept package" is any prefilled value that is NOT in the standard PACKAGE_OPTIONS list
  // (e.g. "Ma Wo Ho Nte (GHC270)" or "Maakye")
  const isDeptPackage = prefilledPackage && !PACKAGE_OPTIONS.includes(prefilledPackage)
  const isMainPackage = prefilledPackage && PACKAGE_OPTIONS.includes(prefilledPackage)

  const [form, setForm] = useState({
    fullName:'', institution:'', phone:'', email:'',
    staffNumber:'', mandateNumber:'', otpPin:'', ghanaCardNumber:'',
    package: isMainPackage ? prefilledPackage : ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (prefilledPackage && PACKAGE_OPTIONS.includes(prefilledPackage)) {
      setForm(f => ({ ...f, package: prefilledPackage }))
    }
  }, [prefilledPackage])

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const cartSummary = cartItems.map(([id, qty]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id))
    return p ? `${p.name} ×${qty}` : ''
  }).filter(Boolean).join(', ')

  const onSubmit = async e => {
    e.preventDefault(); setSubmitting(true)
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdnxE_Diy4XQSVR5T52pQKc6FkzNwurabT2qo_cturDZO-WMg/viewform', '_blank')
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 800)
  }

  if (submitted) {
    return (
      <section id="apply" className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 className="text-gray-900 font-black text-xl mb-2">Application Submitted!</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Complete the form that opened, then WhatsApp us to confirm.</p>
          <a href="https://wa.me/233244854206"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Follow up on WhatsApp
          </a>
          <button onClick={() => setSubmitted(false)} className="block mx-auto mt-4 text-gray-300 text-xs hover:text-gray-500">Submit another</button>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="bg-white py-12 px-4 border-b border-gray-100">
      <div className="max-w-3xl mx-auto">
        <SectionTitle label="Apply Now" />
        <p className="text-gray-400 text-xs mb-6 -mt-3">Fill in your details — our team will process your application.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">

          {/* Custom cart summary */}
          {hasCustomCart && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 font-black text-sm mb-1">🛒 Your Custom Package</p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{cartSummary}</p>
                <p className="text-gray-900 font-black text-lg mt-2">{fmt(cartTotal)} <span className="text-gray-400 text-xs font-normal">≈ {fmt(Math.ceil(cartTotal/3))}/mo</span></p>
              </div>
              <span className="text-gray-600 text-xs font-bold bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg flex-shrink-0">✓ Ready</span>
            </div>
          )}

          {/* Dept package (provisions / detergents) selected banner */}
          {isDeptPackage && !hasCustomCart && (
            <div className="mb-6 bg-white border border-amber-200 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-amber-700 font-black text-xs uppercase tracking-wider mb-1">Selected Package</p>
                <p className="text-gray-900 font-black text-base">{prefilledPackage}</p>
                <p className="text-gray-400 text-xs mt-1">Our team will confirm the full details with you after submission.</p>
              </div>
              <span className="text-amber-700 text-xs font-bold bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg flex-shrink-0">✓ Selected</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name (as on Ghana Card)" name="fullName" value={form.fullName} onChange={onChange} placeholder="e.g. Kwame Asante" required />
            <Field label="Institution / Profession" name="institution" value={form.institution} onChange={onChange} placeholder="e.g. Ghana Health Service" required />
            <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="0244000000" required />
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={onChange} placeholder="kwame@email.com" required />
            <Field label="Staff Number / ID" name="staffNumber" value={form.staffNumber} onChange={onChange} placeholder="Your staff ID" required />
            <Field label="Mandate Number" name="mandateNumber" value={form.mandateNumber} onChange={onChange} placeholder="Your mandate number" required />
            <Field label="OTP PIN (for Mandate)" name="otpPin" value={form.otpPin} onChange={onChange} placeholder="OTP received" required />
            <Field label="Ghana Card Number" name="ghanaCardNumber" value={form.ghanaCardNumber} onChange={onChange} placeholder="GHA-000000000-0" required note="Send Ghana Card photo via WhatsApp to 0244854206" />

            {/* Package selector — show dropdown when no cart, no dept package, no main package pre-selected */}
            {!hasCustomCart && !isDeptPackage && (
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Package <span className="text-red-400">*</span>
                </label>
                {isMainPackage ? (
                  /* Main fixed package pre-selected — show locked display */
                  <div className="bg-white border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-800 text-sm font-semibold">{prefilledPackage}</span>
                    <span className="text-amber-700 text-xs font-bold bg-amber-100 px-2 py-0.5 rounded-full">Pre-selected</span>
                  </div>
                ) : (
                  /* No package selected yet — show full dropdown */
                  <select name="package" value={form.package} onChange={onChange} required
                    className="bg-white border border-gray-200 focus:border-amber-400 text-gray-800 rounded-xl px-4 py-3 text-sm outline-none transition-all">
                    <option value="" disabled>— Select a package —</option>
                    {PACKAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            )}

            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-400 text-xs leading-relaxed">By submitting you confirm all details are accurate. LIST "J" Grocery Shop verifies your employment and mandate number before processing your request.</p>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={submitting}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black text-sm py-4 rounded-2xl active:scale-95 transition-all shadow-sm disabled:opacity-50">
                {submitting ? 'Opening Form...' : 'Submit Application →'}
              </button>
              <p className="text-center text-gray-300 text-xs mt-3">
                Complete the Google Form that opens, then WhatsApp <a href="https://wa.me/233244854206" className="text-amber-500 hover:underline">0244854206</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── CLIENT MESSAGING WIDGET ─────────────────────────────────────────────────
const ClientMessaging = () => {
  const [open, setOpen]         = useState(false)
  const [step, setStep]         = useState('start')
  const [form, setForm]         = useState({ name: '', phone: '' })
  const [input, setInput]       = useState('')
  const [convId, setConvId]     = useState(null)
  const [messages, setMessages] = useState([])
  const [unread, setUnread]     = useState(0)
  const msgEnd  = useRef(null)
  const panelRef = useRef(null)

  // Load existing conversation
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lj_client_conv')
      if (saved) {
        const c = JSON.parse(saved)
        setConvId(c.id); setForm({ name: c.clientName, phone: c.clientPhone })
        setMessages(c.messages || []); setStep('chat')
        setUnread((c.messages || []).filter(m => m.from === 'admin' && !m.read).length)
      }
    } catch {}
  }, [])

  // Scroll to bottom
  useEffect(() => {
    if (open) setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [messages, open])

  // Mark read on open
  useEffect(() => {
    if (open && step === 'chat' && messages.some(m => m.from === 'admin' && !m.read)) {
      const updated = messages.map(m => ({ ...m, read: true }))
      setMessages(updated); setUnread(0)
      const saved = JSON.parse(localStorage.getItem('lj_client_conv') || '{}')
      localStorage.setItem('lj_client_conv', JSON.stringify({ ...saved, messages: updated }))
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open])

  const startConversation = () => {
    if (!form.name.trim() || !form.phone.trim()) return
    const newConv = {
      id: Date.now(), clientName: form.name.trim(), clientPhone: form.phone.trim(),
      package: '', lastUpdated: new Date().toISOString(), unread: 0,
      messages: [{ from: 'admin', text: `Hello ${form.name.split(' ')[0]}! Welcome to List "J" Grocery Shop. How can we help you today?`, time: new Date().toISOString(), read: false }]
    }
    localStorage.setItem('lj_client_conv', JSON.stringify(newConv))
    try {
      const adminConvs = JSON.parse(localStorage.getItem('lj_conversations') || '[]')
      localStorage.setItem('lj_conversations', JSON.stringify([newConv, ...adminConvs]))
    } catch {}
    setConvId(newConv.id); setMessages(newConv.messages); setStep('chat')
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = { from: 'client', text: input.trim(), time: new Date().toISOString() }
    const updated = [...messages, newMsg]
    setMessages(updated); setInput('')
    const saved = JSON.parse(localStorage.getItem('lj_client_conv') || '{}')
    const updatedConv = { ...saved, messages: updated, lastUpdated: new Date().toISOString() }
    localStorage.setItem('lj_client_conv', JSON.stringify(updatedConv))
    try {
      const adminConvs = JSON.parse(localStorage.getItem('lj_conversations') || '[]')
      const idx = adminConvs.findIndex(c => c.id === convId)
      if (idx >= 0) { adminConvs[idx] = { ...adminConvs[idx], messages: updated, lastUpdated: new Date().toISOString(), unread: (adminConvs[idx].unread || 0) + 1 }; localStorage.setItem('lj_conversations', JSON.stringify(adminConvs)) }
    } catch {}
  }

  return (
    <div ref={panelRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">

      {/* Chat panel */}
      <div className={`w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-left ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>

        {/* Header */}
        <div className="bg-gray-900 px-5 py-4 flex items-center gap-3">
          <LogoMark size={32} />
          <div className="flex-1">
            <p className="text-white font-black text-sm">List "J" Support</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <p className="text-gray-400 text-xs">We usually reply within a few hours</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Start */}
        {step === 'start' && (
          <div className="px-5 py-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <p className="text-gray-900 font-black text-sm mb-1">Chat with us</p>
            <p className="text-gray-400 text-xs mb-5 leading-relaxed">Ask about your order, application status, or any questions. We'll respond here.</p>
            <button onClick={() => setStep('form')}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black text-sm py-3 rounded-xl transition-all active:scale-95 mb-2.5">
              Start a Conversation
            </button>
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-300 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I%27m%20interested%20in%20your%20grocery%20plan."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-all">
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-green-500">
                <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm6.29 20.888c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z"/>
              </svg>
              WhatsApp instead
            </a>
          </div>
        )}

        {/* Form */}
        {step === 'form' && (
          <div className="px-5 py-5">
            <p className="text-gray-700 font-black text-sm mb-4">Before we start, tell us who you are.</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Your Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kwame Asante"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Phone Number</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0244000000" type="tel"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
              </div>
            </div>
            <button onClick={startConversation} disabled={!form.name.trim() || !form.phone.trim()}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-sm py-3 rounded-xl transition-all active:scale-95">
              Continue
            </button>
            <button onClick={() => setStep('start')} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Back</button>
          </div>
        )}

        {/* Chat */}
        {step === 'chat' && (
          <>
            <div className="h-64 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => {
                const isAdmin = msg.from === 'admin'
                const time = new Date(msg.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={i} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] flex flex-col gap-1 ${isAdmin ? 'items-start' : 'items-end'}`}>
                      {isAdmin && <p className="text-gray-400 text-[10px] px-1">List "J"</p>}
                      <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${isAdmin ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm' : 'bg-gray-900 text-white rounded-tr-sm'}`}>
                        {msg.text}
                      </div>
                      <p className="text-gray-300 text-[10px] px-1">{time}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={msgEnd} />
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex gap-2 items-end mb-2">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  className="flex-1 bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white text-gray-800 placeholder-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all resize-none" />
                <button onClick={sendMessage} disabled={!input.trim()}
                  className="w-9 h-9 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
              <a href="https://wa.me/233244854206" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
                <svg viewBox="0 0 32 32" className="w-3 h-3 fill-green-400">
                  <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm6.29 20.888c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z"/>
                </svg>
                Prefer WhatsApp? Chat on 0244854206
              </a>
            </div>
          </>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => { setOpen(o => !o); setUnread(0) }}
        className="w-14 h-14 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all relative self-start">
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-gray-900 text-[10px] font-black rounded-full flex items-center justify-center">{unread}</span>
            )}
          </>
        )}
      </button>
    </div>
  )
}

// ─── WHATSAPP BUTTON ──────────────────────────────────────────────────────────
const WhatsAppFloat = () => {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShow(false), 4000); return () => clearTimeout(t) }, [])
  return (
    <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'm%20interested%20in%20the%203-month%20grocery%20plan."
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group" aria-label="WhatsApp">
      <div className={`bg-white text-gray-700 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} group-hover:opacity-100`}>
        Chat with us 💬
      </div>
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1eb85a] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm0 25.471a11.433 11.433 0 0 1-5.833-1.597l-.418-.248-4.332 1.042 1.075-4.217-.273-.433A11.432 11.432 0 0 1 4.53 16c0-6.33 5.142-11.471 11.471-11.471S27.471 9.67 27.471 16c0 6.33-5.142 11.471-11.47 11.471zm6.29-8.583c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z"/>
        </svg>
      </div>
    </a>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-gray-900 text-gray-400">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4"><LogoMark size={34} />
          <div>
            <p className="font-black text-white text-sm">List "J" Grocery</p>
            <p className="text-gray-600 text-[11px]">Hire Purchase · Crediting</p>
          </div>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">Ghana's trusted grocery hire-purchase service for all government workers.</p>
        <div className="flex gap-2">{['📘','🐦','📸'].map((s,i) => (
          <button key={i} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors text-sm">{s}</button>
        ))}</div>
      </div>
      {[
        { title: 'Quick Links', links: ['Home','Fixed Packages','Build Your Own','Apply Now','Track Order'] },
        { title: 'Categories',  links: ['Rice & Grains','Cooking Oils','Canned & Tins','Frozen Foods','Detergents','Foodstuffs'] },
        { title: 'Support',     links: ['Contact Us','FAQs','Return Policy','Privacy Policy','Terms of Service'] },
      ].map(col => (
        <div key={col.title}>
          <h4 className="font-bold text-white mb-4 text-sm">{col.title}</h4>
          <ul className="space-y-2">{col.links.map(l => (
            <li key={l}><a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">{l}</a></li>
          ))}</ul>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-800 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
      <p className="text-gray-600 text-xs">© 2025 List J Grocery Shop · All rights reserved.</p>
      <div className="flex items-center gap-2 text-xs">
        {['Mandate 📋','Ghana Card 🪪','3 Months 📅'].map(m => (
          <span key={m} className="bg-gray-800 text-gray-400 px-2 py-1 rounded font-medium">{m}</span>
        ))}
      </div>
    </div>
  </footer>
)

// ─── ADMIN PIN ────────────────────────────────────────────────────────────────
const ADMIN_PIN = '2580'  // ← change this to your preferred PIN

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
const AdminLogin = ({ onSuccess, onBack }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = (value) => {
    if (value.length < 4) return
    if (value === ADMIN_PIN) {
      sessionStorage.setItem('lj_admin', '1')
      onSuccess()
    } else {
      setShake(true); setError(true)
      setTimeout(() => { setShake(false); setPin(''); setError(false) }, 900)
    }
  }

  const press = (d) => {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    if (next.length === 4) setTimeout(() => attempt(next), 150)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-8 py-8 text-center">
          <LogoMark size={44} />
          <p className="text-white font-black text-lg mt-3">Admin Portal</p>
          <p className="text-gray-400 text-xs mt-1 tracking-wide">List "J" Grocery Shop</p>
        </div>

        <div className="px-8 py-8">
          <p className="text-gray-600 text-sm text-center mb-6 font-medium">Enter your 4-digit PIN</p>

          {/* PIN dots */}
          <div className={`flex justify-center gap-4 mb-8 ${shake ? 'animate-bounce' : ''}`}>
            {[0,1,2,3].map(i => (
              <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                pin.length > i
                  ? error ? 'bg-red-400 border-red-400' : 'bg-amber-400 border-amber-400'
                  : 'border-gray-300 bg-white'
              }`} />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[1,2,3,4,5,6,7,8,9,'',0,'del'].map((d, i) => (
              <button key={i}
                onClick={() => d === 'del' ? setPin(p => p.slice(0,-1)) : d !== '' ? press(String(d)) : null}
                className={`h-12 rounded-xl font-black text-base transition-all active:scale-95 ${
                  d === '' ? 'invisible' :
                  d === 'del'
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 text-sm font-semibold'
                    : 'bg-gray-100 text-gray-800 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-gray-200'
                }`}>
                {d === 'del' ? (
                  <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"/>
                  </svg>
                ) : d}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-center text-xs font-semibold mb-3">Incorrect PIN. Try again.</p>
          )}

          <button onClick={onBack}
            className="w-full py-2.5 text-gray-400 hover:text-gray-600 text-xs transition-colors border-t border-gray-100 mt-2 pt-4">
            Back to Store
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = ({ onExit }) => {
  const [tab, setTab] = useState('overview')

  // ── Orders (API) ────────────────────────────────────────────────────────────
  const [orders,       setOrders]       = useState([])
  const [ordersMeta,   setOrdersMeta]   = useState({})
  const [ordersLoad,   setOrdersLoad]   = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQ,      setSearchQ]      = useState('')

  const loadOrders = async (status) => {
    setOrdersLoad(true)
    try {
      const data = await adminApplications.list({ status: status === 'all' ? undefined : status, limit: 50 })
      setOrders(data.applications || [])
      setOrdersMeta(data.meta || {})
    } catch { } finally { setOrdersLoad(false) }
  }

  useEffect(() => { if (tab === 'orders' || tab === 'overview') loadOrders(filterStatus) }, [tab, filterStatus])

  const updateOrderStatus = async (id, status) => {
    try {
      await adminApplications.updateStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch { }
  }

  // ── Products (API) ──────────────────────────────────────────────────────────
  const [products,       setProducts]       = useState(PRODUCTS.map(p => ({ ...p })))
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm,       setEditForm]       = useState({})
  const [saveLoad,       setSaveLoad]       = useState(false)

  const startEdit = (p) => {
    setEditingProduct(p.id)
    setEditForm({ name: p.name, price: p.price ?? '', unit: p.unit, active: p.active !== false })
  }

  const saveEdit = async (p) => {
    // If product has a UUID (from API), patch it. Otherwise show note.
    if (p._apiId) {
      setSaveLoad(true)
      try {
        await adminProducts.update(p._apiId, { name: editForm.name, price: Number(editForm.price), unit: editForm.unit, active: editForm.active })
        setProducts(prev => prev.map(pr => pr.id === p.id ? { ...pr, ...editForm, price: Number(editForm.price) } : pr))
      } catch { } finally { setSaveLoad(false) }
    } else {
      // Local-only product — update local state only
      setProducts(prev => prev.map(pr => pr.id === p.id ? { ...pr, ...editForm, price: Number(editForm.price) } : pr))
    }
    setEditingProduct(null)
  }

  // ── Conversations (API) ─────────────────────────────────────────────────────
  const [conversations,  setConversations]  = useState([])
  const [convsLoad,      setConvsLoad]      = useState(false)
  const [activeConv,     setActiveConv]     = useState(null)
  const [convMessages,   setConvMessages]   = useState([])
  const [convMsgsLoad,   setConvMsgsLoad]   = useState(false)
  const [adminReply,     setAdminReply]     = useState('')
  const [replyLoad,      setReplyLoad]      = useState(false)
  const adminMsgEnd = useRef(null)

  const loadConversations = async () => {
    setConvsLoad(true)
    try {
      const data = await adminConversations.list({ limit: 50 })
      setConversations(data.conversations || [])
    } catch { } finally { setConvsLoad(false) }
  }

  useEffect(() => { if (tab === 'messages') loadConversations() }, [tab])

  const openConv = async (conv) => {
    setActiveConv(conv)
    setConvMsgsLoad(true)
    try {
      const data = await adminConversations.messages(conv.id, { limit: 50 })
      setConvMessages(data.messages || [])
      // Mark as read locally
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c))
      setTimeout(() => adminMsgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 150)
    } catch { } finally { setConvMsgsLoad(false) }
  }

  // Poll for new messages while a conv is open
  useEffect(() => {
    if (!activeConv) return
    const stop = pollMessages(activeConv.id, (msgs) => {
      setConvMessages(msgs)
      setTimeout(() => adminMsgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }, 8000)
    return stop
  }, [activeConv])

  const sendAdminReply = async () => {
    if (!adminReply.trim() || !activeConv || replyLoad) return
    const text = adminReply.trim()
    setAdminReply(''); setReplyLoad(true)
    try {
      await adminConversations.send(activeConv.id, text)
      const data = await adminConversations.messages(activeConv.id, { limit: 50 })
      setConvMessages(data.messages || [])
      setTimeout(() => adminMsgEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch { } finally { setReplyLoad(false) }
  }

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalOrders    = ordersMeta.total || orders.length
  const pendingOrders  = orders.filter(o => o.status === 'pending').length
  const approvedOrders = orders.filter(o => o.status === 'approved').length
  const totalRevenue   = orders.reduce((s, o) => s + (o.total_amount || 0), 0)

  const filteredOrders = orders.filter(o => {
    if (!searchQ) return true
    const q = searchQ.toLowerCase()
    const name = o.customer?.display_name?.toLowerCase() || ''
    const phone = o.customer?.phone_number || ''
    const pkg = (o.package_name || o.package_type || '').toLowerCase()
    return name.includes(q) || phone.includes(q) || pkg.includes(q)
  })

  const statusStyle = (s) => ({
    pending:   'bg-amber-100 text-amber-700 border-amber-200',
    reviewed:  'bg-purple-100 text-purple-700 border-purple-200',
    approved:  'bg-green-100 text-green-700 border-green-200',
    declined:  'bg-red-100 text-red-700 border-red-200',
  }[s] || 'bg-gray-100 text-gray-600 border-gray-200')

  const TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'orders',    label: 'Orders' },
    { id: 'messages',  label: 'Messages' },
    { id: 'products',  label: 'Products' },
    { id: 'packages',  label: 'Packages' },
    { id: 'settings',  label: 'Settings' },
  ]

  // SVG icons
  const Icon = ({ name, cls = 'w-4 h-4' }) => {
    const paths = {
      orders:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>,
      pending:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
      approved:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>,
      revenue:   <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></>,
      edit:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>,
      trash:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>,
      external:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>,
      search:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>,
      phone:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/>,
      chat:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>,
      send:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>,
      back:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>,
    }
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {paths[name]}
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Topbar — matches storefront's white sticky header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="bg-gray-900 py-1.5 text-center">
          <p className="text-amber-400 text-[11px] font-bold tracking-widest uppercase">Admin Dashboard</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark size={34} />
            <div>
              <p className="font-black text-gray-900 text-sm leading-none">List <span className="text-amber-500">"J"</span> <span className="text-gray-400 font-semibold">Admin</span></p>
              <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/#" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
              <Icon name="external" cls="w-3.5 h-3.5" />
              View Store
            </a>
            <button onClick={() => { sessionStorage.removeItem('lj_admin'); onExit() }}
              className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-2 rounded-xl transition-colors">
              Sign Out
            </button>
          </div>
        </div>
        {/* Tab strip */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  tab === t.id
                    ? 'border-amber-400 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── OVERVIEW ────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-gray-900 font-black text-2xl">Overview</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: 'orders',   label: 'Total Orders',  value: String(totalOrders),   accent: 'text-gray-900' },
                { icon: 'pending',  label: 'Pending',       value: String(pendingOrders),  accent: 'text-amber-600' },
                { icon: 'approved', label: 'Approved',      value: String(approvedOrders), accent: 'text-green-700' },
                { icon: 'revenue',  label: 'Total Revenue', value: fmt(totalRevenue),      accent: 'text-gray-900' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon name={s.icon} cls="w-4.5 h-4.5 text-gray-600" />
                  </div>
                  <p className={`font-black text-2xl ${s.accent}`}>{s.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-gray-900 font-black text-sm">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-amber-600 text-xs font-semibold hover:underline">View all</button>
              </div>
              {orders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="orders" cls="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">No orders yet</p>
                  <p className="text-gray-400 text-xs">Applications submitted via the storefront will appear here once connected to the backend.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-gray-900 text-sm font-semibold truncate">{o.customer?.display_name || 'Unknown'}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{o.package_name || o.package_type || '—'}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-gray-900 font-black text-sm">{o.total_amount ? fmt(o.total_amount) : '—'}</span>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full border uppercase ${statusStyle(o.status)}`}>{o.status || 'pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-gray-900 font-black text-sm mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Manage Orders',   icon: 'orders',   action: () => setTab('orders') },
                  { label: 'Edit Products',   icon: 'edit',     action: () => setTab('products') },
                  { label: 'View Packages',   icon: 'approved', action: () => setTab('packages') },
                  { label: 'Call / WhatsApp', icon: 'phone',    action: () => window.open('https://wa.me/233244854206') },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    className="flex flex-col items-center gap-2.5 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-xl p-4 transition-all group">
                    <div className="w-9 h-9 bg-white group-hover:bg-amber-100 rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-amber-200 transition-all">
                      <Icon name={a.icon} cls="w-4 h-4 text-gray-500 group-hover:text-amber-700" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-amber-700 text-center leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-amber-800 font-black text-sm mb-1">Live data from the API</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                Orders, conversations and products are now pulled from the live backend. Changes made here (status updates, price edits) are saved to the server.
              </p>
            </div>
          </div>
        )}

        {/* ── ORDERS ──────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-gray-900 font-black text-2xl">Orders
                {ordersMeta.total > 0 && <span className="text-gray-400 font-normal text-lg ml-2">({ordersMeta.total} total)</span>}
              </h1>
              <button onClick={() => loadOrders(filterStatus)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">
                Refresh
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search by name, phone or package..."
                  className="w-full bg-white border border-gray-200 focus:border-amber-400 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['all','pending','reviewed','approved','declined'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoad ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-16 flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="orders" cls="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-semibold">No orders match your filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((o) => (
                    <div key={o.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 flex items-start justify-between gap-4 border-b border-gray-100">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-gray-900 font-black text-base">{o.customer?.display_name || 'Unknown'}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase ${statusStyle(o.status)}`}>{o.status || 'pending'}</span>
                          </div>
                          <p className="text-gray-400 text-xs">{o.customer?.phone_number} · {o.institution}</p>
                          <p className="text-amber-600 text-xs font-semibold mt-1">{o.package_name || o.package_type}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-gray-900 font-black text-lg">{o.total_amount ? fmt(o.total_amount) : '—'}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB') : '—'}</p>
                          <p className="text-gray-400 text-xs">{o.monthly_amount ? fmt(o.monthly_amount) + '/mo' : '—'}</p>
                        </div>
                      </div>
                      <div className="px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-gray-100 bg-gray-50">
                        {[
                          { label: 'Staff No.',   value: o.staff_number },
                          { label: 'Mandate No.', value: o.mandate_number },
                          { label: 'Ghana Card',  value: o.ghana_card_number },
                        ].map(row => (
                          <div key={row.label}>
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider">{row.label}</p>
                            <p className="text-gray-700 text-xs font-semibold mt-0.5">{row.value || '—'}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-6 py-3 flex flex-wrap gap-2 items-center">
                        <p className="text-gray-400 text-xs mr-1">Status:</p>
                        {['pending','reviewed','approved','declined'].map(s => (
                          <button key={s} onClick={() => updateOrderStatus(o.id, s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize border ${o.status === s ? statusStyle(s) : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                            {s}
                          </button>
                        ))}
                        <div className="flex-1" />
                        <a href={`https://wa.me/233${(o.customer?.phone_number||'').replace(/^\+233/, '').replace(/^0/, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:border-gray-400 transition-all">
                          <Icon name="phone" cls="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS ────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-gray-900 font-black text-2xl">Products</h1>
              <p className="text-gray-400 text-xs">{products.length} items</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
              Price edits here update the live backend via the API. Products with a server ID save immediately; local-only products (from the hardcoded list) update in this session only until the database is seeded.
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1" />
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Unit</div>
                <div className="col-span-1" />
              </div>
              {products.map((p, rowIdx) => {
                const cat = CATEGORIES.find(c => c.id === p.cat)
                const isEditing = editingProduct === p.id
                return (
                  <div key={p.id} className={`border-b border-gray-100 last:border-0 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    {isEditing ? (
                      <div className="p-5 bg-amber-50 border-l-2 border-amber-400">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          {[
                            { key: 'name',  label: 'Product Name', span: 'col-span-2 sm:col-span-4' },
                            { key: 'price', label: 'Price (GH₵)',  span: '' },
                            { key: 'unit',  label: 'Unit',         span: '' },
                          ].map(f => (
                            <div key={f.key} className={f.span}>
                              <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">{f.label}</label>
                              <input value={editForm[f.key] ?? ''} onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                className="w-full bg-white border border-gray-300 focus:border-amber-400 text-gray-800 rounded-lg px-3 py-2 text-sm outline-none" />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(p)} disabled={saveLoad}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60">
                            {saveLoad ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => setEditingProduct(null)} className="bg-white border border-gray-300 text-gray-500 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors hover:bg-gray-50">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-12 gap-4 items-center px-5 py-3.5">
                        <div className="col-span-1">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-contain p-1" /> : <span className="text-lg">{p.emoji}</span>}
                          </div>
                        </div>
                        <div className="col-span-4">
                          <p className="text-gray-900 text-sm font-semibold">{p.name}</p>
                          <p className="text-gray-400 text-xs">{p.unit}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{cat?.label}</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-gray-900 font-black text-sm">{p.price !== null && p.price !== undefined ? fmt(p.price) : 'On Request'}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-gray-400 text-xs line-through">{p.oldPrice ? fmt(p.oldPrice) : '—'}</p>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => startEdit(p)}
                            className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800 px-2 py-1.5 rounded-lg hover:bg-amber-50 transition-all">
                            <Icon name="edit" cls="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── MESSAGES ────────────────────────────────────────────── */}
        {tab === 'messages' && (
          <div className="h-[calc(100vh-180px)] flex gap-5">

            {/* LEFT — conversation list */}
            <div className={`${activeConv !== null ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 xl:w-96 flex-shrink-0 bg-white rounded-2xl border border-gray-200 overflow-hidden`}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-gray-900 font-black text-sm">Messages</h2>
                <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded-full">{conversations.length}</span>
              </div>

              {conversations.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <Icon name="chat" cls="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">No conversations yet</p>
                  <p className="text-gray-400 text-xs leading-relaxed">Customer messages sent through the storefront will appear here.</p>
                  <button onClick={loadConversations}
                    className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {conversations.map((c) => (
                    <button key={c.id} onClick={() => openConv(c)}
                      className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${activeConv?.id === c.id ? 'bg-amber-50 border-r-2 border-amber-400' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-black text-sm flex-shrink-0">
                            {c.other_user?.display_name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-gray-900 text-sm font-semibold truncate">{c.other_user?.display_name || 'Unknown'}</p>
                        </div>
                        {c.unread_count > 0 && (
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-gray-900 text-[10px] font-black flex items-center justify-center flex-shrink-0">{c.unread_count}</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs truncate pl-10">{c.last_message || 'No messages'}</p>
                      <p className="text-gray-300 text-[10px] pl-10 mt-0.5">{c.other_user?.phone_number}</p>
                    </button>
                  ))}
                  <button onClick={loadConversations}
                    className="w-full text-center text-xs text-gray-300 hover:text-gray-500 py-3 transition-colors">
                    Refresh conversations
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT — chat window */}
            <div className={`${!activeConv ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden min-w-0`}>
              {!activeConv ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="chat" cls="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-semibold text-sm">Select a conversation</p>
                  <p className="text-gray-400 text-xs mt-1">Choose a customer from the list to view and reply.</p>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                    <button onClick={() => setActiveConv(null)} className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors mr-1">
                      <Icon name="back" cls="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-black text-sm flex-shrink-0">
                      {activeConv.other_user?.display_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-black text-sm">{activeConv.other_user?.display_name}</p>
                      <p className="text-gray-400 text-xs">{activeConv.other_user?.phone_number}</p>
                    </div>
                    <a href={`https://wa.me/${(activeConv.other_user?.phone_number||'').replace(/^\+/, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold border border-gray-200 text-gray-500 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors">
                      <Icon name="phone" cls="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                    {convMsgsLoad ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : convMessages.map((msg) => {
                      const isAdminMsg = msg.sender_id !== activeConv.other_user?.id
                      const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                      const date = new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                      return (
                        <div key={msg.id} className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[72%] flex flex-col gap-1 ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                            {!isAdminMsg && <p className="text-gray-400 text-[10px] px-1">{activeConv.other_user?.display_name}</p>}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isAdminMsg ? 'bg-gray-900 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                            }`}>
                              {msg.content}
                            </div>
                            <p className="text-gray-300 text-[10px] px-1">{date} · {time}</p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={adminMsgEnd} />
                  </div>

                  {/* Reply composer */}
                  <div className="px-5 py-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-3 items-end">
                      <textarea value={adminReply} onChange={e => setAdminReply(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminReply() } }}
                        placeholder="Type a reply... (Enter to send, Shift+Enter for new line)"
                        rows={2}
                        className="flex-1 bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none" />
                      <button onClick={sendAdminReply} disabled={!adminReply.trim() || replyLoad}
                        className="w-11 h-11 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95">
                        {replyLoad
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <Icon name="send" cls="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PACKAGES ────────────────────────────────────────────── */}
        {tab === 'packages' && (
          <div className="space-y-6">
            <h1 className="text-gray-900 font-black text-2xl">Packages</h1>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-600">
              Package contents are defined in the <code className="bg-gray-200 px-1 rounded font-mono">FIXED_PACKAGES</code> array in App.jsx. This page is a read-only reference.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIXED_PACKAGES.map((pkg, idx) => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className={`h-1 w-full ${pkg.popular ? 'bg-amber-400' : pkg.id === 'valentine' ? 'bg-pink-500' : 'bg-gray-300'}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">{pkg.tag}</span>
                        <p className="text-gray-900 font-black text-base mt-2">{pkg.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{pkg.tagline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-600 font-black text-lg">{pkg.price}</p>
                        <p className="text-gray-400 text-xs">{pkg.monthly}</p>
                      </div>
                    </div>
                    {pkg.riceOptions && <p className="text-green-700 text-xs font-semibold mb-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2">Rice: {pkg.riceOptions}</p>}
                    {pkg.items.length > 0 ? (
                      <ul className="space-y-1.5 border-t border-gray-100 pt-3">
                        {pkg.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                            {item.label} {item.qty > 1 && <span className="text-amber-600 font-bold">×{item.qty}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-xs italic border-t border-gray-100 pt-3">Customized — handled via WhatsApp</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-gray-900 font-black text-lg">Provisions Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PROVISIONS_PACKAGES.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900 font-black text-base">{pkg.name}</p>
                    <p className="text-amber-600 font-black">{pkg.price ? fmt(pkg.price) : 'On Request'}</p>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{pkg.items}</p>
                </div>
              ))}
            </div>

            <h2 className="text-gray-900 font-black text-lg">Detergent Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DETERGENT_PACKAGES.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900 font-black text-base">{pkg.name}</p>
                    <p className="text-blue-600 font-black">{fmt(pkg.price)}</p>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{pkg.items}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ────────────────────────────────────────────── */}
        {tab === 'settings' && (
          <div className="space-y-5 max-w-2xl">
            <h1 className="text-gray-900 font-black text-2xl">Settings</h1>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">

              <div className="p-6">
                <p className="text-gray-900 font-black text-sm mb-1">Admin PIN</p>
                <p className="text-gray-500 text-xs mb-3">To change the PIN, edit the <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">ADMIN_PIN</code> constant at the top of App.jsx. Current PIN length: {ADMIN_PIN.length} digits.</p>
                <div className="flex gap-2">
                  {ADMIN_PIN.split('').map((_, i) => <div key={i} className="w-8 h-8 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-center justify-center text-amber-500 font-black text-sm">•</div>)}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-900 font-black text-sm mb-1">Access the Dashboard</p>
                <p className="text-gray-500 text-xs mb-3">The admin dashboard is accessed by navigating to the URL below. Bookmark it for easy access.</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm text-gray-700">
                  yoursite.com/#admin
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-900 font-black text-sm mb-1">Store Contacts</p>
                <p className="text-gray-500 text-xs mb-3">WhatsApp numbers used on the storefront.</p>
                {['0244854206', '0593041474'].map(n => (
                  <div key={n} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-2">
                    <span className="text-gray-800 font-semibold text-sm">{n}</span>
                    <a href={`https://wa.me/233${n.slice(1)}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1">
                      <Icon name="external" cls="w-3 h-3" /> Open
                    </a>
                  </div>
                ))}
              </div>

              <div className="p-6">
                <p className="text-gray-900 font-black text-sm mb-1">Data Management</p>
                <p className="text-gray-500 text-xs mb-4">Manage locally stored data. These actions cannot be undone.</p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => { if (window.confirm('Clear all orders? This cannot be undone.')) { setOrders([]); localStorage.removeItem('lj_orders') } }}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">
                    <Icon name="trash" cls="w-3.5 h-3.5" />
                    Clear All Orders
                  </button>
                  <button onClick={() => { saveProducts(PRODUCTS.map(p => ({ ...p }))); alert('Product prices reset to defaults.') }}
                    className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">
                    Reset Product Prices
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Admin routing ──────────────────────────────────────────────────────────
  const [adminView, setAdminView] = useState(() => {
    const hash = window.location.hash
    if (hash === '#admin' || hash === '#admin-login') return 'login'
    if (hash === '#admin-dash' && sessionStorage.getItem('lj_admin')) return 'dashboard'
    return 'store'
  })

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      if (hash === '#admin' || hash === '#admin-login') {
        if (sessionStorage.getItem('lj_admin')) {
          setAdminView('dashboard')
          window.history.replaceState(null, '', '#admin-dash')
        } else {
          setAdminView('login')
        }
      } else if (hash === '#admin-dash') {
        if (sessionStorage.getItem('lj_admin')) setAdminView('dashboard')
        else setAdminView('login')
      } else if (adminView !== 'store') {
        setAdminView('store')
      }
    }
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [adminView])

  if (adminView === 'login') {
    return (
      <AdminLogin
        onSuccess={() => { window.history.replaceState(null, '', '#admin-dash'); setAdminView('dashboard') }}
        onBack={() => { window.history.replaceState(null, '', '/'); setAdminView('store') }}
      />
    )
  }

  if (adminView === 'dashboard') {
    return (
      <AdminDashboard
        onExit={() => { window.history.replaceState(null, '', '/'); setAdminView('store') }}
      />
    )
  }

  // ── Store state ────────────────────────────────────────────────────────────
  const [user, setUser]         = useState(() => { try { return JSON.parse(localStorage.getItem('lj_current_user')) } catch { return null } })
  const [showAuth, setShowAuth] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [cart, setCart]                       = useState({})
  const [cartOpen, setCartOpen]               = useState(false)
  const [cartPageOpen, setCartPageOpen]       = useState(false)
  const [prefilled, setPrefilled]             = useState('')
  const [shopCat, setShopCat]                 = useState('all')
  const [searchQuery, setSearchQuery]         = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0)

  const addToCart = id => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }))
  const removeFromCart = id => setCart(p => {
    const q = (p[id] || 0) - 1
    if (q <= 0) { const n = { ...p }; delete n[id]; return n }
    return { ...p, [id]: q }
  })
  const removeAllFromCart = (id) => {
    if (id === 'all') { setCart({}); return }
    setCart(p => { const n = { ...p }; delete n[id]; return n })
  }
  const clearCart = () => setCart({})

  const cartTotal = Object.entries(cart).reduce((s, [id, q]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id))
    return s + (p ? p.price * q : 0)
  }, 0)
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0)

  // ── Browser history support ────────────────────────────────────────────────
  // Push a history entry when navigating to product/package/cart pages
  // so the browser Back button works naturally.
  const goToProduct = (product) => {
    window.history.pushState({ view: 'product', id: product.id }, '', `#product-${product.id}`)
    setSelectedProduct(product)
    window.scrollTo(0, 0)
  }
  const goToPackage = (pkg, idx) => {
    window.history.pushState({ view: 'package', id: pkg.id, idx }, '', `#package-${pkg.id}`)
    setSelectedPackage(pkg)
    setSelectedPackageIdx(idx)
    window.scrollTo(0, 0)
  }
  const goToCart = () => {
    window.history.pushState({ view: 'cart' }, '', '#cart')
    setCartPageOpen(true)
    window.scrollTo(0, 0)
  }

  // Listen to browser Back/Forward
  useEffect(() => {
    const onPop = (e) => {
      const state = e.state
      if (!state) {
        // Back to home
        setSelectedProduct(null)
        setSelectedPackage(null)
        setCartPageOpen(false)
      } else if (state.view === 'product') {
        const p = PRODUCTS.find(pr => pr.id === state.id)
        if (p) { setSelectedProduct(p); setSelectedPackage(null); setCartPageOpen(false) }
        else { setSelectedProduct(null) }
      } else if (state.view === 'package') {
        const pkg = FIXED_PACKAGES.find(pk => pk.id === state.id)
        if (pkg) { setSelectedPackage(pkg); setSelectedPackageIdx(state.idx || 0); setSelectedProduct(null); setCartPageOpen(false) }
        else { setSelectedPackage(null) }
      } else if (state.view === 'cart') {
        setCartPageOpen(true)
        setSelectedProduct(null)
        setSelectedPackage(null)
      } else {
        setSelectedProduct(null)
        setSelectedPackage(null)
        setCartPageOpen(false)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const closeProduct = () => {
    window.history.back()
  }
  const closePackage = () => {
    window.history.back()
  }
  const closeCart = () => {
    window.history.back()
  }

  const toApply = () => { setCartOpen(false); setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 150) }
  const toShop  = (cat = 'all') => { setShopCat(cat); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 50) }
  const applyWithPkg = pkg => { setPrefilled(pkg); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }) }
  const viewProduct = (product) => goToProduct(product)
  const viewPackage = (pkg, idx) => goToPackage(pkg, idx)

  // Show product detail page
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        qty={cart[selectedProduct.id] || 0}
        onAdd={() => addToCart(selectedProduct.id)}
        onRemove={() => removeFromCart(selectedProduct.id)}
        onBack={closeProduct}
        onViewProduct={viewProduct}
        cartCount={cartCount}
        onCartOpen={goToCart}
        onDeptClick={(catId) => { closeProduct(); setShopCat(catId); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 150) }}
      />
    )
  }

  // Show full cart page
  if (cartPageOpen) {
    return (
      <CartPage
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={removeAllFromCart}
        onBack={closeCart}
        onShop={() => { closeCart(); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
        onCheckout={() => { closeCart(); setTimeout(toApply, 100) }}
        cartCount={cartCount}
        onCartOpen={goToCart}
        onDeptClick={(catId) => { closeCart(); setShopCat(catId); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 150) }}
      />
    )
  }

  // Show package detail page
  if (selectedPackage) {
    return (
      <PackageDetail
        pkg={selectedPackage}
        idx={selectedPackageIdx}
        onBack={closePackage}
        onApply={(pkgOption) => {
          setPrefilled(pkgOption)
          closePackage()
          setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 150)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar cartCount={cartCount} onCartOpen={goToCart} onApply={toApply}
        onSearch={setSearchQuery}
        user={user}
        onAccountClick={() => user ? setShowAccount(true) : setShowAuth(true)}
        onDeptClick={(catId) => {
          setSearchQuery('')
          if (catId === 'packages') { document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) }
          else { setShopCat(catId); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 80) }
        }} />

      {/* Client Auth Page */}
      {showAuth && (
        <ClientAuthPage
          onClose={() => setShowAuth(false)}
          onLogin={(u) => { setUser(u); setShowAuth(false) }}
        />
      )}

      {/* Client Account Page */}
      {showAccount && user && (
        <ClientAccountPage
          user={user}
          onClose={() => setShowAccount(false)}
          onApply={() => { setShowAccount(false); setTimeout(toApply, 150) }}
          onLogout={() => setUser(null)}
          onOpenMessages={() => {}}
        />
      )}

      {/* Live search results */}
      {searchQuery && (() => {
        const results = PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(searchQuery) ||
          CATEGORIES.find(c => c.id === p.cat)?.label.toLowerCase().includes(searchQuery)
        )
        return (
          <div className="fixed top-[108px] left-0 right-0 z-40 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-600">
                  {results.length > 0 ? `${results.length} result${results.length > 1 ? 's' : ''} for "${searchQuery}"` : `No results for "${searchQuery}"`}
                </p>
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
              </div>
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-400 text-sm">Try searching for rice, oil, mackerel, sardine, chicken...</p>
                  <a href="https://wa.me/233244854206" target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-amber-600 text-xs font-semibold hover:underline">
                    Can't find it? WhatsApp us →
                  </a>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {results.slice(0, 10).map(p => {
                    const cat = CATEGORIES.find(c => c.id === p.cat)
                    return (
                      <button key={p.id}
                        onClick={() => { viewProduct(p); setSearchQuery('') }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors text-left">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.img
                            ? <img src={p.img} alt={p.name} className="w-full h-full object-contain p-1" />
                            : <span className="text-lg">{p.emoji}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm font-semibold truncate">{p.name}</p>
                          <p className="text-gray-400 text-xs">{cat?.label}</p>
                        </div>
                        <span className="text-gray-900 font-black text-sm flex-shrink-0">{fmt(p.price)}</span>
                      </button>
                    )
                  })}
                  {results.length > 10 && (
                    <div className="px-4 py-3 text-center text-xs text-gray-400">
                      +{results.length - 10} more results — refine your search
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })()}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}
        cart={cart} onAdd={addToCart} onRemove={removeFromCart}
        onClear={clearCart} onCheckout={toApply} total={cartTotal} />

      <Hero onShop={() => toShop()} onApply={toApply} />
      <TrustBar />
      <CategoryTiles onCatClick={cat => toShop(cat)} />

      {/* Packages shown first after homepage */}
      <FixedPackages onApplyWithPackage={applyWithPkg} onViewPackage={viewPackage} />

      {/* 3 rows of mixed featured products — GH Basket style */}
      <FeaturedGrid cart={cart} onAdd={addToCart} onRemove={removeFromCart} onShop={() => toShop()} onView={viewProduct} />

      <PromoStrip onApply={toApply} onShop={() => toShop()} />
      <ShopSection cart={cart} onAdd={addToCart} onRemove={removeFromCart}
        onCartOpen={goToCart}
        cartTotal={cartTotal} cartCount={cartCount}
        onView={viewProduct} defaultCat={shopCat}
        onApply={(pkgName) => { setPrefilled(pkgName); setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 100) }} />
      <ApplySection prefilledPackage={prefilled} cartTotal={cartTotal} cartItems={cartItems} />
      <Footer />
      <ClientMessaging />
      <WhatsAppFloat />
    </div>
  )
}
