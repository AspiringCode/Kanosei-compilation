'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, ChevronRight } from 'lucide-react'
import { ALERTS } from '@/lib/mock-data'
import { useHealth } from '@/lib/hooks'

const PAGE_LABELS: Record<string, string[]> = {
  '/dashboard':          ['Dashboard'],
  '/chat':               ['Command'],
  '/simulation':         ['Simulation'],
  '/lab':                ['BRAIN Lab'],
  '/agents/ceo':         ['Agents', 'CEO'],
  '/agents/product':     ['Agents', 'Product'],
  '/agents/engineering': ['Agents', 'Engineering'],
  '/agents/hr':          ['Agents', 'HR'],
  '/agents/sales':       ['Agents', 'Sales'],
  '/agents/marketing':   ['Agents', 'Marketing'],
  '/agents/finance':     ['Agents', 'Finance'],
  '/workflows':          ['Workflows'],
  '/resources':          ['Resources'],
  '/messages':           ['Messages'],
  '/observability':      ['Observability'],
}

export default function TopBar() {
  const pathname = usePathname()
  const { data: health } = useHealth()
  const crumbs = PAGE_LABELS[pathname] ?? ['BRAIN Enterprise Lab']
  const unresolved = ALERTS.filter(a => !a.resolved).length

  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{
        height: 'var(--topbar-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px]">
        <span style={{ color: 'var(--text-3)' }}>BRAIN</span>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={11} style={{ color: 'var(--text-3)' }} />
            <span
              style={{
                color: i === crumbs.length - 1 ? 'var(--text-1)' : 'var(--text-3)',
                fontWeight: i === crumbs.length - 1 ? 500 : 400,
              }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--text-3)',
          }}
        >
          <Search size={12} />
          <span>Search...</span>
          <kbd
            className="ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'var(--surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }}
          >
            ⌘K
          </kbd>
        </div>

        {/* API health */}
        {health ? (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: 'var(--green)',
            }}
          >
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            {health.backend}
          </div>
        ) : (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
            style={{
              background: 'rgba(100,116,139,0.08)',
              border: '1px solid var(--border)',
              color: 'var(--text-3)',
            }}
          >
            offline
          </div>
        )}

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
          style={{ color: 'var(--text-3)', border: '1px solid var(--border)', background: 'var(--card)' }}
        >
          <Bell size={13} />
          {unresolved > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
              style={{ background: 'var(--red)' }}
            >
              {unresolved}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
