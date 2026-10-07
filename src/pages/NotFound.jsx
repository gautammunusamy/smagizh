import { Link } from 'react-router-dom'
import { IconArrowRight } from '../components/Icons'

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="text-6xl font-extrabold grad-text">404</p>
      <h1 className="h2 mt-4">Page not found</h1>
      <p className="muted mx-auto mt-3 max-w-md">
        The page you are looking for has moved or never existed. Let&apos;s get you back on track.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
