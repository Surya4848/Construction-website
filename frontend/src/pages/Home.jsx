import { motion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import { why, process as steps } from '../data/site'
import { useSite } from '../context/SiteContext'
import { Button, Heading, Reveal, Photo, CtaBand, Seo } from '../components/ui'
import ProjectCard from '../components/ProjectCard'

export default function Home() {
  const { groups, projects, testimonials } = useSite()
  const featured = [...projects.filter(p => p.featured), ...projects.filter(p => !p.featured)].slice(0, 3)
  return (<>
    <Seo title="Civil Engineering & Construction in Kanchipuram" description="JV CONSTRUCTION offers civil engineering, planning & design and construction detailing services in Kanchipuram, Tamil Nadu." />
    <section className="relative min-h-[100svh] flex items-end bg-navy-950 text-white overflow-hidden">
      <div className="absolute inset-0"><Photo label="Hero photo placeholder: public/images/hero.jpg" src={undefined} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/20" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-navy-950/70 to-transparent hidden md:block" />
      <div className="container-x relative pb-24 pt-40"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .8 }} className="origin-left h-[3px] w-20 bg-gold mb-8" />
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="hero-title font-extrabold leading-[.98] max-w-5xl">Building Your Vision. Engineering Your Future.</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4, duration: .8 }} className="mt-7 max-w-xl text-lg md:text-xl text-white/80">Civil engineering, planning and construction detailing from Kanchipuram, built with precision from the first survey to the final finish.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} className="mt-10 flex flex-wrap gap-4">
          <Button to="/contact">Get a Quote <ArrowRight size={18} /></Button><Button to="/projects" variant="outline">View projects</Button>
        </motion.div>
      </div>
    </section>

    <section className="section-pad"><div className="container-x grid lg:grid-cols-2 gap-14 items-center">
      <Reveal><Heading title="Civil engineers who build with care." />
        <p className="mt-6 text-lg text-navy-900/75 leading-relaxed max-w-xl">JV CONSTRUCTION is a civil engineering and construction services company in Kanchipuram, Tamil Nadu. We handle the full path from land survey and planning to construction and finishing details.</p>
        <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-navy-900 hover:text-gold-dark transition">About our company <ArrowRight size={18} /></Link></Reveal>
      <Reveal><div className="aspect-[5/4]"><Photo label="Add company / site photo" alt="JV CONSTRUCTION site" /></div></Reveal>
    </div></section>

    <section className="section-pad bg-stone-50"><div className="container-x">
      <Heading title="Our services" text="Three service areas covering engineering, planning and detailing." />
      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {groups.map(g => (
          <Link key={g.id} to={`/services#${g.id}`} className="group bg-navy-900 text-white p-8 flex flex-col justify-between min-h-[320px] border-b-4 border-transparent transition duration-300 hover:bg-navy-800 hover:-translate-y-1 hover:border-gold">
            <div><h3 className="text-2xl font-bold">{g.title}</h3><p className="mt-3 text-white/65">{g.blurb}</p>
              <ul className="mt-6 space-y-2 text-white/80 text-sm">{g.items.slice(0, 4).map(i => <li key={i[0]} className="flex gap-2"><span className="text-gold">+</span>{i[0]}</li>)}</ul></div>
            <span className="mt-8 inline-flex items-center gap-2 font-bold text-gold">Explore <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
          </Link>))}
      </div></div></section>

    <section className="section-pad"><div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-6"><Heading title="Featured projects" text="Sample entries shown. Replace with your completed work." /><Button to="/projects" variant="dark">All projects</Button></div>
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{featured.map(p => <ProjectCard key={p.id} p={p} />)}</div>
    </div></section>

    <section className="section-pad bg-navy-900 text-white"><div className="container-x grid lg:grid-cols-5 gap-14">
      <div className="lg:col-span-2"><Heading light title="Why choose JV CONSTRUCTION" /></div>
      <dl className="lg:col-span-3 grid sm:grid-cols-2 gap-x-10 gap-y-10">{why.map(([t, d]) => <div key={t} className="border-t-2 border-gold pt-5"><dt className="text-xl font-bold">{t}</dt><dd className="mt-2 text-white/65 leading-relaxed">{d}</dd></div>)}</dl>
    </div></section>

    <section className="section-pad"><div className="container-x">
      <Heading title="How we work" text="A clear five-step path from first call to handover." />
      <ol className="mt-14 grid sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">{steps.map(([t, d], i) => <li key={t} className="relative border-l-2 border-gold pl-5"><span className="grid place-items-center w-9 h-9 bg-navy-900 text-gold font-display font-extrabold text-sm">{i + 1}</span><h3 className="text-xl font-bold mt-3">{t}</h3><p className="mt-2 text-navy-900/65">{d}</p></li>)}</ol>
    </div></section>

    {testimonials.length > 0 && <section className="section-pad bg-stone-50"><div className="container-x">
      <Heading title="What clients say" text={testimonials[0]?.placeholder ? 'Placeholder content. Add real testimonials only with client permission.' : undefined} />
      <div className="mt-14 grid md:grid-cols-3 gap-6">{testimonials.map(t => <figure key={t.id} className="bg-white p-8 border border-navy-900/10 border-t-4 border-t-gold"><Quote className="text-gold" aria-hidden="true" /><blockquote className="mt-4 text-navy-900/75 leading-relaxed">{t.text}</blockquote><figcaption className="mt-6 font-bold">{t.name}<span className="block font-normal text-sm text-navy-900/55">{t.role}</span></figcaption></figure>)}</div>
    </div></section>}
    <CtaBand />
  </>)
}
