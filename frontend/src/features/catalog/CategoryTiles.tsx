import { SectionTitle } from '../../layout/SectionTitle'

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
export const CategoryTiles = ({ onCatClick, categories = [] }: any) => (
  <section className="bg-white py-6 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto">
      <SectionTitle label="Shop by Department" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map(cat => {
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
