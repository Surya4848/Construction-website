import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { nav } from '../data/site'
import { useSite } from '../context/SiteContext'
import { Logo } from './Navbar'

export default function Footer() {
  const { company, groups: serviceGroups } = useSite()
  return (
    <footer className="bg-navy-950 text-white/70 border-t-4 border-gold">
      <div className="container-x py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div><Logo /><p className="mt-5 max-w-xs">{company.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">{Object.entries(company.socials || {}).filter(([, u]) => u).map(([k, u]) => <a key={k} href={u} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-gold transition">{k}</a>)}</div></div>
        <div><h3 className="text-white font-bold mb-4">Explore</h3>
          <ul className="grid grid-cols-2 gap-2 max-w-xs">{nav.map(([n, to]) => <li key={to}><Link className="hover:text-gold transition" to={to}>{n}</Link></li>)}</ul></div>
        <div><h3 className="text-white font-bold mb-4">Services</h3>
          <ul className="space-y-2">{serviceGroups.map(g => <li key={g.id}><Link className="hover:text-gold transition" to={`/services#${g.id}`}>{g.title}</Link></li>)}</ul></div>
        <div><h3 className="text-white font-bold mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex gap-3"><MapPin className="shrink-0 text-gold" size={18} />{company.address}</li>
            <li className="flex gap-3"><Phone className="shrink-0 text-gold" size={18} />{company.phone || 'Phone: [placeholder]'}</li>
            <li className="flex gap-3"><Mail className="shrink-0 text-gold" size={18} />{company.email || 'Email: [placeholder]'}</li>
          </ul></div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm">© {new Date().getFullYear()} JV CONSTRUCTION. All rights reserved.</div>
    </footer>
  )
}
