import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { nav } from '../data/site'
import { Button } from './ui'

export function Logo({ light = true }) {
  return (
    <Link to="/" aria-label="JV CONSTRUCTION home" className="flex items-center gap-3">
      <span className="grid place-items-center w-10 h-10 bg-gold text-navy-950 font-display font-extrabold tracking-tight">JV</span>
      <span className={`font-display font-extrabold leading-none ${light ? 'text-white' : 'text-navy-900'}`}>JV CONSTRUCTION<small className="block text-[11px] font-semibold text-gold mt-1">Kanchipuram</small></span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { const f = () => setSolid(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const k = e => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k)
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open])
  const link = ({ isActive }) => `text-sm font-semibold py-2 border-b-2 transition ${isActive ? 'text-gold border-gold' : 'text-white/85 border-transparent hover:text-white hover:border-white/40'}`
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition duration-300 ${solid || open ? 'bg-navy-900/95 backdrop-blur shadow-lg' : 'bg-transparent'}`}>
      <div className="container-x flex items-center justify-between h-20">
        <Logo />
        <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
          {nav.map(([n, to]) => <NavLink key={to} to={to} end={to === '/'} className={link}>{n}</NavLink>)}
          <Button to="/contact" className="!py-2.5">Get a Quote</Button>
        </nav>
        <button className="lg:hidden text-white p-2" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav aria-label="Mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-y-auto max-h-[calc(100svh-5rem)] bg-navy-900 border-t border-gold/30">
            <div className="container-x py-6 flex flex-col gap-1">
              {nav.map(([n, to], i) => <motion.div key={to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 * i }}><NavLink to={to} end={to === '/'} className={({ isActive }) => `block py-3.5 text-2xl font-display font-bold border-b border-white/10 ${isActive ? 'text-gold' : 'text-white'}`}>{n}</NavLink></motion.div>)}
              <Button to="/contact" className="mt-6 w-full">Get a Quote</Button>
              <p className="mt-4 text-sm text-white/50">Pallavan Nagar, Kanchipuram</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
