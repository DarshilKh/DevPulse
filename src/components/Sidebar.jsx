import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'IC Profile', end: true },
  { to: '/manager', label: 'Manager View' },
]

export default function Sidebar({ devName, team, level, open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="mobile-overlay"
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        id="sidebar"
        style={{
          width: '220px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.22s ease',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '0 18px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'var(--color-text)', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-bg)', fontSize: '13px', fontWeight: 700, flexShrink: 0,
          }}>D</div>
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px', color: 'var(--color-text)' }}>DevPulse</span>
        </div>

        {/* Section label */}
        <div style={{ padding: '0 18px', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Views
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '0 10px', flex: 1 }}>
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '7px', marginBottom: '2px',
                textDecoration: 'none', fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-text)' : 'var(--color-text-2)',
                background: isActive ? 'var(--color-bg)' : 'transparent',
                border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                transition: 'all 0.12s',
              })}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', opacity: 0.4, flexShrink: 0 }} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User chip */}
        {devName && (
          <div style={{ margin: '16px 10px 0', padding: '12px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--color-text)', color: 'var(--color-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, marginBottom: '8px',
            }}>{devName.charAt(0)}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>{devName}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-2)', marginTop: '2px' }}>{team} · {level}</div>
          </div>
        )}
      </aside>
    </>
  )
}
