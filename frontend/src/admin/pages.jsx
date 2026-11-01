import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Building2, Wrench, Inbox, Clock, Trash2 } from 'lucide-react'
import { api, errMsg } from '../lib/api'
import { useAuth } from './auth'
import { Alert, Badge, Btn, Field, Modal, PageHead, STATUS, Spinner, inputCls } from './ui'

const fmt = d => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''

export function Login() {
  const { admin, login } = useAuth()
  const [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { document.title = 'Admin Login | JV CONSTRUCTION' }, [])
  if (admin) return <Navigate to="/admin" replace />
  const submit = async e => { e.preventDefault(); setBusy(true); setErr(''); try { await login(f.email.trim(), f.password) } catch (x) { setErr(errMsg(x)); setBusy(false) } }
  return (
    <div className="min-h-screen bg-navy-900 grid place-items-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-md p-8 space-y-5 border-t-4 border-gold">
        <div><span className="grid place-items-center w-11 h-11 bg-gold text-navy-950 font-display font-extrabold">JV</span><h1 className="text-2xl font-extrabold mt-4">Admin login</h1><p className="text-navy-900/60 text-sm mt-1">JV CONSTRUCTION website management</p></div>
        <Alert>{err}</Alert>
        <Field id="em" label="Email"><input id="em" type="email" required autoComplete="username" className={inputCls} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
        <Field id="pw" label="Password"><input id="pw" type="password" required autoComplete="current-password" className={inputCls} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></Field>
        <Btn type="submit" busy={busy} className="w-full">Sign in</Btn>
        <Link to="/" className="block text-center text-sm text-navy-900/60 hover:text-gold-dark">Back to website</Link>
      </form>
    </div>)
}

