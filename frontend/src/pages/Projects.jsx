import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import ProjectCard from '../components/ProjectCard'
import { CtaBand, Seo } from '../components/ui'
import { useSite } from '../context/SiteContext'

export default function Projects() {
  const { projects, categories: projectCategories } = useSite()
  const [cat, setCat] = useState('All')
  const list = cat === 'All' ? projects : projects.filter(p => p.category === cat)
  return (<>
    <Seo title="Projects" description="Browse residential, commercial, civil works and detailing projects by JV CONSTRUCTION." />
    <PageHero title="Projects" text="Sample portfolio entries. Replace them with your real completed work." />
    <section className="section-pad"><div className="container-x">
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-3">
        {projectCategories.map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`px-5 py-2.5 text-sm font-bold border transition ${cat === c ? 'bg-navy-900 text-white border-navy-900' : 'border-navy-900/20 hover:border-gold'}`}>{c}</button>)}
      </div>
      <motion.div layout className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">{list.map(p => <motion.div layout key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProjectCard p={p} /></motion.div>)}</AnimatePresence>
      </motion.div>
      {!list.length && <p className="mt-10 text-navy-900/60">No projects in this category yet.</p>}
    </div></section>
    <CtaBand />
  </>)
}
