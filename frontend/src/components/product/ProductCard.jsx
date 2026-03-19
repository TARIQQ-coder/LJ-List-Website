import { useState } from 'react'
import Stars from '../ui/Stars'

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image area */}
      <div className="relative bg-gray-50 flex items-center justify-center h-40">
        <span className="text-6xl select-none">{product.img}</span>

        {/* Discount badge */}
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </span>

        {/* Optional tag */}
        {product.tag && (
          <span className="absolute top-2 right-10 bg-amber-400 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4 h-4 ${wished ? 'text-red-500' : 'text-gray-400'}`}
            fill={wished ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[11px] text-gray-400">({product.reviews})</span>
          </div>
        )}

        {/* Flash sale sold progress bar */}
        {product.sold !== undefined && (
          <div className="mt-1">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-red-500 to-orange-400 rounded-full"
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
              ? 'bg-green-500 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
          }`}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