export function Dashboard() {
  const [d, setD] = useState(null), [err, setErr] = useState('')
  useEffect(() => { api.get('/admin/dashboard').then(r => setD(r.data)).catch(e => setErr(errMsg(e))) }, [])
  if (err) return <Alert>{err}</Alert>
  if (!d) return <Spinner />
  const stats = [['Total projects', d.total_projects, Building2], ['Total services', d.total_services, Wrench], ['Total enquiries', d.total_enquiries, Inbox], ['Pending enquiries', d.pending_enquiries, Clock]]
  return (<>
    <PageHead title="Dashboard" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{stats.map(([l, n, I]) => <div key={l} className="bg-white border border-navy-900/10 border-t-4 border-t-gold p-5"><I className="text-gold" size={22} /><p className="text-3xl font-extrabold mt-3">{n}</p><p className="text-sm text-navy-900/60">{l}</p></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-6 mt-8">
      <section className="bg-white border border-navy-900/10 p-5"><div className="flex justify-between mb-4"><h2 className="font-bold text-lg">Recent enquiries</h2><Link to="/admin/enquiries" className="text-sm font-semibold text-gold-dark">View all</Link></div>
        {d.recent_enquiries.length ? <ul className="divide-y divide-navy-900/10">{d.recent_enquiries.map(e => <li key={e.id} className="py-3 flex justify-between gap-3"><div className="min-w-0"><p className="font-semibold truncate">{e.name}</p><p className="text-sm text-navy-900/60 truncate">{e.service || 'General enquiry'} · {fmt(e.created_at)}</p></div><span className={`h-fit px-2.5 py-1 text-xs font-bold ${STATUS[e.status]}`}>{e.status}</span></li>)}</ul> : <p className="text-navy-900/60">No enquiries yet.</p>}</section>
      <section className="bg-white border border-navy-900/10 p-5"><div className="flex justify-between mb-4"><h2 className="font-bold text-lg">Recent projects</h2><Link to="/admin/projects" className="text-sm font-semibold text-gold-dark">Manage</Link></div>
        {d.recent_projects.length ? <ul className="divide-y divide-navy-900/10">{d.recent_projects.map(p => <li key={p.id} className="py-3"><p className="font-semibold">{p.title}</p><p className="text-sm text-navy-900/60">{p.category}{p.location ? ` · ${p.location}` : ''}</p></li>)}</ul> : <p className="text-navy-900/60">No projects yet.</p>}</section>
    </div></>)
}

export function Enquiries() {
  const [items, setItems] = useState([]), [filter, setFilter] = useState(''), [loading, setLoading] = useState(true), [err, setErr] = useState(''), [sel, setSel] = useState(null), [busy, setBusy] = useState(false)
  const load = () => api.get('/admin/enquiries', { params: filter ? { status: filter } : {} }).then(r => { setItems(r.data); setErr('') }).catch(e => setErr(errMsg(e))).finally(() => setLoading(false))
  useEffect(() => { setLoading(true); load() }, [filter])
  const setStatus = async s => { setBusy(true); try { const r = await api.put(`/admin/enquiries/${sel.id}`, { status: s }); setSel(r.data); load() } catch (e) { setErr(errMsg(e)) } finally { setBusy(false) } }
  const del = async () => { if (!window.confirm('Delete this enquiry permanently?')) return; try { await api.delete(`/admin/enquiries/${sel.id}`); setSel(null); load() } catch (e) { setErr(errMsg(e)) } }
  const stats = ['New', 'Contacted', 'In Progress', 'Completed']
  return (<>
    <PageHead title="Customer enquiries"><select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All statuses</option>{stats.map(s => <option key={s}>{s}</option>)}</select></PageHead>
    <div className="mb-4"><Alert>{err}</Alert></div>
    {loading ? <Spinner /> : !items.length ? <p className="bg-white border border-dashed border-navy-900/20 p-10 text-center text-navy-900/60">No enquiries found.</p> : (
      <div className="bg-white border border-navy-900/10 overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-navy-900 text-white"><tr>{['Customer', 'Phone', 'Service', 'Received', 'Status'].map(h => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{items.map(e => <tr key={e.id} tabIndex={0} onClick={() => setSel(e)} onKeyDown={x => x.key === 'Enter' && setSel(e)} className="border-t border-navy-900/10 cursor-pointer hover:bg-stone-50"><td className="px-4 py-3 font-semibold">{e.name}</td><td className="px-4 py-3">{e.phone}</td><td className="px-4 py-3">{e.service || '-'}</td><td className="px-4 py-3 whitespace-nowrap">{fmt(e.created_at)}</td><td className="px-4 py-3"><span className={`px-2.5 py-1 text-xs font-bold ${STATUS[e.status]}`}>{e.status}</span></td></tr>)}</tbody></table></div>)}
    {sel && <Modal title="Enquiry details" onClose={() => setSel(null)}>
      <dl className="grid sm:grid-cols-2 gap-4 text-sm">{[['Name', sel.name], ['Phone', sel.phone], ['Email', sel.email || '-'], ['Service', sel.service || '-'], ['Received', fmt(sel.created_at)]].map(([k, v]) => <div key={k}><dt className="text-navy-900/55">{k}</dt><dd className="font-semibold break-words">{v}</dd></div>)}<div className="sm:col-span-2"><dt className="text-navy-900/55">Message</dt><dd className="whitespace-pre-wrap">{sel.message}</dd></div></dl>
      <p className="font-semibold mt-6 mb-2 text-sm">Status</p>
      <div className="flex flex-wrap gap-2">{stats.map(s => <button key={s} disabled={busy} aria-pressed={sel.status === s} onClick={() => setStatus(s)} className={`px-3 py-2 text-sm font-bold border transition ${sel.status === s ? 'bg-navy-900 text-white border-navy-900' : 'border-navy-900/20 hover:border-gold'}`}>{s}</button>)}</div>
      <div className="mt-6 pt-4 border-t border-navy-900/10 flex flex-wrap gap-3">{sel.phone && <Btn variant="dark" onClick={() => (window.location.href = `tel:${sel.phone.replace(/[^\d+]/g, '')}`)}>Call customer</Btn>}<Btn variant="danger" onClick={del}><Trash2 size={16} />Delete</Btn></div>
    </Modal>}
  </>)
}

export function SettingsPage() {
  const blank = { business_name: '', tagline: '', phone: '', whatsapp: '', email: '', address: '', socials: { facebook: '', instagram: '', linkedin: '', youtube: '' } }
  const [v, setV] = useState(null), [err, setErr] = useState(''), [ok, setOk] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { api.get('/settings').then(r => setV({ ...blank, business_name: 'JV CONSTRUCTION', ...r.data, socials: { ...blank.socials, ...(r.data.socials || {}) } })).catch(e => setErr(errMsg(e))) }, [])
  if (!v) return err ? <Alert>{err}</Alert> : <Spinner />
  const set = (k, x) => setV({ ...v, [k]: x })
  const submit = async e => {
    e.preventDefault(); setErr(''); setOk('')
    if (v.whatsapp && !/^\d{8,15}$/.test(v.whatsapp)) return setErr('WhatsApp number must be digits only with country code, e.g. 919876543210.')
    setBusy(true)
    try { await api.put('/admin/settings', v); setOk('Settings saved. The website now uses these details.') } catch (x) { setErr(errMsg(x)) } finally { setBusy(false) }
  }
  const T = (id, label, k, extra = {}) => <Field id={id} label={label} hint={extra.hint}><input id={id} type={extra.type || 'text'} className={inputCls} value={v[k]} onChange={e => set(k, e.target.value)} /></Field>
  return (<>
    <PageHead title="Website settings" />
    <form onSubmit={submit} className="bg-white border border-navy-900/10 p-6 space-y-5 max-w-3xl">
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>
      <div className="grid sm:grid-cols-2 gap-5">{T('bn', 'Business name', 'business_name')}{T('tg', 'Tagline', 'tagline')}{T('ph', 'Phone', 'phone', { type: 'tel' })}{T('wa', 'WhatsApp number', 'whatsapp', { hint: 'Digits only with country code, e.g. 919876543210' })}{T('em', 'Email', 'email', { type: 'email' })}</div>
      <Field id="ad" label="Business address"><textarea id="ad" rows="3" className={inputCls} value={v.address} onChange={e => set('address', e.target.value)} /></Field>
      <fieldset><legend className="font-bold mb-3">Social media links</legend><div className="grid sm:grid-cols-2 gap-5">{Object.keys(v.socials).map(k => <Field key={k} id={`s-${k}`} label={k[0].toUpperCase() + k.slice(1)}><input id={`s-${k}`} type="url" placeholder="https://" className={inputCls} value={v.socials[k]} onChange={e => set('socials', { ...v.socials, [k]: e.target.value })} /></Field>)}</div></fieldset>
      <Btn type="submit" busy={busy}>Save settings</Btn>
    </form></>)
}

export function Profile() {
  const { admin, setAdmin } = useAuth()
  const [v, setV] = useState({ name: admin?.name || '', current_password: '', new_password: '', confirm: '' }), [err, setErr] = useState(''), [ok, setOk] = useState(''), [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setErr(''); setOk('')
    if (v.new_password && v.new_password.length < 12) return setErr('New password must be at least 12 characters.')
    if (v.new_password !== v.confirm) return setErr('New password and confirmation do not match.')
    setBusy(true)
    try { const body = { name: v.name }; if (v.new_password) { body.current_password = v.current_password; body.new_password = v.new_password } const r = await api.put('/auth/profile', body); setAdmin(r.data); setV({ ...v, current_password: '', new_password: '', confirm: '' }); setOk('Profile updated.') } catch (x) { setErr(errMsg(x)) } finally { setBusy(false) }
  }
  const P = (id, label, k, type = 'password', ac) => <Field id={id} label={label}><input id={id} type={type} autoComplete={ac} className={inputCls} value={v[k]} onChange={e => setV({ ...v, [k]: e.target.value })} /></Field>
  return (<>
    <PageHead title="Profile" />
    <form onSubmit={submit} className="bg-white border border-navy-900/10 p-6 space-y-5 max-w-xl">
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>
      <Field id="pe" label="Email"><input id="pe" disabled className={inputCls} value={admin?.email || ''} /></Field>
      {P('pn', 'Name', 'name', 'text', 'name')}
      <p className="font-bold pt-2">Change password (optional)</p>
      {P('cp', 'Current password', 'current_password', 'password', 'current-password')}{P('np', 'New password', 'new_password', 'password', 'new-password')}{P('cf', 'Confirm new password', 'confirm', 'password', 'new-password')}
      <Btn type="submit" busy={busy}>Save profile</Btn>
    </form></>)
}
