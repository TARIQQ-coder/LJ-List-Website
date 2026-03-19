import { Link } from 'react-router-dom'

const Footer = () => {
  const columns = [
    {
      title: 'Quick Links',
      links: ['Home', 'Flash Sales', 'New Arrivals', 'Best Sellers', 'Track Order'],
    },
    {
      title: 'Categories',
      links: ['Groceries', 'Detergents', 'Rice & Grains', 'Beverages', 'Baby Care'],
    },
    {
      title: 'Support',
      links: ['Contact Us', 'FAQs', 'Return Policy', 'Privacy Policy', 'Terms of Service'],
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand col */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="font-black text-white text-lg">MartGhana</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Ghana's trusted online store for groceries, detergents and household essentials.
          </p>
          <div className="flex gap-3 mt-4">
            {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
              <button
                key={i}
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-white mb-4 text-sm">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((label) => (
                <li key={label}>
                  <Link to="#" className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p className="text-xs text-gray-500">© 2025 MartGhana. All rights reserved.</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>We accept:</span>
          <span className="bg-gray-800 px-2 py-1 rounded font-medium">MoMo 📱</span>
          <span className="bg-gray-800 px-2 py-1 rounded font-medium">Visa 💳</span>
          <span className="bg-gray-800 px-2 py-1 rounded font-medium">Cash 💵</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
