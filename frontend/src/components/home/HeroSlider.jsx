import { useState, useEffect } from 'react'

const SLIDES = [
  {
    tag: 'Fresh Arrivals',
    headline: "Shop Ghana's\nFreshest Groceries",
    sub: 'Delivered to your door — pay with MoMo or cash.',
    cta: 'Shop Now',
    badge: 'Up to 30% off',
    bg: 'from-red-700 to-red-900',
    img: '🛒',
  },
  {
    tag: 'Top Deals',
    headline: 'Premium\nDetergents & Cleaning',
    sub: 'Keep your home spotless with top brands at best prices.',
    cta: 'View Deals',
    badge: 'Buy 2 Get 1 Free',
    bg: 'from-red-600 to-rose-800',
    img: '🧴',
  },
  {
    tag: 'Flash Sale',
    headline: 'Wholesale\nPrices on Rice & Oil',
    sub: 'Stock up on staples — bulk orders available nationwide.',
    cta: 'Grab Deals',
    badge: 'Limited Time',
    bg: 'from-red-800 to-red-950',
    img: '🌾',
  },
]

const HeroSlider = () => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  const slide = SLIDES[active]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${slide.bg} transition-all duration-700 min-h-80 md:min-h-80 flex items-center`}
    >
      {/* Dot grid background texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full px-8 md:px-14 py-10 gap-6">
        {/* Text content */}
        <div className="flex-1 text-white">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-4">
            {slide.tag}
          </span>
          <h1
            className="text-3xl md:text-5xl font-black leading-tight whitespace-pre-line mb-3"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
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

        {/* Emoji illustration */}
        <div
          className="text-[120px] md:text-[160px] select-none leading-none drop-shadow-2xl animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          {slide.img}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
