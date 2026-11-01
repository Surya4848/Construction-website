import { Target, Eye, ShieldCheck } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Heading, Photo, CtaBand, Seo, Reveal } from '../components/ui'

const pillars = [[Target, 'Mission', 'To deliver dependable civil engineering and construction services that turn our clients’ plans into well-built reality.'], [Eye, 'Vision', 'To be a trusted name in construction and engineering in Kanchipuram and beyond, known for careful work and honest dealing.'], [ShieldCheck, 'Quality commitment', 'We plan carefully, supervise closely and check our work at every stage so the finished building meets the standard we promised.']]
export default function About() {
  return (<>
    <Seo title="About Us" description="Learn about JV CONSTRUCTION, a civil engineering and construction company in Kanchipuram, Tamil Nadu." />
    <PageHero title="About JV CONSTRUCTION" text="Building Your Vision. Engineering Your Future." />
    <section className="section-pad"><div className="container-x grid lg:grid-cols-2 gap-14 items-center">
      <Reveal><Heading title="Engineering and construction, under one team." />
        <p className="mt-6 text-lg text-navy-900/75 leading-relaxed">JV CONSTRUCTION is based in Pallavan Nagar, Kanchipuram. We offer civil engineering, planning and design, and construction detailing services for homes and commercial buildings.</p>
        <p className="mt-4 text-navy-900/60 text-sm">[Placeholder: add founding year, team and company story here.]</p></Reveal>
      <div className="aspect-[4/3]"><Photo label="Add team / office photo" /></div>
    </div></section>
    <section className="pb-24"><div className="container-x grid md:grid-cols-3 gap-6">
      {pillars.map(([I, t, d]) => <div key={t} className="bg-navy-900 text-white p-8"><I className="text-gold" size={32} strokeWidth={1.5} aria-hidden="true" /><h2 className="text-2xl font-bold mt-5">{t}</h2><p className="mt-3 text-white/70 leading-relaxed">{d}</p></div>)}
    </div></section>
    <CtaBand />
  </>)
}
