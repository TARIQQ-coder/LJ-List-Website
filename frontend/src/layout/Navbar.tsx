import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoMark } from './LogoMark'

export const Navbar = ({
  cartCount, onCartOpen, onApply, onDeptClick, onSearch,
  onAccountClick, onLogout, user, categories = []
}: any) => {
  const [search, setSearch]         = useState('')
  const [dropdownOpen, setDropdown] = useState(false)
  const dropdownRef                 = useRef<HTMLDivElement>(null)
  const location                    = useLocation()
  const navigate                    = useNavigate()

  const handleSearch = (val: string) => {
    setSearch(val)
    if (onSearch) onSearch(val.trim().toLowerCase())
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) onSearch(search.trim().toLowerCase())
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [dropdownOpen])

  // Account section tabs — shown in navbar when user is logged in
  const accountTabs = [
    { label: 'Overview',     href: '/profile' },
    { label: 'Applications', href: '/profile/applications' },
    { label: 'Messages',     href: '/profile/messages' },
  ]

  // Profile sub-nav also includes Settings tab (only shown in the sticky sub-nav, not dropdown)
  const allAccountTabs = [
    { label: 'Overview',     href: '/profile' },
    { label: 'Applications', href: '/profile/applications' },
    { label: 'Messages',     href: '/profile/messages' },
    { label: 'Profile',      href: '/profile/settings' },
  ]

  const isAccountSection = location.pathname.startsWith('/profile')
  const displayName      = user?.display_name || user?.name || ''
  const firstName        = displayName.split(' ')[0]
  const initial          = displayName.charAt(0).toUpperCase()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gray-900 text-amber-400 py-2 text-center tracking-widest font-black text-xs sm:text-sm uppercase">
        🛒 Buy Groceries in Bulk and Pay Within 3 Months
      </div>

      {/* ── Main nav row ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <LogoMark size={36} />
          <div className="hidden sm:block leading-tight">
            <p className="font-black text-gray-900 text-base leading-none">
              List <span className="text-amber-500">"J"</span>
            </p>
            <p className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase">
              Grocery Shop
            </p>
          </div>
        </Link>

        {/* Search — fills remaining space */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search rice, oil, sardines, chicken..."
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none transition-all"
          />
          {search && (
            <button onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg leading-none">
              ×
            </button>
          )}
        </div>

        {/* Right side icons — evenly spaced */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* ── Logged out: Sign In link ── */}
          {!user && (
            <button onClick={onAccountClick}
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-[10px] font-semibold">Sign In</span>
            </button>
          )}

          {/* ── Logged in: avatar + dropdown ── */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdown(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
              >
                {/* Avatar circle */}
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-black text-sm flex-shrink-0">
                  {initial}
                </div>
                {/* Name */}
                <div className="hidden sm:block text-left">
                  <p className="text-gray-900 text-xs font-black leading-tight max-w-[80px] truncate">
                    {firstName}
                  </p>
                  <p className="text-gray-400 text-[10px] leading-tight">My Account</p>
                </div>
                {/* Chevron */}
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-black text-base flex-shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 font-black text-sm truncate">{displayName}</p>
                        <p className="text-gray-400 text-xs truncate">{user.phone_number || user.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account section links with icons */}
                  <div className="py-1.5">
                    {[
                      { label: 'Overview', href: '/profile', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> },
                      { label: 'Applications', href: '/profile/applications', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/> },
                      { label: 'Messages', href: '/profile/messages', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/> },
                    ].map(tab => (
                      <Link
                        key={tab.href}
                        to={tab.href}
                        onClick={() => setDropdown(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          location.pathname === tab.href
                            ? 'bg-amber-50 text-amber-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {tab.icon}
                        </svg>
                        <span>{tab.label}</span>
                        {location.pathname === tab.href && (
                          <span className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Apply + Sign Out */}
                  <div className="border-t border-gray-100 p-2 space-y-1">
                    <button
                      onClick={() => { setDropdown(false); onApply() }}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xs py-2 rounded-xl transition-colors">
                      Apply Now
                    </button>
                    <Link
                      to="/profile/settings"
                      onClick={() => setDropdown(false)}
                      className="flex items-center justify-center gap-2 w-full text-xs text-gray-500 hover:text-gray-800 py-1.5 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdown(false)
                        if (onLogout) onLogout()
                      }}
                      className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-600 py-1.5 transition-colors hover:bg-red-50 rounded-xl">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <button onClick={onCartOpen}
            className="relative flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span className="text-[10px] font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Apply Now — hidden when user is logged in (it's in the dropdown) */}
          {!user && (
            <button onClick={onApply}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm uppercase tracking-wider">
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* ── Account section sub-nav (shown when on /profile/* routes) ── */}
      {user && isAccountSection && (
        <div className="border-t border-amber-100 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-0">
            {allAccountTabs.map(tab => (
              <Link
                key={tab.href}
                to={tab.href}
                className={`px-5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  location.pathname === tab.href
                    ? 'border-amber-500 text-gray-900'
                    : 'border-transparent text-amber-700 hover:text-gray-900 hover:border-amber-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <div className="flex-1" />
            <span className="text-amber-600 text-xs font-semibold pr-2 hidden sm:block">
              {displayName}
            </span>
          </div>
        </div>
      )}

      {/* ── Department category strip (shown on storefront pages) ── */}
      {!isAccountSection && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
            <div className="flex items-center gap-2 py-2 min-w-max">
              <button
                onClick={() => onDeptClick && onDeptClick('all')}
                className="shrink-0 flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                All
              </button>
              <button
                onClick={() => onDeptClick && onDeptClick('packages')}
                className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
                Packages
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => onDeptClick && onDeptClick(cat.id)}
                  className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
