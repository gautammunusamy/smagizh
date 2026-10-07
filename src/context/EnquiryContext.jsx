import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import EnquiryModal from '../components/EnquiryModal'

const EnquiryContext = createContext(null)

/**
 * One enquiry form for the whole site. Any button can open it pre-filled with
 * the category / plan / service the visitor was looking at, which is what
 * decides the WhatsApp number the enquiry is routed to.
 */
export function EnquiryProvider({ children }) {
  const [state, setState] = useState({ open: false, category: null, plan: '', service: '' })

  const openEnquiry = useCallback((opts = {}) => {
    setState({ open: true, category: opts.category || null, plan: opts.plan || '', service: opts.service || '' })
  }, [])

  const closeEnquiry = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const value = useMemo(() => ({ openEnquiry, closeEnquiry }), [openEnquiry, closeEnquiry])

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal
        open={state.open}
        onClose={closeEnquiry}
        category={state.category}
        plan={state.plan}
        service={state.service}
      />
    </EnquiryContext.Provider>
  )
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext)
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>')
  return ctx
}
