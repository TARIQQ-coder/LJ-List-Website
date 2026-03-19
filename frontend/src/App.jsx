import { useState, useEffect, useRef } from 'react'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Rice & Grains', 'Cooking Oil', 'Tomatoes & Paste', 'Fish & Protein', 'Chicken', 'Detergents', 'Beverages', 'Extras']

const PRODUCTS = [
  { id: 1,  name: 'Royal Feast Rice 25kg',         category: 'Rice & Grains',      price: 180, emoji: '🌾', unit: 'bag' },
  { id: 2,  name: 'Royal Feast Rice 10kg',         category: 'Rice & Grains',      price: 78,  emoji: '🌾', unit: 'bag' },
  { id: 3,  name: 'Mama Gold Rice 5kg',            category: 'Rice & Grains',      price: 42,  emoji: '🌾', unit: 'bag' },
  { id: 4,  name: 'Indomie Noodles 40pcs',         category: 'Rice & Grains',      price: 95,  emoji: '🍜', unit: 'carton' },
  { id: 5,  name: 'Frytol Vegetable Oil 5L',       category: 'Cooking Oil',        price: 110, emoji: '🫙', unit: 'bottle' },
  { id: 6,  name: 'Frytol Vegetable Oil 2L',       category: 'Cooking Oil',        price: 52,  emoji: '🫙', unit: 'bottle' },
  { id: 7,  name: 'Gino Vegetable Oil 3L',         category: 'Cooking Oil',        price: 75,  emoji: '🫙', unit: 'bottle' },
  { id: 8,  name: 'Palm Oil 4L',                   category: 'Cooking Oil',        price: 65,  emoji: '🫙', unit: 'bottle' },
  { id: 9,  name: 'Afia Tomato Paste 70g ×12',     category: 'Tomatoes & Paste',   price: 72,  emoji: '🍅', unit: 'pack' },
  { id: 10, name: 'Tasty Tom Stew Base 400g',      category: 'Tomatoes & Paste',   price: 45,  emoji: '🍅', unit: 'tin' },
  { id: 11, name: 'Gino Tomato Mix 400g ×6',       category: 'Tomatoes & Paste',   price: 55,  emoji: '🍅', unit: 'pack' },
  { id: 12, name: 'Fresh Tomato Paste 2kg',        category: 'Tomatoes & Paste',   price: 38,  emoji: '🍅', unit: 'tin' },
  { id: 13, name: 'Geisha Mackerel 155g ×12',      category: 'Fish & Protein',     price: 85,  emoji: '🐟', unit: 'carton' },
  { id: 14, name: 'Lucky Star Pilchards ×12',      category: 'Fish & Protein',     price: 90,  emoji: '🐟', unit: 'carton' },
  { id: 15, name: 'Titus Sardines ×12',            category: 'Fish & Protein',     price: 80,  emoji: '🐟', unit: 'carton' },
  { id: 16, name: 'Devon King Corned Beef ×6',     category: 'Fish & Protein',     price: 95,  emoji: '🥩', unit: 'carton' },
  { id: 17, name: 'Frozen Whole Chicken 2kg',      category: 'Chicken',            price: 95,  emoji: '🍗', unit: 'pack' },
  { id: 18, name: 'Chicken Thighs 2kg',            category: 'Chicken',            price: 88,  emoji: '🍗', unit: 'pack' },
  { id: 19, name: 'Chicken Wings 2kg',             category: 'Chicken',            price: 82,  emoji: '🍗', unit: 'pack' },
  { id: 20, name: 'Chicken Drumsticks 3kg',        category: 'Chicken',            price: 120, emoji: '🍗', unit: 'pack' },
  { id: 21, name: "Mama's Choice Detergent 5kg",   category: 'Detergents',         price: 85,  emoji: '🧺', unit: 'bag' },
  { id: 22, name: 'Omo Washing Powder 2kg',        category: 'Detergents',         price: 48,  emoji: '🫧', unit: 'bag' },
  { id: 23, name: 'Ariel Automatic 1.5kg',         category: 'Detergents',         price: 78,  emoji: '🫧', unit: 'bag' },
  { id: 24, name: 'Sunlight Dishwash Liquid 750ml',category: 'Detergents',         price: 28,  emoji: '🧴', unit: 'bottle' },
  { id: 25, name: 'Dettol Antiseptic 500ml',       category: 'Detergents',         price: 38,  emoji: '🧴', unit: 'bottle' },
  { id: 26, name: 'Morning Fresh Detergent 2L',    category: 'Detergents',         price: 55,  emoji: '🧴', unit: 'bottle' },
  { id: 27, name: 'Milo 400g',                     category: 'Beverages',          price: 55,  emoji: '🍫', unit: 'tin' },
  { id: 28, name: 'Cowbell Milk Powder 400g',      category: 'Beverages',          price: 62,  emoji: '🥛', unit: 'tin' },
  { id: 29, name: 'Lipton Tea Bags 100pcs',        category: 'Beverages',          price: 35,  emoji: '🍵', unit: 'box' },
  { id: 30, name: 'Eva Table Water 1.5L ×12',      category: 'Beverages',          price: 42,  emoji: '💧', unit: 'carton' },
  { id: 31, name: 'Maggi Seasoning Cubes ×100',    category: 'Extras',             price: 30,  emoji: '🧂', unit: 'pack' },
  { id: 32, name: 'Sugar 2kg',                     category: 'Extras',             price: 28,  emoji: '🍬', unit: 'bag' },
  { id: 33, name: 'Salt 1kg',                      category: 'Extras',             price: 10,  emoji: '🧂', unit: 'bag' },
  { id: 34, name: 'Kerosene 4L',                   category: 'Extras',             price: 45,  emoji: '🪔', unit: 'bottle' },
]

