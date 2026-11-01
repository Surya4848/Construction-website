import { useEffect } from 'react'
import { Loader2, X } from 'lucide-react'
export const inputCls = 'w-full border border-navy-900/20 px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:bg-stone-50'
export const Spinner = ({ full }) => <div className={`grid place-items-center ${full ? 'min-h-screen' : 'py-16'}`} role="status" aria-label="Loading"><Loader2 className="animate-spin text-gold" size={32} /></div>
export const Alert = ({ type = 'error', children }) => children ? <div role={type === 'error' ? 'alert' : 'status'} className={`px-4 py-3 text-sm border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{children}</div> : null
export const Btn = ({ variant = 'gold', className = '', busy, children, ...p }) => <button {...p} disabled={busy || p.disabled} className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold transition disabled:opacity-60 ${{ gold: 'bg-gold text-navy-950 hover:bg-gold-light', dark: 'bg-navy-900 text-white hover:bg-navy-700', ghost: 'border border-navy-900/20 hover:border-gold', danger: 'border border-red-300 text-red-700 hover:bg-red-50' }[variant]} ${className}`}>{busy && <Loader2 size={16} className="animate-spin" />}{children}</button>
export const Field = ({ label, id, error, hint, children }) => <div><label htmlFor={id} className="block text-sm font-semibold mb-1.5">{label}</label>{children}{hint && <p className="text-xs text-navy-900/55 mt-1">{hint}</p>}{error && <p className="text-xs text-red-700 mt-1">{error}</p>}</div>
export const Badge = ({ on, children }) => <span className={`inline-block px-2.5 py-1 text-xs font-bold ${on ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-navy-900/70'}`}>{children}</span>
export const STATUS = { New: 'bg-gold/25 text-gold-dark', Contacted: 'bg-sky-100 text-sky-800', 'In Progress': 'bg-violet-100 text-violet-800', Completed: 'bg-emerald-100 text-emerald-800' }
export function Modal({ title, onClose, children }) {
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'; return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' } }, [onClose])
  return (
    <div className="fixed inset-0 z-[80] bg-navy-950/70 grid place-items-center p-3" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-900/10 sticky top-0 bg-white z-10"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose} aria-label="Close" className="p-1"><X /></button></div>
        <div className="p-6">{children}</div>
      </div>
    </div>)
}
export const PageHead = ({ title, children }) => <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>{children}</div>
