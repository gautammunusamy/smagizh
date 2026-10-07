import { Outlet, useMatch } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFab from './WhatsAppFab'
import { useData } from '../context/DataContext'

export default function SiteLayout() {
  const catMatch = useMatch('/categories/:slug')
  const svcMatch = useMatch('/services/:slug')
  const { getCategory, getService } = useData()
  const category = catMatch ? getCategory(catMatch.params.slug) : null
  const service = svcMatch ? getService(svcMatch.params.slug) : null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab category={category?.active ? category : null} service={service?.active ? service : null} />
    </div>
  )
}
