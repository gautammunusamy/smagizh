import { useData } from '../context/DataContext'

/**
 * Content now comes from the API, so the first paint has nothing to show.
 * This holds a brief placeholder instead of rendering an empty site, and
 * explains the problem (with a retry) if the backend cannot be reached.
 */
export default function ContentGate({ children }) {
  const { status, error, reload } = useData()

  if (status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-mist">
        <div className="text-center">
          <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
          <p className="muted mt-4 text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="grid min-h-screen place-items-center bg-mist p-6">
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold">We could not load the site</h1>
          <p className="muted mt-3 text-sm leading-relaxed">{error}</p>
          <button type="button" className="btn-primary mt-6" onClick={reload}>
            Try again
          </button>
        </div>
      </div>
    )
  }

  return children
}
