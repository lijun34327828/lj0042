import { useState, useEffect } from 'react'
import MemberCard from '../components/MemberCard'
import BenefitItem from '../components/BenefitItem'
import BenefitModal from '../components/BenefitModal'

const defaultPhone = '13800138001'

function MemberView() {
  const [phone, setPhone] = useState(defaultPhone)
  const [member, setMember] = useState(null)
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [activeTab, setActiveTab] = useState('available')

  useEffect(() => {
    if (phone) {
      fetchMember()
    }
  }, [phone])

  const fetchMember = async () => {
    if (!phone) return
    setLoading(true)
    try {
      const res = await fetch(`/api/member/${phone}`)
      if (res.ok) {
        const data = await res.json()
        setMember(data)
        setBenefits(data.benefits)
      } else {
        setMember(null)
        setBenefits([])
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const filteredBenefits = benefits.filter(b => {
    if (activeTab === 'all') return true
    return b.status === activeTab
  })

  const availableCount = benefits.filter(b => b.status === 'available').length
  const usedCount = benefits.filter(b => b.status === 'used').length
  const expiredCount = benefits.filter(b => b.status === 'expired').length

  return (
    <div className="page-content">
      <h1 className="page-title">我的会员卡</h1>

      <div className="card">
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="请输入手机号查询会员信息"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ flex: 1, maxWidth: '300px' }}
          />
          <button className="btn btn-primary" onClick={fetchMember}>查询</button>
        </div>

        {loading && <p>加载中...</p>}

        {!loading && !member && phone && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">未找到该会员信息</div>
          </div>
        )}

        {!loading && member && (
          <>
            <MemberCard member={member} />

            <div className="stats-grid" style={{ marginTop: '32px' }}>
              <div className="stat-card">
                <div className="stat-label">可用权益</div>
                <div className="stat-value" style={{ color: '#27ae60' }}>{availableCount}</div>
                <div className="stat-trend up">项待使用</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">累计积分</div>
                <div className="stat-value">{member.totalPoints.toLocaleString()}</div>
                <div className="stat-trend up">总获得积分</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">会员等级</div>
                <div className="stat-value" style={{ color: '#667eea' }}>Lv.{member.cardType.level}</div>
                <div className="stat-trend">{member.cardType.name}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">已使用权益</div>
                <div className="stat-value" style={{ color: '#7f8c8d' }}>{usedCount}</div>
                <div className="stat-trend">项已核销</div>
              </div>
            </div>

            <div className="card" style={{ padding: 0, boxShadow: 'none' }}>
              <div className="tabs-inline">
                <div
                  className={`tab-inline ${activeTab === 'available' ? 'active' : ''}`}
                  onClick={() => setActiveTab('available')}
                >
                  待使用 ({availableCount})
                </div>
                <div
                  className={`tab-inline ${activeTab === 'used' ? 'active' : ''}`}
                  onClick={() => setActiveTab('used')}
                >
                  已使用 ({usedCount})
                </div>
                <div
                  className={`tab-inline ${activeTab === 'expired' ? 'active' : ''}`}
                  onClick={() => setActiveTab('expired')}
                >
                  已过期 ({expiredCount})
                </div>
                <div
                  className={`tab-inline ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  全部
                </div>
              </div>

              {filteredBenefits.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">暂无{activeTab === 'available' ? '待使用' : activeTab === 'used' ? '已使用' : activeTab === 'expired' ? '已过期' : ''}权益</div>
                </div>
              ) : (
                <div className="benefits-list">
                  {filteredBenefits.map(mb => (
                    <BenefitItem
                      key={mb.id}
                      memberBenefit={mb}
                      onClick={() => setSelectedBenefit(mb)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!loading && !member && !phone && (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <div className="empty-state-text">请输入手机号查询会员信息</div>
          </div>
        )}
      </div>

      {selectedBenefit && (
        <BenefitModal
          memberBenefit={selectedBenefit}
          onClose={() => setSelectedBenefit(null)}
        />
      )}
    </div>
  )
}

export default MemberView