const MIN_ORDER = 549

const PACKAGE_OPTIONS = [
  'ABUSUA ASOMDWEE (GHC549–GHC579)',
  'MEDAASE ME DƆ (GHC769–GHC858)',
  'YOU DO ALL (GHC1,099–GHC1,129)',
  'SUPER LOVE (GHC1,299–GHC1,350)',
  'SUPER LOVE GYE WO TWO (GHC1,890)',
  'CUSTOMIZED REQUEST (Call/WhatsApp 0244854206)',
]

const FIXED_PACKAGES = [
  { id: 'abusua',      name: 'Abusua Asomdwee',       price: 'GH₵549–579',   monthly: 'GH₵193/mo', tag: 'Starter',  popular: false, color: 'from-yellow-700 to-yellow-500', items: ['Rice', 'Cooking Oil', 'Tin Tomatoes', 'Sardine'] },
  { id: 'medaase',     name: 'Medaase Me Dɔ',          price: 'GH₵769–858',   monthly: 'GH₵286/mo', tag: 'Popular',  popular: true,  color: 'from-yellow-600 to-amber-400',  items: ['Rice', 'Oil', 'Tomatoes', 'Mackerel', 'Chicken'] },
  { id: 'youdo',       name: 'You Do All',              price: 'GH₵1,099–1,129', monthly: 'GH₵376/mo', tag: 'Family', popular: false, color: 'from-amber-600 to-yellow-400',  items: ['Rice', 'Oil', 'Tomatoes', 'Mackerel', 'Sardine', 'Chicken'] },
  { id: 'superlove',   name: 'Super Love',              price: 'GH₵1,299–1,350', monthly: 'GH₵450/mo', tag: 'Premium',popular: false, color: 'from-yellow-500 to-amber-300',  items: ['Rice', 'Oil', 'Tomatoes', 'Mackerel', 'Sardine', 'Chicken', 'Extras'] },
  { id: 'superlovegye',name: 'Super Love Gye Wo Two',   price: 'GH₵1,890',    monthly: 'GH₵630/mo', tag: 'Ultimate', popular: false, color: 'from-amber-400 to-yellow-200',  items: ['Rice', 'Oil', 'Tomatoes', 'Mackerel', 'Sardine', 'Chicken', 'Detergents', 'More'] },
  { id: 'custom',      name: 'Customized Request',      price: 'Call for pricing', monthly: 'Flexible', tag: 'Custom', popular: false, color: 'from-stone-600 to-stone-400',   items: ['You choose everything'] },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n) => `GH₵${n.toLocaleString()}`

// ─── LOGO ─────────────────────────────────────────────────────────────────────

const LogoMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="gld" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f5c842" />
        <stop offset="50%" stopColor="#d4a017" />
        <stop offset="100%" stopColor="#a07010" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="46" stroke="url(#gld)" strokeWidth="6" />
    <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="Georgia,serif" fill="url(#gld)">J</text>
  </svg>
)

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const Navbar = ({ cartCount, onCartOpen, onApply }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-yellow-900/40">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <LogoMark size={38} />
        <div className="hidden sm:block leading-tight">
          <p className="text-yellow-400 font-black text-base tracking-widest uppercase" style={{ fontFamily: 'Georgia,serif' }}>List "J"</p>
          <p className="text-yellow-800 text-[10px] tracking-widest uppercase">Grocery Shop</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-xs text-yellow-200/60 font-medium tracking-wider uppercase">
        <a href="#packages" className="hover:text-yellow-400 transition-colors">Packages</a>
        <a href="#shop"     className="hover:text-yellow-400 transition-colors">Build Your Own</a>
        <a href="#apply"    className="hover:text-yellow-400 transition-colors">Apply</a>
      </nav>

      <div className="flex items-center gap-3">
        <button onClick={onCartOpen} className="relative flex items-center gap-2 border border-yellow-800/60 text-yellow-300 hover:border-yellow-500 hover:text-yellow-400 transition-all px-4 py-2 rounded-xl text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
          )}
        </button>
        <button onClick={onApply} className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-xs px-4 py-2.5 rounded-xl hover:from-yellow-400 hover:to-amber-300 active:scale-95 transition-all shadow-lg shadow-yellow-900/30 uppercase tracking-wider">
          Apply Now
        </button>
      </div>
    </div>
  </header>
)

// ─── HERO ─────────────────────────────────────────────────────────────────────

const Hero = ({ onShop, onApply }) => (
  <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black pt-16">
    <div className="absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: 'linear-gradient(#d4a017 1px,transparent 1px),linear-gradient(90deg,#d4a017 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
      style={{ background: 'radial-gradient(circle,#d4a017 0%,transparent 70%)' }} />

    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 border border-yellow-700/50 bg-yellow-950/40 text-yellow-400 text-[11px] font-bold px-4 py-2 rounded-full mb-8 tracking-[3px] uppercase">
        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
        Open to All Government Workers in Ghana
      </div>
      <div className="flex justify-center mb-6"><LogoMark size={85} /></div>
      <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-3 tracking-tight" style={{ fontFamily: 'Georgia,serif' }}>
        Feast in{' '}
        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#f5c842,#d4a017,#a07010)' }}>
          Comfort.
        </span>
      </h1>
      <p className="text-2xl text-yellow-400/70 font-light mb-3 italic" style={{ fontFamily: 'Georgia,serif' }}>Super 3 Months Plan</p>
      <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
        Get your groceries, frozen foods and detergents in bulk. Pay comfortably over 1–3 months. Pick a ready package or build your own custom order.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onShop}
          className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-base px-10 py-4 rounded-2xl hover:from-yellow-400 hover:to-amber-300 active:scale-95 transition-all shadow-xl shadow-yellow-900/40">
          🛒 Build Your Own Package
        </button>
        <a href="#packages" className="w-full sm:w-auto border border-yellow-700/60 text-yellow-300 font-semibold text-base px-10 py-4 rounded-2xl hover:bg-yellow-950/50 transition-all text-center">
          View Fixed Packages
        </a>
      </div>
      <p className="mt-5 text-gray-600 text-sm">
        Questions? <a href="https://wa.me/233244854206" className="text-yellow-600 hover:underline font-semibold">WhatsApp 0244854206</a>
      </p>
    </div>
  </section>
)

// ─── FIXED PACKAGES ───────────────────────────────────────────────────────────

