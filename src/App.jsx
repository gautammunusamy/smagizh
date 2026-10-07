import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import SiteLayout from './components/SiteLayout'
import Home from './pages/Home'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import About from './pages/About'
import Plans from './pages/Plans'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin screens are code-split so public visitors never download them.
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminLogin = lazy(() => import('./admin/Login'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const AdminCategories = lazy(() => import('./admin/AdminCategories'))
const AdminServices = lazy(() => import('./admin/AdminServices'))
const AdminPlans = lazy(() => import('./admin/AdminPlans'))
const AdminFaqs = lazy(() => import('./admin/AdminFaqs'))
const AdminEnquiries = lazy(() => import('./admin/AdminEnquiries'))
const AdminPayments = lazy(() => import('./admin/AdminPayments'))
const AdminRouting = lazy(() => import('./admin/AdminRouting'))
const AdminSettings = lazy(() => import('./admin/AdminSettings'))

const Loading = () => <div className="grid min-h-[50vh] place-items-center text-sm text-ink/45">Loading…</div>

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="whatsapp-routing" element={<AdminRouting />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      </Suspense>
    </>
  )
}
