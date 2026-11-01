import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Button, Seo } from './components/ui'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

const AdminApp = lazy(() => import('./admin/AdminApp'))
function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80); return () => clearTimeout(t) }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
const NotFound = () => (<div className="container-x pt-48 pb-28 text-center"><Seo title="Page not found" description="Page not found" /><h1 className="text-5xl font-extrabold">Page not found</h1><p className="mt-4 text-navy-900/70">That page doesn’t exist. Head back to the homepage.</p><Button to="/" variant="dark" className="mt-8">Back to home</Button></div>)

export default function App() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return <Suspense fallback={<div className="min-h-screen bg-navy-900" />}><AdminApp /></Suspense>
  return (<>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:bg-gold focus:p-3">Skip to content</a>
    <ScrollTop /><Navbar />
    <main id="main"><Routes>
      <Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/services" element={<Services />} />
      <Route path="/projects" element={<Projects />} /><Route path="/gallery" element={<Gallery />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} />
    </Routes></main>
    <Footer />
  </>)
}
