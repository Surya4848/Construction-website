import { useEffect, useId } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Seo({ title, description }) {
  useEffect(() => {
    document.title = `${title} | JV CONSTRUCTION`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
  return null
}

export function Button({ to, href, variant = 'gold', children, className = '', ...p }) {
  const base = 'inline-flex items-center justify-center gap-2 px-6 py-3.5 font-display font-bold text-sm transition duration-300 active:scale-[.98]'
  const v = { gold: 'bg-gold text-navy-950 hover:bg-gold-light', outline: 'border border-white/50 text-white hover:bg-white hover:text-navy-900', dark: 'bg-navy-900 text-white hover:bg-navy-700' }[variant]
  const cls = `${base} ${v} ${className}`
  if (to) return <Link to={to} className={cls} {...p}>{children}</Link>
  return href ? <a href={href} className={cls} {...p}>{children}</a> : <button className={cls} {...p}>{children}</button>
}

export function Heading({ title, text, light, center }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.08] ${light ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
      <div className={`h-[3px] w-14 bg-gold mt-6 ${center ? 'mx-auto' : ''}`} />
      {text && <p className={`mt-5 text-lg leading-relaxed ${light ? 'text-white/70' : 'text-navy-900/70'}`}>{text}</p>}
    </div>
  )
}

export function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

// Blueprint-style placeholder shown until a real photo `src` is provided.
export function Photo({ src, label = 'Add project photo', alt = '', className = '', tone = 'dark' }) {
  const pid = useId().replace(/:/g, '')
  if (src) return <img src={src} alt={alt} loading="lazy" className={`object-cover w-full h-full ${className}`} />
  return (
    <div role="img" aria-label={alt || label} className={`relative overflow-hidden w-full h-full ${tone === 'dark' ? 'bg-navy-800' : 'bg-navy-700'} ${className}`}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice" viewBox="0 0 400 300" aria-hidden="true">
        <defs><pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#C9A24B" strokeOpacity=".12"/></pattern></defs>
        <rect width="400" height="300" fill={`url(#${pid})`} />
        <g fill="none" stroke="#C9A24B" strokeOpacity=".55" strokeWidth="1.5"><path d="M60 300V150l60-30v180M120 300V90l90-40v250M210 300V130h80v170M290 300V180h60v120"/><path d="M135 120h60M135 160h60M135 200h60M225 160h50M225 200h50"/></g>
      </svg>
      <span className="absolute bottom-3 left-4 text-xs text-white/60">{label}</span>
    </div>
  )
}

export function CtaBand() {
  return (
    <section className="bg-gold">
      <div className="container-x py-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 max-w-xl">Planning to build? Let’s talk about your site.</h2>
        <Button to="/contact" variant="dark">Get a free quote</Button>
      </div>
    </section>
  )
}
