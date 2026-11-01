import { ArrowUpRight } from 'lucide-react'
import { Photo } from './ui'
export default function ProjectCard({ p }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
        <div className="w-full h-full transition duration-700 ease-out group-hover:scale-105"><Photo src={p.image} alt={p.title} label="Add project photo" /></div>
        <span className="absolute top-4 left-4 bg-navy-950/85 text-white text-xs font-semibold px-3 py-1.5 backdrop-blur">{p.category}</span>
        <span className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition duration-500" />
        <span className="absolute bottom-0 right-0 grid place-items-center w-12 h-12 bg-gold text-navy-950 translate-y-full group-hover:translate-y-0 transition duration-300"><ArrowUpRight size={20} aria-hidden="true" /></span>
      </div>
      <h3 className="mt-5 text-xl font-bold border-l-[3px] border-gold pl-3">{p.title}</h3>
      {p.location && <p className="mt-1 pl-[15px] text-sm text-navy-900/50">{p.location}</p>}
      <p className="mt-2 text-navy-900/65">{p.desc}</p>
    </article>
  )
}
