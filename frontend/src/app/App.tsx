import { useState, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  profile as profileApi,
  products as productsApi,
  packages as packagesApi,
} from '../api'
import { normalizeApiCategory, normalizeApiProduct, normalizeFixedPackage, packageOptionFor } from '../utils/catalog'

import { Navbar } from '../layout/Navbar'
import { Hero } from '../layout/Hero'
import { TrustBar } from '../layout/TrustBar'
import { PromoStrip } from '../layout/PromoStrip'
import { WhatsAppFloat } from '../layout/WhatsAppFloat'
import { Footer } from '../layout/Footer'
import { AuthLoginPage, AuthOtpVerifyPage, AuthRegisterPage } from '../features/auth/ClientAuthPage'
import { ClientAccountPage } from '../features/account/ClientAccountPage'
import { ApplicationDetailPage } from '../features/account/ApplicationDetailPage'
import { ProductRoutePage } from '../features/catalog/ProductRoutePage'
import { FeaturedGrid } from '../features/catalog/FeaturedGrid'
import { ShopSection } from '../features/catalog/ShopSection'
import { PackageDetail } from '../features/packages/PackageDetail'
import { FixedPackages } from '../features/packages/FixedPackages'
import { CartPage, CartDrawer } from '../features/cart/CartViews'
import { ApplySection } from '../features/checkout/ApplySection'
import { fmt } from '../utils/format'

let catalogPromise: Promise<any> | null = null
let profilePromise: Promise<any> | null = null

const loadCatalogOnce = () => {
  if (!catalogPromise) {
    catalogPromise = Promise.allSettled([
      productsApi.categories(),
      productsApi.list({ limit: 100 }),
      packagesApi.catalog(),
      packagesApi.fixed(),
      packagesApi.provisions(),
      packagesApi.detergents(),
    ])
  }
  return catalogPromise
}

const loadProfileOnce = () => {
  if (!profilePromise) profilePromise = profileApi.get()
  return profilePromise
}