const FixedPackages = ({ onApplyWithPackage }) => (
  <section id="packages" className="bg-black py-20 px-4 border-t border-yellow-950">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-yellow-600 text-[11px] font-bold tracking-[4px] uppercase mb-3">Ready-Made</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Georgia,serif' }}>Fixed Packages</h2>
        <p className="text-gray-500 mt-2 text-sm">Our curated bundles — pick one and apply instantly.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FIXED_PACKAGES.map((pkg, idx) => (
          <div key={pkg.id} className="relative rounded-2xl border border-yellow-900/40 hover:border-yellow-700/60 transition-all duration-300 overflow-hidden hover:-translate-y-1">
            <div className={`h-1.5 w-full bg-gradient-to-r ${pkg.color}`} />
            {pkg.popular && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase">Most Popular</div>
            )}
            <div className="bg-gray-950 p-6">
              <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 bg-gradient-to-r ${pkg.color} text-black`}>{pkg.tag}</span>
              <h3 className="text-white font-black text-lg mb-1" style={{ fontFamily: 'Georgia,serif' }}>{pkg.name}</h3>
              <div className="mb-4">
                <p className="text-yellow-400 font-black text-xl">{pkg.price}</p>
                <p className="text-gray-600 text-xs mt-0.5">≈ {pkg.monthly} over 3 months</p>
              </div>
              <ul className="space-y-1.5 mb-5">
                {pkg.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-400 text-xs">
                    <span className="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center">
                      <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onApplyWithPackage(pkg.id === 'custom' ? PACKAGE_OPTIONS[5] : PACKAGE_OPTIONS[idx])}
                className="w-full py-3 rounded-xl font-bold text-sm border border-yellow-800/60 text-yellow-400 hover:bg-yellow-950/60 hover:border-yellow-500 transition-all active:scale-95"
              >
                {pkg.id === 'custom' ? 'Call 0244854206' : 'Select & Apply →'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-16">
        <div className="flex-1 h-px bg-yellow-950" />
        <span className="text-yellow-700 text-xs font-bold tracking-[4px] uppercase px-4">Or Build Your Own</span>
        <div className="flex-1 h-px bg-yellow-950" />
      </div>
    </div>
  </section>
)

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, qty, onAdd, onRemove }) => (
  <div className="bg-gray-950 border border-yellow-900/30 hover:border-yellow-700/50 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group flex flex-col">
    <div className="relative bg-gradient-to-br from-gray-900 to-black flex items-center justify-center h-36 border-b border-yellow-950">
      <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
      {qty > 0 && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{qty}</span>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1 gap-2">
      <p className="text-white text-sm font-bold leading-snug line-clamp-2">{product.name}</p>
      <p className="text-gray-600 text-[11px] uppercase tracking-wider">{product.unit}</p>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-yellow-400 font-black text-base">{fmt(product.price)}</span>
        {qty === 0 ? (
          <button onClick={onAdd} className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-xs px-4 py-2 rounded-xl hover:from-yellow-400 hover:to-amber-300 active:scale-95 transition-all">
            Add
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={onRemove} className="w-7 h-7 rounded-lg bg-yellow-950/60 border border-yellow-800/60 text-yellow-400 font-black text-base flex items-center justify-center hover:bg-yellow-900/60 active:scale-90 transition-all">−</button>
            <span className="text-white font-bold text-sm w-4 text-center">{qty}</span>
            <button onClick={onAdd} className="w-7 h-7 rounded-lg bg-yellow-500/20 border border-yellow-600/60 text-yellow-400 font-black text-base flex items-center justify-center hover:bg-yellow-500/30 active:scale-90 transition-all">+</button>
          </div>
        )}
      </div>
    </div>
  </div>
)

// ─── CART DRAWER ──────────────────────────────────────────────────────────────

const CartDrawer = ({ open, onClose, cart, onAdd, onRemove, onClear, onCheckout, total }) => {
  const pct = Math.min(100, Math.round((total / MIN_ORDER) * 100))
  const remaining = Math.max(0, MIN_ORDER - total)
  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0)

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gray-950 border-l border-yellow-900/40 z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yellow-900/30">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-white font-black text-lg" style={{ fontFamily: 'Georgia,serif' }}>Your Package</h2>
            <span className="text-yellow-700 text-xs font-bold">({cartItems.length} items)</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-5 py-4 border-b border-yellow-900/20 bg-black/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-yellow-300 text-xs font-bold">Minimum Order Progress</span>
            <span className="text-yellow-400 text-xs font-black">{pct}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-600 to-amber-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px]">
            <span className="text-gray-500">Cart: <span className="text-yellow-400 font-bold">{fmt(total)}</span></span>
            {pct < 100
              ? <span className="text-gray-500">Add <span className="text-yellow-500 font-bold">{fmt(remaining)}</span> more</span>
              : <span className="text-green-400 font-bold">✓ Minimum reached!</span>
            }
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-gray-700">
            <span>GH₵0</span><span>Min: {fmt(MIN_ORDER)}</span>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🛒</span>
              <p className="text-gray-600 text-sm mt-4">Your cart is empty</p>
              <p className="text-gray-700 text-xs mt-1">Add items from the shop below</p>
            </div>
          ) : cartItems.map(([id, qty]) => {
            const product = PRODUCTS.find(p => p.id === parseInt(id))
            if (!product) return null
            return (
              <div key={id} className="flex items-center gap-3 bg-black/40 border border-yellow-900/20 rounded-xl p-3">
                <span className="text-2xl">{product.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{product.name}</p>
                  <p className="text-yellow-600 text-xs">{fmt(product.price)} × {qty} = <span className="text-yellow-400 font-bold">{fmt(product.price * qty)}</span></p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => onRemove(product.id)} className="w-6 h-6 rounded-lg bg-yellow-950 border border-yellow-800/60 text-yellow-500 font-black text-sm flex items-center justify-center hover:bg-yellow-900/60 active:scale-90 transition-all">−</button>
                  <span className="text-white font-bold text-xs w-4 text-center">{qty}</span>
                  <button onClick={() => onAdd(product.id)} className="w-6 h-6 rounded-lg bg-yellow-500/20 border border-yellow-600/60 text-yellow-400 font-black text-sm flex items-center justify-center hover:bg-yellow-500/30 active:scale-90 transition-all">+</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-yellow-900/30 space-y-3 bg-black/40">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-semibold">Package Total</span>
            <span className="text-yellow-400 font-black text-xl">{fmt(total)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Monthly (÷3)</span>
            <span className="text-gray-400 font-semibold">{fmt(Math.ceil(total / 3))}/mo</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={pct < 100}
            className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${pct >= 100
              ? 'bg-gradient-to-r from-yellow-500 to-amber-400 text-black hover:from-yellow-400 hover:to-amber-300 shadow-lg shadow-yellow-900/40'
              : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed'}`}
          >
            {pct >= 100 ? 'Proceed to Apply →' : `Add ${fmt(remaining)} more to continue`}
          </button>
          {cartItems.length > 0 && (
            <button onClick={onClear} className="w-full py-2 text-gray-700 hover:text-red-500 text-xs transition-colors">Clear cart</button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── SHOP SECTION ─────────────────────────────────────────────────────────────

const ShopSection = ({ cart, onAdd, onRemove, onCartOpen, cartTotal, cartCount }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const pct = Math.min(100, Math.round((cartTotal / MIN_ORDER) * 100))

  return (
    <section id="shop" className="bg-black py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-yellow-600 text-[11px] font-bold tracking-[4px] uppercase mb-3">Custom Order</p>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Georgia,serif' }}>Build Your Own Package</h2>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">Browse our products, add to cart, and we'll create your custom 3-month plan.</p>
        </div>

        {/* Sticky mini cart bar */}
        {cartCount > 0 && (
          <div className="sticky top-[68px] z-30 mb-6 bg-yellow-950/90 backdrop-blur border border-yellow-700/40 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-yellow-300 font-black text-sm whitespace-nowrap">{cartCount} items · {fmt(cartTotal)}</span>
              <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 h-1.5 bg-yellow-900/60 rounded-full overflow-hidden min-w-[80px]">
                  <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-[11px] font-bold whitespace-nowrap ${pct >= 100 ? 'text-green-400' : 'text-yellow-500'}`}>
                  {pct >= 100 ? '✓ Min reached' : `${fmt(Math.max(0, MIN_ORDER - cartTotal))} to go`}
                </span>
              </div>
            </div>
            <button onClick={onCartOpen} className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-xs px-5 py-2 rounded-xl hover:from-yellow-400 hover:to-amber-300 active:scale-95 transition-all whitespace-nowrap flex-shrink-0">
              View Cart ({cartCount})
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-950 border border-yellow-900/40 focus:border-yellow-600 text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all flex-shrink-0 ${activeCategory === cat
                ? 'bg-gradient-to-r from-yellow-500 to-amber-400 text-black'
                : 'bg-gray-950 border border-yellow-900/40 text-gray-400 hover:border-yellow-700/60 hover:text-yellow-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">No products found for "{search}"</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(product => (
              <ProductCard
                key={product.id} product={product}
                qty={cart[product.id] || 0}
                onAdd={() => onAdd(product.id)}
                onRemove={() => onRemove(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── APPLICATION FORM ─────────────────────────────────────────────────────────

const Field = ({ label, name, type = 'text', placeholder, value, onChange, required, note }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-yellow-300 text-xs font-bold tracking-wider uppercase">
      {label} {required && <span className="text-yellow-500">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="bg-black border border-yellow-900/50 focus:border-yellow-500 text-white placeholder-gray-700 rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
    {note && <p className="text-gray-600 text-[11px]">{note}</p>}
  </div>
)

const ApplySection = ({ prefilledPackage, cartTotal, cartItems }) => {
  const hasCustomCart = cartItems.length > 0 && cartTotal >= MIN_ORDER

  const [form, setForm] = useState({
    fullName: '', institution: '', phone: '', email: '',
    staffNumber: '', mandateNumber: '', otpPin: '', ghanaCardNumber: '',
    package: prefilledPackage || '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (prefilledPackage) setForm(f => ({ ...f, package: prefilledPackage }))
  }, [prefilledPackage])

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const cartSummary = cartItems.map(([id, qty]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id))
    return p ? `${p.name} x${qty}` : ''
  }).filter(Boolean).join(', ')

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdnxE_Diy4XQSVR5T52pQKc6FkzNwurabT2qo_cturDZO-WMg/viewform', '_blank')
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 800)
  }

  if (submitted) {
    return (
      <section id="apply" className="bg-black py-20 px-4 border-t border-yellow-950">
        <div className="max-w-3xl mx-auto text-center py-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-950/60 border-2 border-yellow-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-white font-black text-2xl mb-2" style={{ fontFamily: 'Georgia,serif' }}>Application Submitted!</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Your Google Form has been opened. Complete it in the new tab, then WhatsApp us to confirm.</p>
          <a href="https://wa.me/233244854206" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Follow up on WhatsApp
          </a>
          <button onClick={() => setSubmitted(false)} className="block mx-auto mt-4 text-yellow-800 text-xs hover:text-yellow-600 transition-colors">Submit another</button>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="bg-black py-20 px-4 border-t border-yellow-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-600 text-[11px] font-bold tracking-[4px] uppercase mb-3">Get Started</p>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Georgia,serif' }}>Apply Now</h2>
          <p className="text-gray-500 mt-2 text-sm">Fill in your details and we'll process your application.</p>
        </div>

        <div className="bg-gray-950 border border-yellow-900/40 rounded-3xl p-8">
          {/* Custom cart summary */}
          {hasCustomCart && (
            <div className="mb-6 bg-yellow-950/30 border border-yellow-700/40 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-yellow-400 font-black text-sm mb-1">🛒 Your Custom Package</p>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{cartSummary}</p>
                  <p className="text-yellow-400 font-black text-lg mt-2">
                    {fmt(cartTotal)}
                    <span className="text-gray-600 text-xs font-normal ml-2">total · ≈ {fmt(Math.ceil(cartTotal / 3))}/mo</span>
                  </p>
                </div>
                <span className="text-green-400 text-xs font-bold whitespace-nowrap bg-green-950/40 border border-green-800/40 px-2 py-1 rounded-lg flex-shrink-0">✓ Ready</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name (as on Ghana Card)" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Kwame Asante" required />
            <Field label="Institution / Profession" name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. Ghana Health Service" required />
            <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="e.g. 0244000000" required />
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. kwame@email.com" required />
            <Field label="Staff Number / Staff ID" name="staffNumber" value={form.staffNumber} onChange={handleChange} placeholder="Your staff ID" required />
            <Field label="Mandate Number" name="mandateNumber" value={form.mandateNumber} onChange={handleChange} placeholder="Your mandate number" required />
            <Field label="OTP PIN (for Mandate Number)" name="otpPin" value={form.otpPin} onChange={handleChange} placeholder="OTP received" required />
            <Field label="Ghana Card Number" name="ghanaCardNumber" value={form.ghanaCardNumber} onChange={handleChange} placeholder="GHA-000000000-0" required note="Send Ghana Card photo via WhatsApp to 0244854206" />

            {!hasCustomCart && (
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-yellow-300 text-xs font-bold tracking-wider uppercase">Package <span className="text-yellow-500">*</span></label>
                <select name="package" value={form.package} onChange={handleChange} required
                  className="bg-black border border-yellow-900/50 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors">
                  <option value="" disabled>— Select a package —</option>
                  {PACKAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}

            <div className="md:col-span-2 bg-yellow-950/20 border border-yellow-900/30 rounded-xl p-4">
              <p className="text-gray-500 text-xs leading-relaxed">
                By submitting you confirm all details are accurate. LIST "J" Grocery Shop reserves the right to verify your employment and mandate information before processing.
              </p>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-base py-4 rounded-2xl hover:from-yellow-400 hover:to-amber-300 active:scale-95 transition-all shadow-xl shadow-yellow-900/40 disabled:opacity-60">
                {submitting ? 'Opening Form...' : 'Submit Application →'}
              </button>
              <p className="text-center text-gray-700 text-xs mt-3">
                Complete the form that opens, then WhatsApp <a href="https://wa.me/233244854206" className="text-yellow-700 hover:text-yellow-500">0244854206</a> to confirm.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── WHATSAPP FLOAT ───────────────────────────────────────────────────────────

const WhatsAppFloat = () => {
  const [showLabel, setShowLabel] = useState(true)

  // Hide the label after 4 seconds
  useEffect(() => {
    const id = setTimeout(() => setShowLabel(false), 4000)
    return () => clearTimeout(id)
  }, [])

  return (
    <a
      href="https://wa.me/233244854206?text=Hello%20List%20J!%20I%27m%20interested%20in%20the%203-month%20grocery%20plan."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip label */}
      <div className={`bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap transition-all duration-500 ${showLabel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'} group-hover:opacity-100 group-hover:translate-x-0`}>
        Chat with us 💬
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-white" />
      </div>

      {/* Button */}
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-xl shadow-green-900/50 hover:scale-110 active:scale-95 transition-all duration-200">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm0 25.471a11.433 11.433 0 0 1-5.833-1.597l-.418-.248-4.332 1.042 1.075-4.217-.273-.433A11.432 11.432 0 0 1 4.53 16c0-6.33 5.142-11.471 11.471-11.471S27.471 9.67 27.471 16c0 6.33-5.142 11.471-11.47 11.471zm6.29-8.583c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z" />
        </svg>
      </div>
    </a>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-black border-t border-yellow-950 py-10 px-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <LogoMark size={34} />
        <div>
          <p className="text-yellow-400 font-black tracking-widest uppercase text-sm" style={{ fontFamily: 'Georgia,serif' }}>List "J" Grocery Shop</p>
          <p className="text-gray-700 text-[11px]">Hire purchase & crediting of groceries</p>
        </div>
      </div>
      <p className="text-gray-700 text-xs text-center">Open to all government workers in Ghana · Super 3 months plan — feast in comfort!</p>
      <div className="flex flex-col items-end gap-1 text-xs">
        <a href="https://wa.me/233244854206" className="text-yellow-600 hover:text-yellow-400 font-semibold">💬 0244854206</a>
        <p className="text-gray-800">© 2025 List J Grocery Shop</p>
      </div>
    </div>
  </footer>
)

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [prefilledPackage, setPrefilledPackage] = useState('')

  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))

  const removeFromCart = (id) => setCart(prev => {
    const qty = (prev[id] || 0) - 1
    if (qty <= 0) { const next = { ...prev }; delete next[id]; return next }
    return { ...prev, [id]: qty }
  })

  const clearCart = () => setCart({})

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id))
    return sum + (p ? p.price * qty : 0)
  }, 0)

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0)

  const scrollToApply = () => {
    setCartOpen(false)
    setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 150)
  }

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }

  const applyWithPackage = (pkg) => {
    setPrefilledPackage(pkg)
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black font-sans">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onApply={scrollToApply} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        onCheckout={scrollToApply}
        total={cartTotal}
      />

      <Hero onShop={scrollToShop} onApply={scrollToApply} />
      <FixedPackages onApplyWithPackage={applyWithPackage} />
      <ShopSection
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onCartOpen={() => setCartOpen(true)}
        cartTotal={cartTotal}
        cartCount={cartCount}
      />
      <ApplySection
        prefilledPackage={prefilledPackage}
        cartTotal={cartTotal}
        cartItems={cartItems}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
