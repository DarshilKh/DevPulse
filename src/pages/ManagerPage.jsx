import { useState, useMemo } from 'react'
import { managerSummary, metrics, developers, MONTHS, MONTH_LABELS } from '../data/rawData.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Layout from '../components/Layout.jsx'

const SIGNAL = {
  'Healthy flow':      { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Watch bottlenecks': { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'Needs review':      { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ color: 'var(--color-text-2)' }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ManagerPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-04')

  const summaries = managerSummary.filter(m => m.month === selectedMonth)

  const teamBreakdown = useMemo(() => summaries.map(mgr => {
    const members = developers.filter(d => d.manager_id === mgr.manager_id)
    const memberMetrics = members.map(dev => {
      const m = metrics.find(x => x.developer_id === dev.developer_id && x.month === selectedMonth)
      return { ...dev, ...m }
    }).filter(m => m.avg_cycle_time_days)
    return { ...mgr, members: memberMetrics }
  }), [selectedMonth])

  const chartData = teamBreakdown.map(t => ({
    team: t.manager_name.split(' ')[0],
    'Lead Time': +t.avg_lead_time_days.toFixed(2),
    'Cycle Time': +t.avg_cycle_time_days.toFixed(2),
    'Bug %': +(t.avg_bug_rate_pct * 100).toFixed(1),
  }))

  return (
    <Layout>
      {({ openSidebar }) => (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

          {/* Topbar */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 30,
            background: 'rgba(248,247,244,0.95)', backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--color-border)',
            height: '54px', padding: '0 24px',
            display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
          }}>

            {/* ── hamburger — hidden on desktop via Layout.jsx media query ── */}
            <button
              className="hamburger-btn"
              onClick={openSidebar}
              aria-label="Menu"
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: '5px 9px',
                fontSize: '15px',
                color: 'var(--color-text)',
                lineHeight: 1,
              }}
            >☰</button>

            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Manager View</span>

            <div style={{ marginLeft: 'auto', display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '7px', padding: '3px', gap: '2px' }}>
              {MONTHS.map(m => (
                <button key={m} onClick={() => setSelectedMonth(m)} style={{
                  padding: '4px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: 500,
                  background: selectedMonth === m ? 'var(--color-text)' : 'transparent',
                  color: selectedMonth === m ? '#fff' : 'var(--color-text-2)',
                  transition: 'all 0.12s',
                }}>{MONTH_LABELS[m]}</button>
              ))}
            </div>
          </header>

          {/* Body */}
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Section title */}
            <div className="anim anim-1">
              <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                Team health · <span style={{ color: 'var(--color-text-2)', fontWeight: 400 }}>{MONTH_LABELS[selectedMonth]}</span>
              </h2>
            </div>

            {/* Summary cards */}
            <div className="anim anim-2 mgr-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {summaries.map(mgr => {
                const s = SIGNAL[mgr.signal] || SIGNAL['Watch bottlenecks']
                return (
                  <div key={mgr.manager_id} style={{
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    borderTop: `3px solid ${s.color}`, borderRadius: '10px', padding: '18px 20px',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>{mgr.manager_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-2)', marginTop: '2px' }}>{mgr.team_size} members</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 9px', borderRadius: '4px', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                        {mgr.signal}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {[
                        { label: 'Lead',  val: `${mgr.avg_lead_time_days.toFixed(1)}d` },
                        { label: 'Cycle', val: `${mgr.avg_cycle_time_days.toFixed(1)}d` },
                        { label: 'Bugs',  val: `${(mgr.avg_bug_rate_pct * 100).toFixed(0)}%` },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ textAlign: 'center', padding: '10px 4px', background: 'var(--color-bg)', borderRadius: '7px' }}>
                          <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-text)' }}>{val}</div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Chart + tables */}
            <div className="mgr-content" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '16px', alignItems: 'start' }}>

              {/* Bar chart */}
              <div className="anim anim-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '18px 20px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Team comparison
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={chartData} barCategoryGap="32%" margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="team" tick={{ fill: '#9b9590', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9b9590', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="Lead Time"  fill="#2563eb" radius={[3,3,0,0]} />
                    <Bar dataKey="Cycle Time" fill="#7c3aed" radius={[3,3,0,0]} />
                    <Bar dataKey="Bug %"      fill="#dc2626" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {[{ l: 'Lead Time', c: '#2563eb' }, { l: 'Cycle Time', c: '#7c3aed' }, { l: 'Bug %', c: '#dc2626' }].map(({ l, c }) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: c }} />{l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team tables */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {teamBreakdown.map((team, ti) => {
                  const s = SIGNAL[team.signal] || SIGNAL['Watch bottlenecks']
                  return (
                    <div key={team.manager_id} className={`anim anim-${Math.min(ti + 4, 6)}`} style={{
                      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                      borderRadius: '10px', overflow: 'hidden',
                    }}>
                      <div style={{
                        padding: '11px 18px', borderBottom: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>{team.manager_name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>{team.members[0]?.team_name}</span>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', color: s.color, background: s.bg }}>{team.signal}</span>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            {['Developer', 'Level', 'Cycle', 'Lead', 'Bug Rate', 'Status'].map(h => (
                              <th key={h} style={{ padding: '8px 16px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', textAlign: 'left', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {team.members.map((m, i) => {
                            const ps = SIGNAL[m.pattern_hint] || SIGNAL['Watch bottlenecks']
                            return (
                              <tr key={m.developer_id}
                                style={{ borderBottom: i < team.members.length - 1 ? '1px solid var(--color-border)' : 'none', transition: 'background 0.1s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <td style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{m.developer_name}</td>
                                <td style={{ padding: '9px 16px', fontSize: '11px', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>{m.level}</td>
                                <td style={{ padding: '9px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-2)' }}>{m.avg_cycle_time_days?.toFixed(1)}d</td>
                                <td style={{ padding: '9px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-2)' }}>{m.avg_lead_time_days?.toFixed(1)}d</td>
                                <td style={{ padding: '9px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: m.bug_rate_pct > 0 ? '#dc2626' : '#16a34a' }}>
                                  {m.bug_rate_pct !== undefined ? `${(m.bug_rate_pct * 100).toFixed(0)}%` : '—'}
                                </td>
                                <td style={{ padding: '9px 16px' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', color: ps.color, background: ps.bg, border: `1px solid ${ps.border}`, whiteSpace: 'nowrap' }}>
                                    {m.pattern_hint}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .mgr-summary { grid-template-columns: 1fr !important; }
              .mgr-content  { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      )}
    </Layout>
  )
}