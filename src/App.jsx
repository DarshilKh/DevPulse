import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ICPage from './pages/ICPage.jsx'
import ManagerPage from './pages/ManagerPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ICPage />} />
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
