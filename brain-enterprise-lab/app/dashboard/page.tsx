'use client'

import { motion } from 'framer-motion'
import {
  Crown, Package, Code2, Users, TrendingUp, Megaphone, DollarSign,
  AlertTriangle, XCircle, Zap, Circle, ArrowRight, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts'
import Link from 'next/link'
import {
  AGENTS, COMPANY_KPIS, ACTIVITY_FEED, ALERTS,
  TASK_THROUGHPUT, REVENUE_FORECAST, BUDGET_ALLOCATIONS,
} from '@/lib/mock-data'
import { useHealth, useAudit } from '@/lib/hooks'
import type { AgentId } from '@/lib/types'

const AGENT_ICONS: Record<AgentId, React.ReactNode> = {
  ceo: <Crown size={13} />, product: <Package size={13} />, engineering: <Code2 size={13} />,
  hr: <Users size={13} />, sales: <TrendingUp size={13} />, marketing: <Megaphone size={13} />,
  finance: <DollarSign size={13} />,
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
const STATUS_DOT: Record<string, string> = {
  active: 'var(--green)', busy: 'var(--amber)', idle: 'var(--sky)', error: 'var(--red)', offline: 'var(--text-3)',
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut', delay },
})

export default function DashboardPage() {
  const { data: health } = useHealth()
  const { data: audit  } = useAudit(12)

  const unresolvedAlerts = ALERTS.filter(a => !a.resolved)

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* API banner */}
      {health && (
        <motion.div {...fade()} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
          <span className="live-dot" style={{ width: 7, height: 7 }} />
          <span className="text-[12px]" style={{ color: 'var(--green)' }}>
            Backend connected — {health.backend} · {health.status}
          </span>
        </motion.div>
      )}

      {/* Alert banner */}
      {unresolvedAlerts.length > 0 && (
        <motion.div {...fade(0.04)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
          <span className="text-[12px]" style={{ color: 'var(--red)' }}>
            {unresolvedAlerts.length} unresolved alert{unresolvedAlerts.length > 1 ? 's' : ''} — review required
          </span>
        </motion.div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {COMPANY_KPIS.slice(0, 4).map((kpi, i) => (
          <motion.div key={kpi.label} {...fade(i * 0.06)} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{kpi.label}</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                style={{
                  color:       kpi.trend === 'up'   ? 'var(--green)' : kpi.trend === 'down' ? 'var(--red)' : 'var(--text-3)',
                  background:  kpi.trend === 'up'   ? 'rgba(34,197,94,0.08)' : kpi.trend === 'down' ? 'rgba(239,68,68,0.08)' : 'transparent',
                }}
              >
                {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '—'} {kpi.delta != null ? Math.abs(kpi.delta) : 0}%
              </span>
            </div>
            <div className="font-display text-2xl font-bold" style={{ color: 'var(--text-1)' }}>{kpi.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{kpi.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Revenue chart (3/5) */}
        <motion.div {...fade(0.1)} className="card p-5 xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Revenue Forecast</h3>
            <span className="badge status-active" style={{ fontSize: 10 }}>+14.2% MoM</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={REVENUE_FORECAST} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--indigo)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--indigo)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                cursor={{ stroke: 'var(--border)' }}
              />
              <Area type="monotone" dataKey="actual"   stroke="var(--indigo)" fill="url(#revGrad)" strokeWidth={1.5} name="Actual" />
              <Area type="monotone" dataKey="projected" stroke="var(--indigo-2)" fill="none" strokeDasharray="4 3" strokeWidth={1.2} name="Projected" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Throughput (2/5) */}
        <motion.div {...fade(0.12)} className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Task Throughput</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TASK_THROUGHPUT.slice(-7)} margin={{ top: 4, right: 0, bottom: 0, left: -24 }} barSize={10}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              />
              <Bar dataKey="completed" name="Completed" fill="var(--green)"  radius={[3,3,0,0]} opacity={0.9} />
              <Bar dataKey="failed"    name="Failed"    fill="var(--red)"    radius={[3,3,0,0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Agents + Budget + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Agent health */}
        <motion.div {...fade(0.14)} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Agent Health</h3>
            <Link href="/agents/ceo" className="text-[11px] flex items-center gap-1" style={{ color: 'var(--indigo-2)' }}>
              All <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-2">
            {AGENTS.map(agent => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
              >
                <span style={{ color: AGENT_COLOR[agent.id as AgentId] }}>{AGENT_ICONS[agent.id as AgentId]}</span>
                <span className="flex-1 text-[12.5px] font-medium" style={{ color: 'var(--text-1)' }}>{agent.name}</span>
                <div className="flex items-center gap-2">
                  <div className="progress w-16" style={{ height: 3 }}>
                    <div className="progress-fill" style={{ width: `${agent.resourceUsage}%`, background: AGENT_COLOR[agent.id as AgentId] }} />
                  </div>
                  <span className="text-[10px] w-7 text-right" style={{ color: 'var(--text-3)' }}>{agent.resourceUsage}%</span>
                </div>
                <Circle size={6} fill={STATUS_DOT[agent.status]} style={{ color: STATUS_DOT[agent.status], flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Budget */}
        <motion.div {...fade(0.16)} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Budget Allocation</h3>
          </div>
          <div className="space-y-3">
            {BUDGET_ALLOCATIONS.map(b => {
              const pct = Math.round((b.spent / b.allocated) * 100)
              const over = pct >= 90
              return (
                <div key={b.department}>
                  <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'var(--text-3)' }}>
                    <span>{b.department}</span>
                    <span style={{ color: over ? 'var(--amber)' : 'var(--text-3)' }}>${b.spent.toLocaleString()} / ${b.allocated.toLocaleString()}</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: over ? 'var(--amber)' : 'var(--indigo)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Activity feed — live audit or mock */}
        <motion.div {...fade(0.18)} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Activity Feed</h3>
            {audit && (
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--green)' }}>
                <span className="live-dot" style={{ width: 5, height: 5 }} /> live
              </span>
            )}
          </div>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
            {audit
              ? audit.map(ev => (
                  <div key={ev.id} className="flex gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--indigo)' }} />
                    <div>
                      <div className="text-[11px] font-medium" style={{ color: 'var(--text-1)' }}>{ev.event_type}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                        {ev.actor} · {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              : ACTIVITY_FEED.slice(0, 10).map(ev => (
                  <div key={ev.id} className="flex gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background: ev.severity === 'error'   ? 'var(--red)'
                                  : ev.severity === 'warning' ? 'var(--amber)'
                                  : 'var(--indigo)',
                      }}
                    />
                    <div>
                      <div className="text-[11px] font-medium" style={{ color: 'var(--text-1)' }}>{ev.title}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                        {ev.agentId} · {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      {unresolvedAlerts.length > 0 && (
        <motion.div {...fade(0.2)} className="card p-5">
          <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Active Alerts</h3>
          <div className="space-y-2">
            {unresolvedAlerts.map(alert => (
              <div
                key={alert.id}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                style={{
                  background: alert.severity === 'critical' || alert.severity === 'error'
                    ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                  border: `1px solid ${alert.severity === 'critical' || alert.severity === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                }}
              >
                {alert.severity === 'critical' || alert.severity === 'error'
                  ? <XCircle size={13} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 1 }} />
                  : <AlertTriangle size={13} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />}
                <div>
                  <div className="text-[12px] font-medium" style={{ color: 'var(--text-1)' }}>{alert.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{alert.description}</div>
                </div>
                <span className="ml-auto text-[10px] flex-shrink-0" style={{ color: 'var(--text-3)' }}>
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
