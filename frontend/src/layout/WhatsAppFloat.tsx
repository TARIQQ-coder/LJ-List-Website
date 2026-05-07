import { useEffect, useState } from 'react'

export const WhatsAppFloat = () => {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShow(false), 4000); return () => clearTimeout(t) }, [])
  return (
    <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'm%20interested%20in%20the%203-month%20grocery%20plan."
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group" aria-label="WhatsApp">
      <div className={`bg-white text-gray-700 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} group-hover:opacity-100`}>
        Chat with us 💬
      </div>
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1eb85a] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm0 25.471a11.433 11.433 0 0 1-5.833-1.597l-.418-.248-4.332 1.042 1.075-4.217-.273-.433A11.432 11.432 0 0 1 4.53 16c0-6.33 5.142-11.471 11.471-11.471S27.471 9.67 27.471 16c0 6.33-5.142 11.471-11.47 11.471zm6.29-8.583c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z"/>
        </svg>
      </div>
    </a>
  )
}


