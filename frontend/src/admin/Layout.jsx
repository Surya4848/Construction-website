import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Wrench, Building2, Images, Inbox, Star, Settings, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from './auth'
const items = [['Dashboard', '/admin', LayoutDashboard], ['Services', '/admin/services', Wrench], ['Projects', '/admin/projects', Building2], ['Gallery', '/admin/gallery', Images], ['Enquiries', '/admin/enquiries', Inbox], ['Testimonials', '/admin/testimonials', Star], ['Website Settings', '/admin/settings', Settings], ['Profile', '/admin/profile', User]]
export default function Layout() {
  const [open, setOpen] = useState(false)
  const { admin, logout } = useAuth()
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { document.title = 'Admin | JV CONSTRUCTION' }, [])
  return (
    <div className="min-h-screen bg-stone-50 lg:pl-64">
      <header className="lg:hidden sticky top-0 z-40 bg-navy-900 text-white flex items-center justify-between px-4 h-14">
        <span className="font-display font-extrabold">JV Admin</span>
        <button aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </header>
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-navy-950/60" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10"><span className="grid place-items-center w-9 h-9 bg-gold text-navy-950 font-display font-extrabold">JV</span><span className="font-display font-bold">Admin</span></div>
        <nav aria-label="Admin" className="flex-1 overflow-y-auto py-4">
          {items.map(([n, to, I]) => <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition ${isActive ? 'border-gold bg-white/10 text-gold' : 'border-transparent text-white/75 hover:bg-white/5 hover:text-white'}`}><I size={18} />{n}</NavLink>)}
        </nav>
        <div className="p-4 border-t border-white/10 text-sm">
          <p className="truncate text-white/60 mb-3">{admin?.email}</p>
          <Link to="/" className="block mb-3 text-white/75 hover:text-gold">View website</Link>
          <button onClick={logout} className="flex items-center gap-2 font-semibold text-white/85 hover:text-gold"><LogOut size={16} />Logout</button>
        </div>
      </aside>
      <main className="p-4 sm:p-8 max-w-6xl"><Outlet /></main>
    </div>)
}