// ─── LOGO ─────────────────────────────────────────────────────────────────────
// ─── NAVBAR ───────────────────────────────────────────────────────────────────
// ─── AUTH FIELD (shared input — defined outside components to prevent remount) ──
// ─── CLIENT ACCOUNT PAGE ──────────────────────────────────────────────────────
// ─── HERO ─────────────────────────────────────────────────────────────────────
// ─── TRUST BAR ────────────────────────────────────────────────────────────────
// ─── CATEGORY BANNER DATA ────────────────────────────────────────────────────
// Each category gets a background colour + up to 3 product images to display.
// As you add real images to public/images/, slot them in here.
// ─── SECTION TITLE helper ─────────────────────────────────────────────────────
// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
// ─── FEATURED GRID (3 rows of mixed products — GH Basket style) ───────────────
// Pick 2 products from each category, shuffle them into a single flat grid.
// 3 rows × 6 columns = 18 cards on desktop, 3 rows × 2 cols = 18 on mobile.
// ─── PROMO STRIP ──────────────────────────────────────────────────────────────
// ─── PACKAGE DETAIL PAGE ──────────────────────────────────────────────────────
// ─── FIXED PACKAGES ───────────────────────────────────────────────────────────
// ─── DEPT PACKAGE SECTION (provisions & detergents — full card style) ────────
// ─── FULL CART PAGE (GH Basket style) ────────────────────────────────────────
// ─── APPLY FORM ───────────────────────────────────────────────────────────────
// ─── WHATSAPP BUTTON ──────────────────────────────────────────────────────────
// ─── FOOTER ───────────────────────────────────────────────────────────────────
// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate()
  // ── Store state ────────────────────────────────────────────────────────────
  const [user, setUser] = useState<any>(null)

  const [categories, setCategories] = useState<any[]>([])
  const [liveProducts, setLiveProducts] = useState<any[]>([])
  const [fixedPackages, setFixedPackages] = useState<any[]>([])
  const [provisionPackages, setProvisionPackages] = useState<any[]>([])
  const [detergentPackages, setDetergentPackages] = useState<any[]>([])
  const [packageOptions, setPackageOptions] = useState<string[]>([])
  const [minOrder, setMinOrder] = useState(0)
  const [productsLoading, setProductsLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadCatalog = async () => {
      setProductsLoading(true)
      try {
        const [
          categoryResult,
          productResult,
          packageResult,
          fixedPackagesResult,
          provisionsPackagesResult,
          detergentPackagesResult,
        ] = await loadCatalogOnce()

        const apiCategories = categoryResult.status === 'fulfilled' ? categoryResult.value.categories || [] : []
        const nextCategories = apiCategories.map(normalizeApiCategory)

        const apiProducts = productResult.status === 'fulfilled' ? productResult.value.products || [] : []
        const nextProducts = apiProducts.map(product => normalizeApiProduct(product, nextCategories))

        const packageCatalog: any = packageResult.status === 'fulfilled' ? packageResult.value : {}
        const apiFixedFromEndpoint =
          fixedPackagesResult.status === 'fulfilled' ? fixedPackagesResult.value.fixed_packages || [] : []
        const apiProvisionsFromEndpoint =
          provisionsPackagesResult.status === 'fulfilled' ? provisionsPackagesResult.value.provisions_packages || [] : []
        const apiDetergentsFromEndpoint =
          detergentPackagesResult.status === 'fulfilled' ? detergentPackagesResult.value.detergent_packages || [] : []

        const apiFixed = apiFixedFromEndpoint.length > 0 ? apiFixedFromEndpoint : packageCatalog.fixed_packages || packageCatalog.fixedPackages || []
        const apiProvisions = apiProvisionsFromEndpoint.length > 0 ? apiProvisionsFromEndpoint : packageCatalog.provisions_packages || packageCatalog.provisionsPackages || []
        const apiDetergents = apiDetergentsFromEndpoint.length > 0 ? apiDetergentsFromEndpoint : packageCatalog.detergent_packages || packageCatalog.detergentPackages || []

        const nextFixedPackages = apiFixed.map(normalizeFixedPackage)
        const generatedOptions = nextFixedPackages.map(packageOptionFor)
        const apiPackageOptions = packageCatalog.package_options || packageCatalog.packageOptions || []
        const nextPackageOptions =
          apiPackageOptions.length > 1
            ? apiPackageOptions
            : [...generatedOptions, ...apiPackageOptions]

        if (!mounted) return
        setCategories(nextCategories)
        setLiveProducts(nextProducts)
        setFixedPackages(nextFixedPackages)
        setProvisionPackages(apiProvisions)
        setDetergentPackages(apiDetergents)
        setPackageOptions(nextPackageOptions)
        setMinOrder(packageCatalog.min_order || packageCatalog.minOrder || 0)
      } finally {
        if (mounted) setProductsLoading(false)
      }
    }

    loadCatalog()
    return () => { mounted = false }
  }, [])

  // Derived: featured products — first 18 from live list across all categories
  const featuredProducts = (() => {
    const seen = new Set()
    const result = []
    for (const cat of categories.map(c => c.id)) {
      const catItems = liveProducts.filter(p => p.cat === cat).slice(0, 3)
      catItems.forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); result.push(p) } })
      if (result.length >= 18) break
    }
    return result.slice(0, 18)
  })()
  const [cart, setCart]                       = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen]               = useState(false)
  const [prefilled, setPrefilled]             = useState('')
  const [shopCat, setShopCat]                 = useState('all')
  const [searchQuery, setSearchQuery]         = useState('')

  useEffect(() => {
    let mounted = true
    setProfileLoading(true)
    loadProfileOnce().then(data => {
      if (!mounted || !data.user) return
      setUser(data.user)
    }).catch(() => {
      if (mounted) setUser(null)
    }).finally(() => {
      if (mounted) setProfileLoading(false)
    })
    return () => { mounted = false }
  }, [])

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

  // Helper — find product by id from live products (handles both UUID strings and legacy numeric ids)
  const findProduct = (id) => liveProducts.find(p => p.id === id || p.legacyId === Number(id) || p.id === Number(id))

  const cartTotal = Object.entries(cart).reduce((s, [id, q]) => {
    const p = findProduct(id)
    return s + (p?.price ? p.price * q : 0)
  }, 0)
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0)

  const goToProduct = (product: any) => {
    navigate(`/products/${product.id}`)
    window.scrollTo(0, 0)
  }
  const goToPackage = (pkg: any) => {
    navigate(`/packages/${pkg.id}`)
    window.scrollTo(0, 0)
  }
  const goToCart = () => {
    navigate('/cart')
    window.scrollTo(0, 0)
  }

  const scrollHome = (id: string, delay = 100) => {
    navigate('/')
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), delay)
  }
  const toApply = () => { setCartOpen(false); scrollHome('apply', 150) }
  const toShop  = (cat = 'all') => { setShopCat(cat); scrollHome('shop', 80) }
  const applyWithPkg = pkg => { setPrefilled(pkg); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }) }
  const viewProduct = (product) => goToProduct(product)
  const viewPackage = (pkg) => goToPackage(pkg)

  const refreshUserFromApi = async (fallbackUser?: any) => {
    if (fallbackUser) setUser(fallbackUser)
    profilePromise = null
    try {
      const data = await loadProfileOnce()
      setUser(data.user || null)
    } catch {
      setUser(fallbackUser || null)
    }
  }

  const logoutUser = () => {
    profilePromise = null
    setUser(null)
  }

  const CartRoute = () => (
    <CartPage
      cart={cart}
      onAdd={addToCart}
      onRemove={removeFromCart}
      onClear={removeAllFromCart}
      onBack={() => navigate('/')}
      onShop={() => toShop()}
      onCheckout={() => toApply()}
      cartCount={cartCount}
      onCartOpen={goToCart}
      allProducts={liveProducts}
      minOrder={minOrder}
      onDeptClick={(catId) => toShop(catId)}
      user={user}
      onAccountClick={() => navigate(user ? '/profile' : '/auth/login')}
    />
  )

  const PackageRoute = () => {
    const { packageId } = useParams()
    const pkg = fixedPackages.find(pk => String(pk.id) === packageId)
    if (!pkg) return <Navigate to="/" replace />
    const idx = fixedPackages.findIndex(pk => pk.id === pkg.id)
    return (
      <PackageDetail
        pkg={pkg}
        idx={idx}
        packageOptions={packageOptions}
        allProducts={liveProducts}
        onBack={() => navigate('/')}
        onApply={(pkgOption) => {
          setPrefilled(pkgOption)
          scrollHome('apply', 150)
        }}
      />
    )
  }

  const RouteViews = () => (
    <Routes>
      <Route path="/" element={<StoreHome />} />
      <Route path="/auth/login" element={<AuthLoginPage onSuccess={refreshUserFromApi} />} />
      <Route path="/auth/register" element={<AuthRegisterPage onSuccess={refreshUserFromApi} />} />
      <Route path="/auth/otp-verify" element={<AuthOtpVerifyPage onSuccess={refreshUserFromApi} />} />
      <Route path="/profile" element={<ClientAccountPage user={user} loading={profileLoading} section="overview" onLogout={logoutUser} onApply={toApply} onUserChange={refreshUserFromApi} />} />
      <Route path="/profile/applications" element={<ClientAccountPage user={user} loading={profileLoading} section="applications" onLogout={logoutUser} onApply={toApply} onUserChange={refreshUserFromApi} />} />
      <Route path="/profile/application/:applicationId" element={<ApplicationDetailPage user={user} loading={profileLoading} />} />
      <Route path="/profile/applications/:applicationId" element={<ApplicationDetailPage user={user} loading={profileLoading} />} />
      <Route path="/profile/messages" element={<ClientAccountPage user={user} loading={profileLoading} section="messages" onLogout={logoutUser} onApply={toApply} onUserChange={refreshUserFromApi} />} />
      <Route path="/products/:productId" element={
        <ProductRoutePage
          liveProducts={liveProducts}
          categories={categories}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cartCount={cartCount}
          goToCart={goToCart}
          toShop={toShop}
          user={user}
          onAccountClick={() => navigate(user ? '/profile' : '/auth/login')}
          setLiveProducts={setLiveProducts}
        />
      } />
      <Route path="/packages/:packageId" element={<PackageRoute />} />
      <Route path="/cart" element={<CartRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  const StoreHome = () => (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar cartCount={cartCount} onCartOpen={goToCart} onApply={toApply}
        onSearch={setSearchQuery}
        user={user}
        categories={categories}
        onAccountClick={() => navigate(user ? '/profile' : '/auth/login')}
        onDeptClick={(catId) => {
          setSearchQuery('')
          if (catId === 'packages') { scrollHome('packages') }
          else { setShopCat(catId); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 80) }
        }} />

      {/* Live search results */}
      {searchQuery && (() => {
        const results = liveProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery) ||
          categories.find(c => c.id === p.cat)?.label.toLowerCase().includes(searchQuery)
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
                    const cat = categories.find(c => c.id === p.cat)
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
        onClear={clearCart} onCheckout={toApply} total={cartTotal}
        allProducts={liveProducts}
        minOrder={minOrder} />

      <Hero onShop={() => toShop()} />
      <TrustBar />


      {/* Packages shown first after homepage */}
      <FixedPackages onApplyWithPackage={applyWithPkg} onViewPackage={viewPackage} packages={fixedPackages} packageOptions={packageOptions} />

      {/* 3 rows of mixed featured products — GH Basket style */}
      <FeaturedGrid cart={cart} onAdd={addToCart} onRemove={removeFromCart} onShop={() => toShop()} onView={viewProduct} products={featuredProducts} />

      <PromoStrip onApply={toApply} onShop={() => toShop()} />
      <ShopSection cart={cart} onAdd={addToCart} onRemove={removeFromCart}
        onCartOpen={goToCart}
        cartTotal={cartTotal} cartCount={cartCount}
        onView={viewProduct} defaultCat={shopCat}
        products={liveProducts}
        productsLoading={productsLoading}
        categories={categories}
        minOrder={minOrder}
        provisionPackages={provisionPackages}
        detergentPackages={detergentPackages}
        onApply={(pkgName) => { setPrefilled(pkgName); setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 100) }} />
      <ApplySection user={user} prefilledPackage={prefilled} cartTotal={cartTotal} cartItems={cartItems} allProducts={liveProducts} packageOptions={packageOptions} minOrder={minOrder} onAuthRequired={() => navigate('/auth/login')} />
      <Footer />
      <WhatsAppFloat />
    </div>
  )

  return (
    <>
      <RouteViews />
    </>
  )
}
