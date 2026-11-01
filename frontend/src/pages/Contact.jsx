import { useState } from 'react'
import { MapPin, Phone, MessageCircle, Mail, Loader2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Button, Seo } from '../components/ui'
import { useSite } from '../context/SiteContext'
import { api, errMsg } from '../lib/api'

const field = 'w-full border border-navy-900/20 px-4 py-3.5 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 transition'
export default function Contact() {
  const { company } = useSite()
  const [f, setF] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [state, setState] = useState('idle')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const text = `Hello JV CONSTRUCTION, I'm ${f.name}. Phone: ${f.phone}. Service: ${f.service || 'General enquiry'}. ${f.message}`
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`
  const hasWa = Boolean(company.whatsapp)
  const [err, setErr] = useState('')
  const submit = async e => {
    e.preventDefault(); setState('sending'); setErr('')
    try { await api.post('/enquiries', f); setState('done'); setF({ name: '', phone: '', email: '', service: '', message: '' }) }
    catch (x) { setErr(errMsg(x)); setState('error') }
  }
  const map = `https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`
  return (<>
    <Seo title="Contact & Get a Quote" description="Contact JV CONSTRUCTION in Kanchipuram for a quote on civil engineering and construction work." />
    <PageHero title="Get a quote" text="Tell us about your project and we’ll get back to you." />
    <section className="section-pad"><div className="container-x grid lg:grid-cols-5 gap-14">
      <form onSubmit={submit} className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div><label htmlFor="n" className="block font-semibold mb-2">Name</label><input id="n" required autoComplete="name" className={field} value={f.name} onChange={set('name')} /></div>
          <div><label htmlFor="p" className="block font-semibold mb-2">Phone</label><input id="p" required type="tel" pattern="[0-9+\-\s()]{7,20}" title="Enter a valid phone number" autoComplete="tel" className={field} value={f.phone} onChange={set('phone')} /></div>
        </div>
        <div><label htmlFor="e" className="block font-semibold mb-2">Email (optional)</label><input id="e" type="email" autoComplete="email" className={field} value={f.email} onChange={set('email')} /></div>
        <div><label htmlFor="s" className="block font-semibold mb-2">Service needed</label>
          <select id="s" className={field} value={f.service} onChange={set('service')}><option value="">Select a service</option><option>Civil Engineering</option><option>Planning & Design</option><option>Construction Detailing</option><option>Other</option></select></div>
        <div><label htmlFor="m" className="block font-semibold mb-2">Project details</label><textarea id="m" rows="5" required className={field} value={f.message} onChange={set('message')} /></div>
        <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? <><Loader2 className="animate-spin" size={18} /> Sending</> : 'Send enquiry'}</Button>
        <p role="status" className="text-sm text-navy-900/70">{state === 'done' ? 'Thank you. Your enquiry has been received and we will contact you soon.' : state === 'error' ? err : 'We will contact you on the phone number you provide.'}</p>
      </form>
      <aside className="lg:col-span-2 space-y-6">
        <ul className="space-y-5">
          <li className="flex gap-4"><MapPin className="text-gold shrink-0" /><span>{company.address}</span></li>
          <li className="flex gap-4"><Phone className="text-gold shrink-0" /><span>{company.phone || 'Phone number: [placeholder]'}</span></li>
          <li className="flex gap-4"><Mail className="text-gold shrink-0" /><span>{company.email || 'Email: [placeholder]'}</span></li>
        </ul>
        {hasWa ? <Button href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" variant="dark"><MessageCircle size={18} /> Chat on WhatsApp</Button> : <p className="border border-dashed border-navy-900/30 p-4 text-sm text-navy-900/70">WhatsApp chat button appears once a number is added in <code>frontend/src/data/site.js</code>.</p>}
        <iframe title="JV CONSTRUCTION location map" src={map} loading="lazy" className="w-full h-72 border-0" referrerPolicy="no-referrer-when-downgrade" />
      </aside>
    </div></section>
  </>)
}
