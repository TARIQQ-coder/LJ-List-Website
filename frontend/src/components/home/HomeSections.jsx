import ProductCard from '../product/ProductCard'

// ─── TRUST BAR ────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: '🚚', title: 'Nationwide Delivery', sub: 'Accra, Kumasi & more' },
  { icon: '📱', title: 'MoMo Payments', sub: 'MTN, Vodafone, AirtelTigo' },
  { icon: '↩️', title: 'Easy Returns', sub: '7-day return policy' },
  { icon: '🔒', title: 'Secure Checkout', sub: '100% safe & encrypted' },
]

export const TrustBar = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {TRUST_ITEMS.map((item) => (
      <div key={item.title} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4">
        <span className="text-2xl">{item.icon}</span>
        <div>
          <p className="text-sm font-bold text-gray-800">{item.title}</p>
          <p className="text-[11px] text-gray-400">{item.sub}</p>
        </div>
      </div>
    ))}
  </div>
)

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Groceries', emoji: '🥦', color: 'bg-green-50 border-green-200', text: 'text-green-700' },
  { name: 'Detergents', emoji: '🫧', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  { name: 'Rice & Grains', emoji: '🌾', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  { name: 'Cooking Oil', emoji: '🫙', color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' },
  { name: 'Beverages', emoji: '🥤', color: 'bg-red-50 border-red-200', text: 'text-red-700' },
  { name: 'Snacks', emoji: '🍪', color: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  { name: 'Baby Care', emoji: '🍼', color: 'bg-pink-50 border-pink-200', text: 'text-pink-700' },
  { name: 'Personal Care', emoji: '🪥', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
]

export const Categories = () => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
      <button className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
        All categories
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${cat.color} hover:scale-105 active:scale-95 transition-all duration-200`}
        >
          <span className="text-3xl">{cat.emoji}</span>
          <span className={`text-[11px] font-semibold text-center leading-tight ${cat.text}`}>
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  </section>
)

// ─── MINI BANNERS ─────────────────────────────────────────────────────────────

const BANNERS = [
  { label: 'Buy More, Save More', sub: '5% off orders above ₵500', emoji: '📦', bg: 'bg-amber-400', text: 'text-amber-900' },
  { label: 'Free Delivery', sub: 'On orders above ₵200 in Accra', emoji: '🚚', bg: 'bg-green-400', text: 'text-green-900' },
  { label: 'Pay with MoMo', sub: 'MTN, Vodafone, AirtelTigo', emoji: '📱', bg: 'bg-blue-400', text: 'text-blue-900' },
]

export const MiniBanners = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {BANNERS.map((b) => (
      <div
        key={b.label}
        className={`${b.bg} rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity`}
      >
        <span className="text-3xl">{b.emoji}</span>
        <div>
          <p className={`font-black text-sm ${b.text}`}>{b.label}</p>
          <p className={`text-xs ${b.text} opacity-80`}>{b.sub}</p>
        </div>
      </div>
    ))}
  </div>
)

// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────

const FEATURED = [
  { id: 7,  name: 'Sunlight Dishwashing Liquid 750ml', price: 28, oldPrice: 38, img: '🫧', rating: 4.8, reviews: 312 },
  { id: 8,  name: 'Cowbell Milk Powder 400g',          price: 62, oldPrice: 80, img: '🥛', rating: 4.6, reviews: 187 },
  { id: 9,  name: 'Indomie Instant Noodles (40 pcs)',  price: 95, oldPrice: 115, img: '🍜', rating: 4.9, reviews: 524 },
  { id: 10, name: 'Afia Tomato Paste 70g ×12',         price: 72, oldPrice: 90,  img: '🍅', rating: 4.7, reviews: 298 },
  { id: 11, name: 'Morning Fresh Detergent 2L',         price: 55, oldPrice: 75,  img: '🧴', rating: 4.5, reviews: 143 },
  { id: 12, name: 'Tasty Tom Tomato Stew Base',         price: 45, oldPrice: 60,  img: '🥫', rating: 4.8, reviews: 411 },
  { id: 13, name: 'Eva Table Water 1.5L ×12',           price: 42, oldPrice: 55,  img: '💧', rating: 4.7, reviews: 205 },
  { id: 14, name: 'Ariel Automatic 1.5kg',              price: 78, oldPrice: 100, img: '🌊', rating: 4.6, reviews: 167 },
]

export const FeaturedProducts = () => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-black text-gray-900">🛍️ Featured Products</h2>
      <button className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
        View all
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {FEATURED.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
)
