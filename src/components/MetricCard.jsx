const STATUS = {
  good:    { color: '#16a34a', bg: '#f0fdf4', label: 'Good' },
  warn:    { color: '#d97706', bg: '#fffbeb', label: 'Watch' },
  bad:     { color: '#dc2626', bg: '#fef2f2', label: 'Alert' },
  neutral: { color: '#2563eb', bg: '#eff4ff', label: '' },
}

function Trend({ current, prev, lowerIsBetter }) {
  if (prev === undefined || prev === null) return null
  const diff = current - prev
  if (Math.abs(diff) < 0.05) return null
  const improved = lowerIsBetter ? diff < 0 : diff > 0
  const pct = Math.abs((diff / prev) * 100).toFixed(0)
  return (
    <span style={{
      fontSize: '11px', fontFamily: 'var(--font-mono)',
      color: improved ? '#16a34a' : '#dc2626',
      fontWeight: 500,
    }}>
      {improved ? '↓' : '↑'} {pct}%
    </span>
  )
}

export default function MetricCard({ label, value, unit, status, prevValue, lowerIsBetter = true, detail }) {
  const s = STATUS[status] || STATUS.neutral
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: '4px',
      transition: 'box-shadow 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </span>
        {s.label && (
          <span style={{ fontSize: '10px', fontWeight: 600, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: '4px' }}>
            {s.label}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
        <span style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-text)' }}>
          {value}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>{unit}</span>
        <Trend current={parseFloat(value)} prev={prevValue} lowerIsBetter={lowerIsBetter} />
      </div>
      {detail && <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '2px' }}>{detail}</div>}
    </div>
  )
}
