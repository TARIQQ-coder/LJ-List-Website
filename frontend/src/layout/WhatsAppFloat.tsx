import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const WhatsAppFloat = ({ user }: { user?: any }) => {
  const navigate    = useNavigate()
  const [open, setOpen]   = useState(false)
  const [pulse, setPulse] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = !!user

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler) }
  }, [open])

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/profile/messages')
    } else {
      setOpen(o => !o)
    }
  }

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {!isLoggedIn && (
        <div className={`w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="bg-gray-900 px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-sm">List "J" Support</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <p className="text-gray-400 text-xs">We reply within a few hours</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white p-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="px-5 py-5 text-center">
            <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <p className="text-gray-900 font-black text-sm mb-1">Sign in to message us</p>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">Create a free account to chat with our team about your order or application.</p>
            <button onClick={() => { setOpen(false); navigate('/auth/login') }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black text-sm py-2.5 rounded-xl transition-all active:scale-95 mb-3">
              Sign In / Register
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-300 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I%27m%20interested%20in%20your%20grocery%20plan."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-green-300 text-gray-600 hover:text-green-700 text-sm font-semibold py-2.5 rounded-xl transition-all">
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-green-500 shrink-0">
                <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm6.29 20.888c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z"/>
              </svg>
              WhatsApp instead
            </a>
          </div>
        </div>
      )}
      <button onClick={handleClick}
        className="relative w-14 h-14 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
        aria-label="Open chat">
        {pulse && !open && <span className="absolute inset-0 rounded-full bg-gray-900 animate-ping opacity-30" />}
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
    </div>
  )
}
