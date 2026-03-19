import { useState, useEffect, useRef } from 'react'
import ProductCard from '../product/ProductCard'

const FLASH_DEALS = [
  { id: 1, name: "Mama's Choice Detergent 5kg", price: 85, oldPrice: 120, img: '🧺', sold: 78, total: 100, tag: 'Bestseller' },
  { id: 2, name: 'Golden Penny Rice 25kg Bag', price: 220, oldPrice: 280, img: '🌾', sold: 45, total: 60, tag: 'Bulk Save' },
  { id: 3, name: 'Frytol Vegetable Oil 5L', price: 110, oldPrice: 145, img: '🫙', sold: 60, total: 80, tag: 'Hot' },
  { id: 4, name: 'Omo Washing Powder 2kg', price: 48, oldPrice: 65, img: '🫧', sold: 90, total: 100, tag: 'Almost Gone' },
  { id: 5, name: 'Milo Cocoa Drink 400g', price: 55, oldPrice: 72, img: '🍫', sold: 30, total: 50, tag: 'Popular' },
  { id: 6, name: 'Dettol Antiseptic 500ml', price: 38, oldPrice: 55, img: '🧴', sold: 55, total: 70, tag: 'Essential' },
]

const pad = (n) => String(n).padStart(2, '0')

const FlashSale = () => {
  const endTime = useRef(Date.now() + 5 * 3600 * 1000)
  const [time, setTime] = useState({ h: 5, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime.current - Date.now())
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-black text-gray-900">Flash Deals</h2>
          <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold tabular-nums">
            <span>{pad(time.h)}</span>
            <span className="opacity-60 animate-pulse">:</span>
            <span>{pad(time.m)}</span>
            <span className="opacity-60 animate-pulse">:</span>
            <span>{pad(time.s)}</span>
          </div>
        </div>
        <button className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
          See all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {FLASH_DEALS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default FlashSale
