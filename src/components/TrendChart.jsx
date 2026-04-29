import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--color-border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    }}>
      <div style={{ color: 'var(--color-text-2)', marginBottom: '6px', fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: 'var(--color-text)', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ color: 'var(--color-text-2)' }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px', padding: '18px 20px',
    }}>
      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Trend
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#9b9590', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9b9590', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="leadTime" name="Lead Time" stroke="#2563eb" strokeWidth={1.5} dot={{ fill: '#2563eb', r: 3, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="cycleTime" name="Cycle Time" stroke="#7c3aed" strokeWidth={1.5} dot={{ fill: '#7c3aed', r: 3, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="bugRate" name="Bug Rate" stroke="#dc2626" strokeWidth={1.5} dot={{ fill: '#dc2626', r: 3, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '14px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Lead Time', color: '#2563eb' },
          { label: 'Cycle Time', color: '#7c3aed' },
          { label: 'Bug Rate', color: '#dc2626' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>
            <div style={{ width: '16px', height: '2px', background: color, borderRadius: '1px' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
