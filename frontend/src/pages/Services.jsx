import PageHero from '../components/PageHero'
import ServiceCard from '../components/ServiceCard'
import { Heading, CtaBand, Seo } from '../components/ui'
import { useSite } from '../context/SiteContext'

export default function Services() {
  const { groups: serviceGroups } = useSite()
  return (<>
    <Seo title="Services" description="Civil engineering, planning & design and construction detailing services by JV CONSTRUCTION, Kanchipuram." />
    <PageHero title="Our services" text="From the first survey to the last finishing detail." />
    {serviceGroups.map((g, i) => (
      <section key={g.id} id={g.id} className={`section-pad scroll-mt-4 ${i % 2 ? 'bg-stone-50' : ''}`}><div className="container-x">
        <Heading title={g.title} text={g.blurb} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{g.items.map(([t, icon, d, img], n) => <ServiceCard key={t} title={t} icon={icon} text={d} image={img} index={n} />)}</div>
      </div></section>))}
    <CtaBand />
  </>)
}
