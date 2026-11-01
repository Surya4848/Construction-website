import { Photo } from './ui'
export default function PageHero({ title, text }) {
  return (
    <section className="relative bg-navy-900 text-white pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 opacity-30"><Photo label="" /></div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent" />
      <div className="container-x relative"><h1 className="text-4xl md:text-6xl font-extrabold">{title}</h1><div className="h-1 w-14 bg-gold mt-6" />{text && <p className="mt-6 max-w-2xl text-lg text-white/75">{text}</p>}</div>
    </section>
  )
}
