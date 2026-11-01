import { Reveal } from './ui'
export default function ServiceCard({ title, icon: Icon, text, image, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <article className="group relative h-full bg-white border border-navy-900/10 p-8 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(11,26,43,.35)]">
        <span className="absolute inset-x-0 top-0 h-[3px] bg-gold origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
        {image ? <img src={image} alt="" loading="lazy" className="h-40 w-[calc(100%+4rem)] max-w-none -mx-8 -mt-8 object-cover" /> : <span className="grid place-items-center w-14 h-14 bg-navy-900 text-gold transition duration-300 group-hover:bg-gold group-hover:text-navy-950"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>}
        <h3 className="mt-6 text-xl font-bold">{title}</h3>
        <p className="mt-2 text-navy-900/65 leading-relaxed">{text}</p>
      </article>
    </Reveal>
  )
}
