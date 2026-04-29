export default function PRTable({ prs }) {
  if (!prs.length) return null
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Pull requests
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['PR', 'Review wait', 'Merge time', 'Lines', 'Rounds'].map(h => (
                <th key={h} style={{ padding: '10px 18px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', textAlign: 'left', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prs.map((pr, i) => (
              <tr key={pr.pr_id} style={{ borderBottom: i < prs.length - 1 ? '1px solid var(--color-border)' : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '11px 18px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>{pr.pr_id}</td>
                <td style={{ padding: '11px 18px', fontSize: '13px', color: pr.review_wait_hours > 20 ? '#d97706' : 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>{pr.review_wait_hours.toFixed(1)}h</td>
                <td style={{ padding: '11px 18px', fontSize: '13px', color: 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>{pr.merge_time_hours.toFixed(1)}h</td>
                <td style={{ padding: '11px 18px', fontSize: '13px', color: pr.lines_changed > 500 ? '#d97706' : 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>{pr.lines_changed}</td>
                <td style={{ padding: '11px 18px' }}>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 500,
                    background: pr.review_rounds >= 3 ? '#fffbeb' : '#f0fdf4',
                    color: pr.review_rounds >= 3 ? '#d97706' : '#16a34a',
                  }}>{pr.review_rounds}×</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
