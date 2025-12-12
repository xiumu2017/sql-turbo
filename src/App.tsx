import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TimelinePage from './pages/Timeline'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
      </Routes>
    </BrowserRouter>
  )
}