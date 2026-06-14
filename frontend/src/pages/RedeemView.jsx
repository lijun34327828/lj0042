import { useState, useEffect } from 'react'

function RedeemView() {
  const [phone, setPhone] = useState('')
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [toast, setToast] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    fetchRecentRecords()
    const interval = setInterval(fetchRecentRecords, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchRecentRecords = async () => {
    try {
      const res = await fetch('/api/redemption-records?limit=10')
      if (res.ok) {
        const data = await res.json()
        setRecentRecords(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const searchMember = async () => {
    if (!phone) {
      showToast('请输入手机号', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/member/${phone}`)
      if (res.ok) {
        const data = await res.json()
        setMember(data)
      } else {
        setMember(null)
        showToast('未找到该会员', 'error')
      }
    } catch (e) {
      showToast('查询失败', 'error')
    }
    setLoading(false)
  }

  const redeemBenefit = async (benefitId) => {
    if (!confirm('确认核销该权益？')) return

    setRedeeming(true)
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          benefitId,
          operator: '前台操作员'
        })
      })

      if (res.ok) {
        const data = await res.json()
        showToast('核销成功！', 'success')
        searchMember()
        fetchRecentRecords()
      } else {
        const err = await res.json()
        showToast(err.error || '核销失败', 'error')
      }
    } catch (e) {
      showToast('核销失败', 'error')
    }
    setRedeeming(false)
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const availableBenefits = member?.benefits?.filter(b => b.status === 'available') || []

  const simulateScan = () => {
    setShowScanner(true)
    setTimeout(() => {
      setPhone('13800138001')
      setShowScanner(false)
      searchMember()
    }, 1500)
  }

  return (
    <div className="page-content">
      <h1 className="page-title">前台核销</h1>

      <div className="redeem-container">
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>会员核验</h3>
          <div className="redeem-input-group">
            <input
              type="text"
              placeholder="请输入会员手机号"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && searchMember()}
            />
            <button
              className="btn btn-primary"
              onClick={searchMember}
              disabled={loading}
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 0', borderTop: '1px dashed #eee' }}>
            <button
              className="btn btn-secondary"
              onClick={simulateScan}
              disabled={showScanner}
            >
              {showScanner ? '扫码中...' : '📷 扫码核验'}
            </button>
            <p style={{ fontSize: '12px', color: '#95a5a6', marginTop: '8px' }}>
              扫描会员二维码快速核验
            </p>
          </div>
        </div>

        {member && (
          <div className="member-info-panel">
            <div className="member-info-header">
              <div className="member-avatar">
                {member.name?.charAt(0) || '会'}
              </div>
              <div className="member-details">
                <h3>{member.name}</h3>
                <p>{member.phone}</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: member.cardType?.color || '#667eea',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {member.cardType?.name}
                </div>
                <div style={{ fontSize: '14px', marginTop: '8px', color: '#7f8c8d' }}>
                  积分: <strong style={{ color: '#2c3e50' }}>{member.points.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="benefits-to-redeem">
              <h4>可核销权益 ({availableBenefits.length}项)</h4>
              {availableBenefits.length === 0 ? (
                <p style={{ color: '#95a5a6', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  暂无可用权益
                </p>
              ) : (
                availableBenefits.map(mb => (
                  <div key={mb.id} className="benefit-redeem-item">
                    <div className="benefit-redeem-info">
                      <h5>{mb.benefit?.name}</h5>
                      <p>{mb.benefit?.description}</p>
                      <p style={{ color: '#e67e22' }}>有效期至: {mb.expireDate}</p>
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => redeemBenefit(mb.benefitId)}
                      disabled={redeeming}
                    >
                      {redeeming ? '核销中...' : '核销'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>今日核销记录</h3>
          {recentRecords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">暂无核销记录</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>会员</th>
                  <th>权益</th>
                  <th>操作员</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map(record => (
                  <tr key={record.id}>
                    <td style={{ fontSize: '13px' }}>{record.time}</td>
                    <td>会员{record.memberId}</td>
                    <td>权益#{record.benefitId}</td>
                    <td>{record.operator}</td>
                    <td>
                      <span className={`badge ${record.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                        {record.status === 'success' ? '成功' : '失败'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p style={{ fontSize: '12px', color: '#95a5a6', marginTop: '12px', textAlign: 'center' }}>
            自动刷新中...
          </p>
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default RedeemView
