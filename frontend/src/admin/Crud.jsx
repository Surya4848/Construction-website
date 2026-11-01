import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react'
import { api, errMsg } from '../lib/api'
import { Alert, Badge, Btn, Field, Modal, PageHead, Spinner, inputCls } from './ui'

const CATS = ['Residential', 'Commercial', 'Civil Works', 'Detailing', 'Other']
const SVC = { civil: 'Civil Engineering', planning: 'Planning & Design', detailing: 'Construction Detailing' }
export const cfgs = {
  services: { title: 'Services', endpoint: 'services', folder: 'services', nameKey: 'title', defaults: { category: 'civil', active: true, order: 0, image_url: '' },
    fields: [{ name: 'title', label: 'Title', required: true }, { name: 'category', label: 'Category', type: 'select', options: Object.entries(SVC) }, { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'image_url', label: 'Service image', type: 'image' }, { name: 'order', label: 'Display order', type: 'number' }, { name: 'active', label: 'Active (visible on website)', type: 'checkbox' }],
    columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category', map: SVC }, { key: 'active', label: 'Status', toggle: true, on: 'Active', off: 'Inactive' }] },
  projects: { title: 'Projects', endpoint: 'projects', folder: 'projects', nameKey: 'title', defaults: { category: 'Residential', images: [], featured: false, location: '' },
    fields: [{ name: 'title', label: 'Title', required: true }, { name: 'category', label: 'Category', type: 'select', options: CATS }, { name: 'location', label: 'Location' }, { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'images', label: 'Project images', type: 'images' }, { name: 'featured', label: 'Featured project', type: 'checkbox' }],
    columns: [{ key: 'images', label: 'Image', thumb: i => i.images?.[0] }, { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'location', label: 'Location' }, { key: 'featured', label: 'Featured', toggle: true, on: 'Featured', off: 'No' }] },
  gallery: { title: 'Gallery', endpoint: 'gallery', folder: 'gallery', nameKey: 'title', defaults: { category: 'Other', title: '', image_url: '' },
    fields: [{ name: 'image_url', label: 'Image', type: 'image', required: true }, { name: 'title', label: 'Title' }, { name: 'category', label: 'Category', type: 'select', options: CATS }],
    columns: [{ key: 'image_url', label: 'Image', thumb: i => i.image_url }, { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }] },
  testimonials: { title: 'Testimonials', endpoint: 'testimonials', nameKey: 'name', defaults: { role: '', published: false },
    fields: [{ name: 'name', label: 'Client name', required: true }, { name: 'role', label: 'Role / project type' }, { name: 'text', label: 'Testimonial', type: 'textarea', required: true }, { name: 'published', label: 'Published (visible on website)', type: 'checkbox' }],
    columns: [{ key: 'name', label: 'Name' }, { key: 'text', label: 'Testimonial', clip: true }, { key: 'published', label: 'Status', toggle: true, on: 'Published', off: 'Draft' }] },
}

function ImageInput({ value, onChange, multiple, folder, id }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState('')
  const list = multiple ? value || [] : value ? [value] : []
  const pick = async e => {
    const files = [...e.target.files]; e.target.value = ''
    if (!files.length) return
    if (files.some(f => !['image/jpeg', 'image/png', 'image/webp'].includes(f.type))) return setErr('Only JPG, PNG or WebP images are allowed.')
    if (files.some(f => f.size > 5 * 1024 * 1024)) return setErr('Each image must be under 5 MB.')
    setBusy(true); setErr('')
    try {
      const fd = new FormData(); files.forEach(f => fd.append('files', f))
      const urls = (await api.post(`/admin/upload?folder=${folder || 'projects'}`, fd)).data.files.map(x => x.url)
      onChange(multiple ? [...list, ...urls] : urls[0])
    } catch (x) { setErr(errMsg(x)) } finally { setBusy(false) }
  }
  const remove = u => onChange(multiple ? list.filter(x => x !== u) : '')
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">{list.map(u => <div key={u} className="relative w-24 h-20 bg-stone-100"><img src={u} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => remove(u)} aria-label="Remove image" className="absolute -top-2 -right-2 bg-navy-900 text-white p-0.5"><X size={14} /></button></div>)}</div>
      <label className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold border border-dashed border-navy-900/30 cursor-pointer hover:border-gold ${busy ? 'opacity-60 pointer-events-none' : ''}`}><Upload size={16} />{busy ? 'Uploading…' : multiple ? 'Upload images' : list.length ? 'Replace image' : 'Upload image'}<input id={id} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={pick} className="sr-only" /></label>
      {err && <p className="text-xs text-red-700 mt-2" role="alert">{err}</p>}
    </div>)
}

function RecordForm({ cfg, initial, onSave, onClose }) {
  const [v, setV] = useState({ ...cfg.defaults, ...initial })
  const [errs, setErrs] = useState({}), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const set = (k, val) => setV(s => ({ ...s, [k]: val }))
  const submit = async e => {
    e.preventDefault()
    const er = {}
    cfg.fields.forEach(f => { const x = v[f.name]; if (f.required && (x === undefined || x === '' || (Array.isArray(x) && !x.length))) er[f.name] = `${f.label} is required` })
    setErrs(er); if (Object.keys(er).length) return
    setBusy(true); setError('')
    try { await onSave(v) } catch (x) { setError(errMsg(x)); setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Alert>{error}</Alert>
      {cfg.fields.map(f => {
        const id = `f-${f.name}`, p = { id, className: inputCls, value: v[f.name] ?? '' }
        return (
          <Field key={f.name} id={id} label={f.label} error={errs[f.name]}>
            {f.type === 'textarea' ? <textarea rows="4" {...p} onChange={e => set(f.name, e.target.value)} />
              : f.type === 'select' ? <select {...p} onChange={e => set(f.name, e.target.value)}>{f.options.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o}>{o}</option>)}</select>
              : f.type === 'number' ? <input type="number" min="0" {...p} onChange={e => set(f.name, Number(e.target.value))} />
              : f.type === 'checkbox' ? <input id={id} type="checkbox" checked={!!v[f.name]} onChange={e => set(f.name, e.target.checked)} className="w-5 h-5 accent-[#C9A24B]" />
              : f.type === 'image' || f.type === 'images' ? <ImageInput id={id} multiple={f.type === 'images'} folder={cfg.folder} value={v[f.name]} onChange={val => set(f.name, val)} />
              : <input {...p} onChange={e => set(f.name, e.target.value)} />}
          </Field>)
      })}
      <div className="flex gap-3 pt-2"><Btn type="submit" busy={busy}>Save</Btn><Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn></div>
    </form>)
}

export default function Crud({ cfg }) {
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(''), [notice, setNotice] = useState(''), [editing, setEditing] = useState(null)
  const base = `/admin/${cfg.endpoint}`
  const load = useCallback(() => { api.get(base).then(r => { setItems(r.data); setError('') }).catch(e => setError(errMsg(e))).finally(() => setLoading(false)) }, [base])
  useEffect(() => { setLoading(true); setEditing(null); load() }, [load])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(t) }, [notice])
  const save = async vals => { editing.id ? await api.put(`${base}/${editing.id}`, vals) : await api.post(base, vals); setEditing(null); setNotice('Saved successfully.'); load() }
  const del = async it => { if (!window.confirm(`Delete "${it[cfg.nameKey] || 'this item'}"? This cannot be undone.`)) return; try { await api.delete(`${base}/${it.id}`); setNotice('Deleted.'); load() } catch (e) { setError(errMsg(e)) } }
  const toggle = async (it, k) => { try { await api.put(`${base}/${it.id}`, { ...it, [k]: !it[k] }); load() } catch (e) { setError(errMsg(e)) } }
  return (
    <>
      <PageHead title={cfg.title}><Btn onClick={() => setEditing({})}><Plus size={16} />Add new</Btn></PageHead>
      <div className="space-y-3 mb-4"><Alert>{error}</Alert><Alert type="ok">{notice}</Alert></div>
      {loading ? <Spinner /> : !items.length ? <p className="bg-white border border-dashed border-navy-900/20 p-10 text-center text-navy-900/60">Nothing here yet. Click “Add new” to create the first entry.</p> : (
        <div className="bg-white border border-navy-900/10 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-navy-900 text-white"><tr>{cfg.columns.map(c => <th key={c.key} scope="col" className="px-4 py-3 font-semibold">{c.label}</th>)}<th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{items.map(it => (
              <tr key={it.id} className="border-t border-navy-900/10 align-middle">
                {cfg.columns.map(c => <td key={c.key} className={`px-4 py-3 ${c.clip ? 'max-w-xs truncate' : ''}`}>
                  {c.toggle ? <button onClick={() => toggle(it, c.key)} aria-label={`Toggle ${c.label}`}><Badge on={it[c.key]}>{it[c.key] ? c.on : c.off}</Badge></button>
                    : c.thumb ? (c.thumb(it) ? <img src={c.thumb(it)} alt="" className="w-16 h-12 object-cover" /> : <span className="text-navy-900/40">None</span>)
                    : c.map ? c.map[it[c.key]] || it[c.key] : it[c.key]}
                </td>)}
                <td className="px-4 py-3 whitespace-nowrap text-right"><button onClick={() => setEditing(it)} aria-label={`Edit ${it[cfg.nameKey]}`} className="p-2 hover:text-gold-dark"><Pencil size={17} /></button><button onClick={() => del(it)} aria-label={`Delete ${it[cfg.nameKey]}`} className="p-2 hover:text-red-700"><Trash2 size={17} /></button></td>
              </tr>))}</tbody>
          </table>
        </div>)}
      {editing && <Modal title={editing.id ? `Edit ${cfg.title.replace(/s$/, '')}` : `Add ${cfg.title.replace(/s$/, '')}`} onClose={() => setEditing(null)}><RecordForm cfg={cfg} initial={editing} onSave={save} onClose={() => setEditing(null)} /></Modal>}
    </>)
}
