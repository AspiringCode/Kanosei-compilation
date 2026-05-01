'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, MessageSquare, FlaskConical, GitBranch,
  Database, Eye, Crown, Package, Code2, Users, TrendingUp,
  Megaphone, DollarSign, ChevronDown, ChevronRight,
  Zap, Menu, X, Activity, Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGENTS } from '@/lib/mock-data'
import { useHealth } from '@/lib/hooks'
import type { AgentId } from '@/lib/types'

const AGENT_ICONS: Record<AgentId, React.ReactNode> = {
  ceo:         <Crown size={13} />,
  product:     <Package size={13} />,
  engineering: <Code2 size={13} />,
  hr:          <Users size={13} />,
  sales:       <TrendingUp size={13} />,
  marketing:   <Megaphone size={13} />,
  finance:     <DollarSign size={13} />,
}

const AGENT_COLOR: Record<AgentId, string> = {
  ceo:         'var(--agent-ceo)',
  product:     'var(--agent-product)',
  engineering: 'var(--agent-engineering)',
  hr:          'var(--agent-hr)',
  sales:       'var(--agent-sales)',
  marketing:   'var(--agent-marketing)',
  finance:     'var(--agent-finance)',
}

const STATUS_COLOR: Record<string, string> = {
  active:  'var(--green)',
  busy:    'var(--amber)',
  idle:    'var(--sky)',
  error:   'var(--red)',
  offline: 'var(--text-3)',
}

const CORE_NAV = [
  { href: '/dashboard',    label: 'Dashboard',   icon: <LayoutDashboard size={14} /> },
  { href: '/chat',         label: 'Command',      icon: <MessageSquare size={14} />, tag: 'Chat' },
  { href: '/simulation',   label: 'Simulation',   icon: <Activity size={14} /> },
  { href: '/lab',          label: 'BRAIN Lab',    icon: <FlaskConical size={14} /> },
]

const OPS_NAV = [
  { href: '/workflows',     label: 'Workflows',     icon: <GitBranch size={14} /> },
  { href: '/resources',     label: 'Resources',     icon: <Database size={14} /> },
  { href: '/messages',      label: 'Messages',      icon: <MessageSquare size={14} /> },
  { href: '/observability', label: 'Observability', icon: <Eye size={14} /> },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [agentsOpen, setAgentsOpen] = useState(true)
  const { data: health } = useHealth()

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--indigo)', boxShadow: '0 0 14px rgba(99,102,241,0.4)' }}
        >
          <Zap size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-bold" style={{ color: 'var(--text-1)', letterSpacing: '0.05em' }}>
            BRAIN
          </div>
          <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-3)' }}>
            Enterprise Lab
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden cursor-pointer" style={{ color: 'var(--text-3)' }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* API health */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px]"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--text-3)' }}>API</span>
        {health ? (
          <span className="flex items-center gap-1.5" style={{ color: 'var(--green)' }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            {health.backend}
          </span>
        ) : (
          <span style={{ color: 'var(--text-3)' }}>offline</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">

        {/* Core */}
        <div>
          <div className="section-label px-2 mb-2">Core</div>
          <div className="space-y-0.5">
            {CORE_NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  className={cn('nav-item', active && 'active')}>
                  <span style={{ color: item.tag && !active ? 'var(--indigo-2)' : 'inherit' }}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.tag && !active && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--indigo-2)' }}
                    >
                      {item.tag}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Agents */}
        <div>
          <button
            onClick={() => setAgentsOpen(o => !o)}
            className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer"
          >
            <span className="section-label">Agents</span>
            {agentsOpen
              ? <ChevronDown size={11} style={{ color: 'var(--text-3)' }} />
              : <ChevronRight size={11} style={{ color: 'var(--text-3)' }} />}
          </button>
          {agentsOpen && (
            <div className="space-y-0.5">
              {AGENTS.map(agent => {
                const active = pathname === `/agents/${agent.id}`
                return (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    className={cn('nav-item', active && 'active')}
                    style={active ? { color: AGENT_COLOR[agent.id], borderColor: `${AGENT_COLOR[agent.id]}30`, background: `${AGENT_COLOR[agent.id]}12` } : {}}
                  >
                    <span style={{ color: AGENT_COLOR[agent.id] }}>{AGENT_ICONS[agent.id]}</span>
                    <span className="flex-1">{agent.name}</span>
                    <Circle
                      size={6}
                      fill={STATUS_COLOR[agent.status]}
                      style={{ color: STATUS_COLOR[agent.status], flexShrink: 0 }}
                    />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Operations */}
        <div>
          <div className="section-label px-2 mb-2">Operations</div>
          <div className="space-y-0.5">
            {OPS_NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn('nav-item', pathname === item.href && 'active')}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background: 'var(--indigo)' }}
          >
            M
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium truncate" style={{ color: 'var(--text-1)' }}>MANAGER</div>
            <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>Admin access</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        aria-label="Open navigation"
      >
        <Menu size={15} style={{ color: 'var(--text-2)' }} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 h-full">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
