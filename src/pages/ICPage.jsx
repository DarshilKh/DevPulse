import { useState, useMemo } from 'react'
import { developers, metrics, MONTHS, MONTH_LABELS } from '../data/rawData.js'
import { getInterpretation, getDeveloperPRs, getDeveloperBugs } from '../data/interpret.js'
import MetricCard from '../components/MetricCard.jsx'
import InterpretPanel from '../components/InterpretPanel.jsx'
import PRTable from '../components/PRTable.jsx'
import TrendChart from '../components/TrendChart.jsx'
import Layout from '../components/Layout.jsx'

const PATTERN = {
  'Healthy flow':  { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Quality watch': { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'Needs review':  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
}

export default function ICPage() {
  const [selectedDev, setSelectedDev] = useState('DEV-001')
  const [selectedMonth, setSelectedMonth] = useState('2026-04')

  const dev = developers.find(d => d.developer_id === selectedDev)
  const current = metrics.find(m => m.developer_id === selectedDev && m.month === selectedMonth)
  const prevMonth = MONTHS[MONTHS.indexOf(selectedMonth) - 1]
  const prev = metrics.find(m => m.developer_id === selectedDev && m.month === prevMonth)

  const prs = useMemo(() => getDeveloperPRs(selectedDev, selectedMonth), [selectedDev, selectedMonth])
  const bugs = useMemo(() => getDeveloperBugs(selectedDev, selectedMonth), [selectedDev, selectedMonth])
  const interp = useMemo(() => current ? getInterpretation(current, prs) : null, [current, prs])

  const trendData = useMemo(() => MONTHS.map(m => {
    const mt = metrics.find(x => x.developer_id === selectedDev && x.month === m)
    if (!mt) return null
    return { month: MONTH_LABELS[m], leadTime: mt.avg_lead_time_days, cycleTime: mt.avg_cycle_time_days, bugRate: mt.bug_rate_pct }
  }).filter(Boolean), [selectedDev])

  if (!current || !interp) return null
  const pat = PATTERN[current.pattern_hint] || PATTERN['Healthy flow']

  return (
    <Layout devName={dev?.developer_name} team={dev?.team_name} level={dev?.level}>
      {({ openSidebar }) => (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

          {/* ── Topbar ── */}
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

            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>IC Profile</span>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedDev}
                  onChange={e => setSelectedDev(e.target.value)}
                  style={{
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    borderRadius: '7px', padding: '6px 28px 6px 10px',
                    fontSize: '13px', fontFamily: 'var(--font-body)',
                    color: 'var(--color-text)', cursor: 'pointer', outline: 'none',
                  }}
                >
                  {developers.map(d => (
                    <option key={d.developer_id} value={d.developer_id}>{d.developer_name}</option>
                  ))}
                </select>
                <span style={{
                  position: 'absolute', right: '9px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '10px',
                  color: 'var(--color-text-3)', pointerEvents: 'none',
                }}>▾</span>
              </div>

              <div style={{
                display: 'flex', background: 'var(--color-surface)',
                border: '1px solid var(--color-border)', borderRadius: '7px',
                padding: '3px', gap: '2px',
              }}>
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
            </div>
          </header>

          {/* ── Page body ── */}
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Identity row */}
            <div className="anim anim-1" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--color-text)', color: 'var(--color-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', fontWeight: 700,
              }}>{dev?.developer_name.charAt(0)}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>{dev?.developer_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-2)', marginTop: '1px' }}>
                  {dev?.team_name} · {dev?.level} · {dev?.service_type}
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                color: pat.color, background: pat.bg, border: `1px solid ${pat.border}`,
              }}>{current.pattern_hint}</span>
            </div>

            {/* Metrics row */}
            <div className="anim anim-2 metrics-5col" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
            }}>
              <MetricCard label="Lead Time"     value={current.avg_lead_time_days.toFixed(1)} unit="d"       status={interp.leadStatus}  prevValue={prev?.avg_lead_time_days}                              lowerIsBetter detail="PR open → prod deploy" />
              <MetricCard label="Cycle Time"    value={current.avg_cycle_time_days.toFixed(1)} unit="d"      status={interp.cycleStatus} prevValue={prev?.avg_cycle_time_days}                             lowerIsBetter detail="In progress → done" />
              <MetricCard label="PR Throughput" value={current.merged_prs}                     unit="merged" status="neutral"            prevValue={prev?.merged_prs}                                      lowerIsBetter={false} detail="Pull requests merged" />
              <MetricCard label="Deploy Freq."  value={current.prod_deployments}               unit="/"      status="neutral"            prevValue={prev?.prod_deployments}                                lowerIsBetter={false} detail="Production deployments" />
              <MetricCard label="Bug Rate"      value={`${(current.bug_rate_pct * 100).toFixed(0)}%`}        status={interp.bugStatus}   prevValue={prev ? prev.bug_rate_pct * 100 : undefined}            lowerIsBetter detail={`${current.escaped_bugs} escaped bug${current.escaped_bugs !== 1 ? 's' : ''}`} />
            </div>

            {/* Main 3-col */}
            <div className="main-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '16px', alignItems: 'start' }}>

              {/* Col 1 — Interpretation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <InterpretPanel story={interp.story} signals={interp.signals} actions={interp.actions} />
              </div>

              {/* Col 2 — Trend + PR Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="anim anim-3"><TrendChart data={trendData} /></div>
                <div className="anim anim-6"><PRTable prs={prs} /></div>
              </div>

              {/* Col 3 — Side panels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Review health */}
                <div className="anim anim-5" style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: '10px', padding: '18px 20px',
                }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Review health
                  </div>
                  {[
                    { label: 'Avg review wait', val: `${interp.avgReviewWait.toFixed(1)}h`, warn: interp.avgReviewWait > 20 },
                    { label: 'PRs this month',   val: prs.length,  warn: false },
                    { label: 'Escaped bugs',      val: bugs.length, warn: bugs.length > 0 },
                  ].map(({ label, val, warn }, i, arr) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>{label}</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: warn ? '#d97706' : 'var(--color-text)' }}>{val}</span>
                    </div>
                  ))}

                  {bugs.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {bugs.map(b => (
                        <div key={b.bug_id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 10px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca',
                        }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>{b.bug_id}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-2)' }}>{b.root_cause_bucket}</span>
                          <span style={{
                            padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 600, color: '#fff',
                            background: b.severity === 'high' ? '#dc2626' : b.severity === 'medium' ? '#d97706' : '#6b7280',
                          }}>{b.severity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PR activity */}
                <div style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: '10px', padding: '18px 20px',
                }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    PR activity
                  </div>
                  {prs.length > 0 ? [
                    { label: 'Avg lines / PR',    val: Math.round(prs.reduce((s, p) => s + p.lines_changed, 0) / prs.length) },
                    { label: 'Avg review rounds', val: (prs.reduce((s, p) => s + p.review_rounds, 0) / prs.length).toFixed(1) },
                    { label: 'Avg merge time',    val: `${(prs.reduce((s, p) => s + p.merge_time_hours, 0) / prs.length).toFixed(1)}h` },
                  ].map(({ label, val }, i, arr) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>{label}</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{val}</span>
                    </div>
                  )) : (
                    <p style={{ fontSize: '13px', color: 'var(--color-text-3)', margin: 0 }}>No PRs this month.</p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Responsive styles */}
          <style>{`
            @media (max-width: 900px) {
              .metrics-5col { grid-template-columns: repeat(3, 1fr) !important; }
              .main-3col    { grid-template-columns: 1fr !important; }
            }
            @media (max-width: 560px) {
              .metrics-5col { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </div>
      )}
    </Layout>
  )
}