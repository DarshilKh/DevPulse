import { useState } from 'react'
import Sidebar from './Sidebar.jsx'

export default function Layout({ children, devName, team, level }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar
        devName={devName}
        team={team}
        level={level}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="main-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children({ openSidebar: () => setOpen(true) })}
      </div>

      <style>{`
        @media (min-width: 768px) {
          #sidebar {
            transform: translateX(0) !important;
            position: fixed !important;
          }
          .main-content {
            margin-left: 220px;
          }
          .mobile-overlay {
            display: none !important;
          }
          .hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}