import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CATEGORY_GROUPS, TESTIMONIALS } from '../data/seed'
import { api } from '../api/client'

/**
 * All site content, served by the PHP/MySQL backend.
 *
 * Every admin change is written to the database, so it is visible to every
 * visitor on every device - not just the browser that made the edit.
 *
 * Mutations update local state immediately (so the panel feels instant) and
 * then replace the collection with whatever the server returns, which is the
 * authoritative version.
 */

const DataContext = createContext(null)

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

const EMPTY = {
  settings: {},
  categories: [],
  services: [],
  plans: [],
  comparison: [],
  faqs: [],
  testimonials: [],
  enquiries: [],
}

export function DataProvider({ children }) {
  const [data, setData] = useState(EMPTY)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus((s) => (s === 'ready' ? s : 'loading'))
    try {
      const res = await api.content()
      setData({
        settings: res.settings || {},
        categories: res.categories || [],
        services: res.services || [],
        plans: res.plans || [],
        comparison: res.comparison || [],
        faqs: res.faqs || [],
        testimonials: res.testimonials?.length ? res.testimonials : TESTIMONIALS,
        enquiries: res.enquiries || [],
      })
      setError('')
      setStatus('ready')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /** Merge a collection the server just returned. */
  const apply = useCallback((res) => {
    setData((d) => {
      const next = { ...d }
      for (const key of Object.keys(EMPTY)) {
        if (Array.isArray(res[key]) || (key === 'settings' && res[key])) next[key] = res[key]
      }
      return next
    })
  }, [])

  /**
   * CRUD for one collection. Each call returns a promise so a screen can await
   * it and show an error, but nothing is required to.
   */
  const makeCrud = useCallback(
    (resource) => {
      const local = (fn) => setData((d) => ({ ...d, [resource]: fn(d[resource] || []) }))

      return {
        add: async (item) => {
          const record = { active: true, order: 999, ...item }
          local((list) => [...list, record])
          apply(await api.save(resource, record))
          return record
        },
        update: async (id, patch) => {
          let merged = null
          local((list) =>
            list.map((x) => {
              if (x.id !== id) return x
              merged = { ...x, ...patch }
              return merged
            }),
          )
          if (merged) apply(await api.save(resource, merged))
        },
        remove: async (id) => {
          local((list) => list.filter((x) => x.id !== id))
          apply(await api.remove(resource, id))
        },
        toggle: async (id) => {
          let merged = null
          local((list) =>
            list.map((x) => {
              if (x.id !== id) return x
              merged = { ...x, active: !x.active }
              return merged
            }),
          )
          if (merged) apply(await api.save(resource, merged))
        },
        move: async (id, dir) => {
          const sorted = [...(data[resource] || [])].sort(byOrder)
          const i = sorted.findIndex((x) => x.id === id)
          const j = dir === 'up' ? i - 1 : i + 1
          if (i < 0 || j < 0 || j >= sorted.length) return
          ;[sorted[i], sorted[j]] = [sorted[j], sorted[i]]
          const ids = sorted.map((x) => x.id)
          local(() => sorted.map((x, k) => ({ ...x, order: k + 1 })))
          apply(await api.reorder(resource, ids))
        },
        reorder: async (ids) => {
          local((list) => list.map((x) => ({ ...x, order: ids.indexOf(x.id) + 1 })))
          apply(await api.reorder(resource, ids))
        },
      }
    },
    [apply, data],
  )

  const categoryApi = useMemo(() => makeCrud('categories'), [makeCrud])
  const serviceApi = useMemo(() => makeCrud('services'), [makeCrud])
  const planApi = useMemo(() => makeCrud('plans'), [makeCrud])
  const faqApi = useMemo(() => makeCrud('faqs'), [makeCrud])

  // ---------- settings ----------
  const updateSettings = useCallback(
    async (patch) => {
      let merged = null
      setData((d) => {
        merged = { ...d.settings, ...patch }
        return { ...d, settings: merged }
      })
      const res = await api.saveSettings(merged)
      if (res.settings) setData((d) => ({ ...d, settings: res.settings }))
    },
    [],
  )

  // ---------- comparison table (saved as a whole) ----------
  const setComparison = useCallback(
    async (rows) => {
      const list = typeof rows === 'function' ? rows(data.comparison) : rows
      setData((d) => ({ ...d, comparison: list }))
      apply(await api.replace('comparison', list))
    },
    [apply, data.comparison],
  )

  // ---------- enquiries ----------
  const addEnquiry = useCallback(async (payload) => {
    const res = await api.submitEnquiry(payload)
    const record = { ...payload, id: res.id, routedTo: res.routedTo, routedTeam: res.routedTeam, status: 'New', createdAt: new Date().toISOString() }
    setData((d) => ({ ...d, enquiries: [record, ...(d.enquiries || [])] }))
    return record
  }, [])

  const updateEnquiry = useCallback(
    async (id, patch) => {
      let merged = null
      setData((d) => ({
        ...d,
        enquiries: (d.enquiries || []).map((e) => {
          if (e.id !== id) return e
          merged = { ...e, ...patch }
          return merged
        }),
      }))
      if (merged) apply(await api.save('enquiries', merged))
    },
    [apply],
  )

  const removeEnquiry = useCallback(
    async (id) => {
      setData((d) => ({ ...d, enquiries: (d.enquiries || []).filter((e) => e.id !== id) }))
      apply(await api.remove('enquiries', id))
    },
    [apply],
  )

  // ---------- public selectors ----------
  const { settings, categories, services, plans, comparison, faqs, testimonials, enquiries } = data

  const activeCategories = useMemo(() => categories.filter((c) => c.active).sort(byOrder), [categories])
  const activeServices = useMemo(() => services.filter((s) => s.active).sort(byOrder), [services])
  const activePlans = useMemo(() => plans.filter((p) => p.active).sort(byOrder), [plans])
  const activeFaqs = useMemo(() => faqs.filter((f) => f.active).sort(byOrder), [faqs])

  const groupedCategories = useMemo(
    () =>
      CATEGORY_GROUPS.map((g) => ({ ...g, items: activeCategories.filter((c) => c.group === g.id) })).filter(
        (g) => g.items.length > 0,
      ),
    [activeCategories],
  )

  const getCategory = useCallback(
    (slugOrId) => categories.find((c) => c.slug === slugOrId || c.id === slugOrId),
    [categories],
  )
  const getService = useCallback(
    (slugOrId) => services.find((s) => s.slug === slugOrId || s.id === slugOrId || s.name === slugOrId),
    [services],
  )

  const value = {
    status,
    error,
    reload: load,

    settings,
    updateSettings,

    categories: [...categories].sort(byOrder),
    services: [...services].sort(byOrder),
    plans: [...plans].sort(byOrder),
    comparison,
    setComparison,
    faqs: [...faqs].sort(byOrder),
    enquiries,
    testimonials,
    groups: CATEGORY_GROUPS,

    activeCategories,
    activeServices,
    activePlans,
    activeFaqs,
    groupedCategories,
    getCategory,
    getService,

    categoryApi,
    serviceApi,
    planApi,
    faqApi,

    addEnquiry,
    updateEnquiry,
    removeEnquiry,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
