import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Photo, CtaBand, Seo } from '../components/ui'
import { useSite } from '../context/SiteContext'

// Replace with real photos: { src: '/images/site-1.jpg', alt: '...' }
const fallbackImages = Array.from({ length: 9 }, (_, i) => ({ src: undefined, alt: `Gallery image ${i + 1}`, ratio: ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]'][i % 3] }))

export default function Gallery() {
  const { gallery } = useSite()
  const images = gallery.length ? gallery : fallbackImages
  const [i, setI] = useState(null)
  const go = d => setI(v => (v + d + images.length) % images.length)
  useEffect(() => {
    if (i === null) return
    const k = e => e.key === 'Escape' ? setI(null) : e.key === 'ArrowRight' ? go(1) : e.key === 'ArrowLeft' && go(-1)
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [i])
  return (<>
    <Seo title="Gallery" description="Photo gallery of JV CONSTRUCTION work." />
    <PageHero title="Gallery" text="Placeholder tiles. Add real site photos in src/pages/Gallery.jsx." />
    <section className="section-pad"><div className="container-x columns-1 sm:columns-2 lg:columns-3 gap-5">
      {images.map((m, n) => <button key={n} onClick={() => setI(n)} aria-label={`Open ${m.alt}`} className={`group block w-full mb-5 overflow-hidden break-inside-avoid cursor-zoom-in ${m.ratio}`}><div className="w-full h-full transition duration-700 group-hover:scale-105"><Photo src={m.src} alt={m.alt} label={m.alt} /></div></button>)}
    </div></section>
    {i !== null && (
      <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[70] bg-navy-950/95 grid place-items-center p-4" onClick={() => setI(null)}>
        <button aria-label="Close" className="absolute top-5 right-5 text-white p-2" onClick={() => setI(null)}><X size={28} /></button>
        <button aria-label="Previous image" className="absolute left-3 text-white p-2" onClick={e => { e.stopPropagation(); go(-1) }}><ChevronLeft size={36} /></button>
        <div className="w-full max-w-4xl aspect-[4/3]" onClick={e => e.stopPropagation()}><Photo src={images[i].src} alt={images[i].alt} label={images[i].alt} /></div>
        <button aria-label="Next image" className="absolute right-3 text-white p-2" onClick={e => { e.stopPropagation(); go(1) }}><ChevronRight size={36} /></button>
      </div>)}
    <CtaBand />
  </>)
}
