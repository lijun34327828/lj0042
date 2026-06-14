import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import MemberView from './pages/MemberView.jsx'
import RedeemView from './pages/RedeemView.jsx'
import AdminView from './pages/AdminView.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-brand">会员积分管理系统</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">用户端</Link>
            <Link to="/redeem" className="nav-link">前台核销</Link>
            <Link to="/admin" className="nav-link">后台管理</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<MemberView />} />
          <Route path="/redeem" element={<RedeemView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
