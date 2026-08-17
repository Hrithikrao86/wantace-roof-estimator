import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Estimator from './components/Estimator';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';

function PublicLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="public-header"><a href="/" className="brand">Northline <span>Roofing & Exteriors</span></a><a href="/admin/login" className="owner-link">Owner login</a></header>
      {children}
      <footer className="public-footer">Northline Roofing & Exteriors · Columbus, OH</footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><Estimator /></PublicLayout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
