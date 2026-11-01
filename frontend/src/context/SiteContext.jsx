import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Hammer } from 'lucide-react'
import { api } from '../lib/api'
import { company as baseCompany, serviceGroups, projects as baseProjects, testimonials as baseTestimonials } from '../data/site'

const Ctx = createContext(null)
export const useSite = () => useContext(Ctx)
const RATIOS = ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]']
const KEYS = ['settings', 'services', 'projects', 'gallery', 'testimonials']

// Loads CMS content from the API. If the API is unreachable, the static content in data/site.js is used.
export function SiteProvider({ children }) {
  const [raw, setRaw] = useState({})
  useEffect(() => {
    let off = false
    Promise.allSettled(KEYS.map(k => api.get('/' + k))).then(rs => !off && setRaw(Object.fromEntries(KEYS.map((k, i) => [k, rs[i].status === 'fulfilled' ? rs[i].value.data : null]))))
    return () => { off = true }
  }, [])
  const value = useMemo(() => {
    const s = raw.settings || {}
    const company = { ...baseCompany, socials: s.socials || {} }
    ;['phone', 'whatsapp', 'email', 'address', 'tagline'].forEach(k => { if (s[k]) company[k] = s[k] })
    if (s.business_name) company.name = s.business_name
    const svc = raw.services || []
    const groups = svc.length ? serviceGroups.map(g => ({ ...g, items: svc.filter(x => x.category === g.id).map(x => [x.title, Hammer, x.description, x.image_url]) })).filter(g => g.items.length) : serviceGroups
    const prj = (raw.projects || []).map(p => ({ id: p.id, title: p.title, category: p.category, desc: p.description, location: p.location, image: p.images?.[0], featured: p.featured }))
    const projects = prj.length ? prj : baseProjects
    const categories = ['All', ...new Set(projects.map(p => p.category))]
    const gallery = (raw.gallery || []).map((g, i) => ({ src: g.image_url, alt: g.title || `Gallery image ${i + 1}`, ratio: RATIOS[i % 3] }))
    const testimonials = raw.testimonials ? raw.testimonials.map(t => ({ id: t.id, name: t.name, role: t.role, text: t.text })) : baseTestimonials.map(t => ({ ...t, placeholder: true }))
    return { company, groups, projects, categories, gallery, testimonials }
  }, [raw])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
