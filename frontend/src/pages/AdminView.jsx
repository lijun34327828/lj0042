import { useState, useEffect } from 'react'
import Dashboard from './admin/Dashboard'
import CardTypes from './admin/CardTypes'
import PointsRules from './admin/PointsRules'
import BenefitsAdmin from './admin/BenefitsAdmin'
import MembersAdmin from './admin/MembersAdmin'

function AdminView() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', name: '数据面板', icon: '📊' },
    { id: 'cards', name: '卡种管理', icon: '💳' },
    { id: 'points', name: '积分规则', icon: '⭐' },
    { id: 'benefits', name: '权益管理', icon: '🎁' },
    { id: 'members', name: '会员管理', icon: '👥' }
  ]

  return (
    <div className="page-content">
      <h1 className="page-title">后台管理</h1>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.name}
          </div>
        ))}
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'cards' && <CardTypes />}
      {activeTab === 'points' && <PointsRules />}
      {activeTab === 'benefits' && <BenefitsAdmin />}
      {activeTab === 'members' && <MembersAdmin />}
    </div>
  )
}

export default AdminView
