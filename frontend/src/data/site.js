import { HardHat, Ruler, Leaf, Compass, ClipboardList, Map, LayoutPanelTop, Landmark, FileCheck, Zap, Cable, Footprints, PanelTop, Grid3x3, Fence, DoorClosed, Blinds, Layers, TrendingUp } from 'lucide-react'

// TODO: replace placeholders with real business details.
export const company = {
  name: 'JV CONSTRUCTION',
  tagline: 'Building Your Vision. Engineering Your Future.',
  address: 'E-31, Avvaiyar Street, Pallavan Nagar, Kanchipuram, Tamil Nadu – 631501',
  phone: '', // e.g. '+91 98765 43210' (not provided)
  whatsapp: '', // digits with country code, e.g. '919876543210' (not provided)
  email: '', // not provided
}

export const nav = [['Home','/'],['About','/about'],['Services','/services'],['Projects','/projects'],['Gallery','/gallery'],['Contact','/contact']]

export const serviceGroups = [
  { id: 'civil', title: 'Civil Engineering', blurb: 'Engineering expertise from site to structure.', items: [
    ['Construction Engineering', HardHat, 'Site execution, supervision and quality control.'],
    ['Structural Engineering', Ruler, 'Safe, efficient structural systems for every building type.'],
    ['Environmental Engineering', Leaf, 'Drainage, sanitation and site-responsible planning.'],
    ['Surveying', Compass, 'Accurate measurements to guide design and construction.'],
    ['Engineering Consultancy', ClipboardList, 'Technical advice for your project decisions.'] ] },
  { id: 'planning', title: 'Planning & Design', blurb: 'Clear drawings and approvals before work begins.', items: [
    ['Land Survey', Map, 'Boundary and level surveys for your plot.'],
    ['Floor Plans', LayoutPanelTop, 'Layouts shaped around how you live and work.'],
    ['Structural Plans', Landmark, 'Detailed structural drawings for construction.'],
    ['Approval Plan Assistance', FileCheck, 'Support preparing plans for local approval.'],
    ['Electrical Layout', Zap, 'Safe, well-planned electrical points and circuits.'],
    ['Underground Utility Planning', Cable, 'Water, sewage and cable routing planned early.'] ] },
  { id: 'detailing', title: 'Construction Detailing', blurb: 'The finishing details that complete a building.', items: [
    ['Staircases', Footprints, 'Staircase design and construction detailing.'],
    ['False Ceilings', PanelTop, 'Ceiling designs with integrated lighting.'],
    ['Tiles & Granite Layouts', Grid3x3, 'Laying patterns that reduce waste and look refined.'],
    ['Pergolas', Blinds, 'Outdoor structures for shade and style.'],
    ['Gates & Grills', DoorClosed, 'Secure, durable gates and window grills.'],
    ['ACP Sheets', Layers, 'Cladding and elevation finishing with ACP sheets.'],
    ['Ramps', TrendingUp, 'Accessible, safe ramp design.'],
    ['Compound Designs', Fence, 'Compound walls and boundary designs.'] ] },
]

export const projectCategories = ['All','Residential','Commercial','Civil Works','Detailing']
// Placeholder portfolio. Replace with real projects; set `image` to e.g. '/images/villa.jpg' (file in /public/images).
export const projects = [
  { id: 1, title: 'Residential Villa', category: 'Residential', desc: 'Sample entry. Replace with a real completed residence.' },
  { id: 2, title: 'Commercial Complex', category: 'Commercial', desc: 'Sample entry. Replace with a real commercial project.' },
  { id: 3, title: 'Road & Drainage Works', category: 'Civil Works', desc: 'Sample entry. Replace with a real civil works project.' },
  { id: 4, title: 'Staircase & Ceiling Detailing', category: 'Detailing', desc: 'Sample entry. Replace with real detailing work.' },
  { id: 5, title: 'Apartment Block', category: 'Residential', desc: 'Sample entry. Replace with a real apartment project.' },
  { id: 6, title: 'Compound & Gate Design', category: 'Detailing', desc: 'Sample entry. Replace with a real compound project.' },
]
export const why = [
  ['Engineering-led approach','Every project is planned and checked from an engineering standpoint first.'],
  ['One team, plan to finish','Survey, drawings, approvals, construction and detailing under one roof.'],
  ['Clear communication','You know the scope, the stages and the status at every point.'],
  ['Careful workmanship','Close supervision keeps standards consistent on site.'],
]
export const process = [
  ['Consultation','We discuss your requirements, plot and budget.'],
  ['Survey & design','Land survey, floor plans and structural drawings.'],
  ['Approvals','Guidance preparing plans for approval.'],
  ['Construction','Supervised execution with quality checks.'],
  ['Handover','Final detailing, inspection and handover.'],
]
export const testimonials = [1,2,3].map(i => ({ id: i, name: 'Client name (placeholder)', role: 'Project type', text: 'Placeholder testimonial. Replace with a real, permitted client review.' }))
