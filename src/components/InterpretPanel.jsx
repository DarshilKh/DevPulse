const TYPE = {
  good: { border: '#bbf7d0', bg: '#f0fdf4', dot: '#16a34a', icon: '✓' },
  info: { border: '#bfdbfe', bg: '#eff6ff', dot: '#2563eb', icon: '→' },
  warn: { border: '#fde68a', bg: '#fffbeb', dot: '#d97706', icon: '!' },
  risk: { border: '#fecaca', bg: '#fef2f2', dot: '#dc2626', icon: '⚠' },
}

const PRIORITY = {
  high:   { label: 'High priority',   color: '#dc2626' },
  medium: { label: 'Medium priority', color: '#d97706' },
  low:    { label: 'Low priority',    color: '#16a34a' },
}

export default function InterpretPanel({ story, signals, actions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Story */}
      <div className="anim anim-3" style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '20px',
      }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          What the data suggests
        </div>
        <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.7, margin: 0 }}>{story}</p>
      </div>

      {/* Signals */}
      <div className="anim anim-4">
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Signal breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {signals.map((sig, i) => {
            const t = TYPE[sig.type] || TYPE.info
            return (
              <div key={i} style={{
                background: t.bg, border: `1px solid ${t.border}`,
                borderRadius: '8px', padding: '12px 14px',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <span style={{ color: t.dot, fontSize: '13px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{t.icon}</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.6 }}>{sig.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="anim anim-5">
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Suggested next steps
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {actions.map((action, i) => (
            <div key={i} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px', padding: '14px 16px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{action.icon}</span>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: PRIORITY[action.priority]?.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {PRIORITY[action.priority]?.label}
                </span>
                <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.65, margin: '4px 0 0' }}>{action.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
