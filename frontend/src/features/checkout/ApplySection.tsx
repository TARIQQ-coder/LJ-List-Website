import { useEffect, useState } from 'react'
import { applications as applicationsApi } from '../../api'
import { SectionTitle } from '../../layout/SectionTitle'
import { fmt } from '../../utils/format'

export const Field = ({ label, name, type = 'text', placeholder, value, onChange, required, note }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="bg-white border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-gray-800 placeholder-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
    {note && <p className="text-gray-400 text-[11px]">{note}</p>}
  </div>
)

export const ApplySection = ({ user, prefilledPackage, cartTotal, cartItems, allProducts = [], packageOptions = [], minOrder = 0, onAuthRequired }: any) => {
  const hasCustomCart = cartItems.length > 0 && cartTotal >= minOrder
  // A department package is any selected value that is not in the API package options list.
  // (e.g. "Ma Wo Ho Nte (GHC270)" or "Maakye")
  const isDeptPackage = prefilledPackage && !packageOptions.includes(prefilledPackage)
  const isMainPackage = prefilledPackage && packageOptions.includes(prefilledPackage)

  const [form, setForm] = useState({
    institution: user?.institution || '',
    staffNumber: user?.staff_number || '',
    mandateNumber:'',
    ghanaCardNumber: user?.ghana_card_number || '',
    package: isMainPackage ? prefilledPackage : ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState('')

  useEffect(() => {
    if (prefilledPackage && packageOptions.includes(prefilledPackage)) {
      setForm(f => ({ ...f, package: prefilledPackage }))
    }
  }, [prefilledPackage, packageOptions])

  useEffect(() => {
    if (!user) return
    setForm(f => ({
      ...f,
      staffNumber: f.staffNumber || user.staff_number || '',
      institution: f.institution || user.institution || '',
      ghanaCardNumber: f.ghanaCardNumber || user.ghana_card_number || '',
    }))
  }, [user])

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const cartSummary = cartItems.map(([id, qty]) => {
    const p = allProducts.find(pr => pr.id === id || pr.id === parseInt(id))
    return p ? `${p.name} ×${qty}` : ''
  }).filter(Boolean).join(', ')

  const onSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitErr('')

    const selectedPackage = isDeptPackage ? prefilledPackage : form.package || prefilledPackage
    const baseFields = {
      staff_number: form.staffNumber,
      mandate_number: form.mandateNumber,
      institution: form.institution,
      ghana_card_number: form.ghanaCardNumber,
    }

    const payload = hasCustomCart
      ? {
          ...baseFields,
          package_type: 'custom',
          cart_items: cartItems.map(([id, quantity]) => {
            const product = allProducts.find(pr => pr.id === id || pr.legacyId === Number(id) || pr.id === Number(id))
            return { product_id: String(product?.apiId || product?.legacyId || product?.id || id), quantity }
          }),
        }
      : {
          ...baseFields,
          package_type: 'fixed',
          package_name: selectedPackage,
        }

    try {
      await applicationsApi.submit(payload)
      setSubmitted(true)
    } catch (err) {
      if (err.status === 401) onAuthRequired?.()
      const firstFieldError = Object.values(err.errors || {}).flat()[0]
      setSubmitErr(firstFieldError || err.message || 'Could not submit your application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="apply" className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 className="text-gray-900 font-black text-xl mb-2">Application Submitted!</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Complete the form that opened, then WhatsApp us to confirm.</p>
          <a href="https://wa.me/233244854206"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Follow up on WhatsApp
          </a>
          <button onClick={() => setSubmitted(false)} className="block mx-auto mt-4 text-gray-300 text-xs hover:text-gray-500">Submit another</button>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="bg-white py-12 px-4 border-b border-gray-100">
      <div className="max-w-3xl mx-auto">
        <SectionTitle label="Apply Now" />
        <p className="text-gray-400 text-xs mb-6 -mt-3">Fill in your details — our team will process your application.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">

          {/* Custom cart summary */}
          {hasCustomCart && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 font-black text-sm mb-1">🛒 Your Custom Package</p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{cartSummary}</p>
                <p className="text-gray-900 font-black text-lg mt-2">{fmt(cartTotal)} <span className="text-gray-400 text-xs font-normal">≈ {fmt(Math.ceil(cartTotal/3))}/mo</span></p>
              </div>
              <span className="text-gray-600 text-xs font-bold bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg flex-shrink-0">✓ Ready</span>
            </div>
          )}

          {/* Dept package (provisions / detergents) selected banner */}
          {isDeptPackage && !hasCustomCart && (
            <div className="mb-6 bg-white border border-amber-200 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-amber-700 font-black text-xs uppercase tracking-wider mb-1">Selected Package</p>
                <p className="text-gray-900 font-black text-base">{prefilledPackage}</p>
                <p className="text-gray-400 text-xs mt-1">Our team will confirm the full details with you after submission.</p>
              </div>
              <span className="text-amber-700 text-xs font-bold bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg flex-shrink-0">✓ Selected</span>
            </div>
          )}

          <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Customer</p>
              <p className="text-gray-900 text-sm font-black mt-1">{user?.display_name || user?.name || 'Signed in user'}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Phone</p>
              <p className="text-gray-900 text-sm font-black mt-1">{user?.phone_number || 'From profile'}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Profile</p>
              <p className="text-gray-900 text-sm font-black mt-1">{user?.institution || 'Use profile details'}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Institution / Employer" name="institution" value={form.institution} onChange={onChange} placeholder="e.g. Ghana Health Service" required />
            <Field label="Staff Number / ID" name="staffNumber" value={form.staffNumber} onChange={onChange} placeholder="Your staff ID" required />
            <Field label="Mandate Number" name="mandateNumber" value={form.mandateNumber} onChange={onChange} placeholder="Your mandate number" required />
            <Field label="Ghana Card Number" name="ghanaCardNumber" value={form.ghanaCardNumber} onChange={onChange} placeholder="GHA-000000000-0" required note="This should match your profile." />

            {/* Package selector — show dropdown when no cart, no dept package, no main package pre-selected */}
            {!hasCustomCart && !isDeptPackage && (
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Package <span className="text-red-400">*</span>
                </label>
                {isMainPackage ? (
                  /* Main fixed package pre-selected — show locked display */
                  <div className="bg-white border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-800 text-sm font-semibold">{prefilledPackage}</span>
                    <span className="text-amber-700 text-xs font-bold bg-amber-100 px-2 py-0.5 rounded-full">Pre-selected</span>
                  </div>
                ) : (
                  /* No package selected yet — show full dropdown */
                  <select name="package" value={form.package} onChange={onChange} required
                    className="bg-white border border-gray-200 focus:border-amber-400 text-gray-800 rounded-xl px-4 py-3 text-sm outline-none transition-all">
                    <option value="" disabled>— Select a package —</option>
                    {packageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            )}

            {submitErr && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
                {submitErr}
              </div>
            )}

            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-400 text-xs leading-relaxed">By submitting you confirm all details are accurate. LIST "J" Grocery Shop verifies your employment and mandate number before processing your request.</p>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={submitting}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black text-sm py-4 rounded-2xl active:scale-95 transition-all shadow-sm disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Application →'}
              </button>
              <p className="text-center text-gray-300 text-xs mt-3">Applications are submitted directly to List "J" for review.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
