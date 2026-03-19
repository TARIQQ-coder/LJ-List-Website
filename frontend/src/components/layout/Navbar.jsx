import { useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_CATEGORIES = [
  'Groceries', 'Detergents', 'Rice & Grains', 'Cooking Oil',
  'Beverages', 'Snacks', 'Baby Care', 'Personal Care',
]

const Navbar = () => {
  const [search, setSearch] = useState('')
  const cartCount = 3

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-red-700 text-white text-xs py-1.5 px-4 text-center font-medium">
        🚚 Free delivery on orders above ₵200 in Accra &nbsp;|&nbsp; Pay with MoMo 📱
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-black text-base">M</span>
          </div>
          <div className="hidden sm:block leading-none">
            <span className="font-black text-gray-900 text-lg">Mart</span>
            <span className="font-black text-red-600 text-lg">Ghana</span>
          </div>
        </Link>

        {/* Location picker */}
        <button className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:border-red-300 transition-colors shrink-0">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Accra</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Search bar */}
        <div className="flex-1 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groceries, detergents, rice..."
            className="w-full border-2 border-gray-200 focus:border-red-500 rounded-xl pl-4 pr-12 py-2.5 text-sm outline-none transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden sm:flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors px-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Account</span>
          </button>

          <button className="hidden sm:flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors px-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px] font-medium">Wishlist</span>
          </button>

          <Link to="/cart" className="relative flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors px-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-0 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2 min-w-max">
          <button className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All Categories
          </button>
          {NAV_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Navbar
