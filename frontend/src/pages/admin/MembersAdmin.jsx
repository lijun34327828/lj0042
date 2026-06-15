import { useState, useEffect } from 'react'

function MembersAdmin() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cardTypeId: 1
  })
  const [toast, setToast] = useState(null)
  const [cardTypes, setCardTypes] = useState([])
  const [searchText, setSearchText] = useState('')
  const [cardTypeFilter, setCardTypeFilter] = useState('')

  useEffect(() => {
    fetchMembers()
    fetchCardTypes()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      if (res.ok) {
        const data = await res.json()
        setMembers(data)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const fetchCardTypes = async () => {
    try {
      const res = await fetch('/api/card-types')
      if (res.ok) {
        const data = await res.json()
        setCardTypes(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      phone: '',
      cardTypeId: 1
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      showToast('请填写完整信息', 'error')
      return
    }

    const payload = {
      ...formData,
      cardTypeId: Number(formData.cardTypeId)
    }

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        showToast('添加成功', 'success')
        setShowModal(false)
        fetchMembers()
      } else {
        showToast('添加失败', 'error')
      }
    } catch (e) {
      showToast('添加失败', 'error')
    }
  }

  const filteredMembers = members.filter(m =>
    m.name.includes(searchText) || m.phone.includes(searchText)
  ).filter(m =>
    !cardTypeFilter || m.cardTypeId === Number(cardTypeFilter)
  )

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#2c3e50' }}>会员管理</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="搜索会员姓名或手机号"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: '250px' }}
            />
            <select
              value={cardTypeFilter}
              onChange={e => setCardTypeFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="">全部卡种</option>
              {cardTypes.map(card => (
                <option key={card.id} value={card.id}>{card.name}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleAdd}>+ 新增会员</button>
          </div>
        </div>

        <div style={{ marginBottom: '12px', color: '#7f8c8d', fontSize: '14px' }}>
          当前 {filteredMembers.length} 人 / 共 {members.length} 人
        </div>

        <table>
          <thead>
            <tr>
              <th>会员ID</th>
              <th>姓名</th>
              <th>手机号</th>
              <th>卡种</th>
              <th>当前积分</th>
              <th>累计积分</th>
              <th>入会时间</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <tr key={member.id}>
                <td>#{member.id}</td>
                <td style={{ fontWeight: '500' }}>{member.name}</td>
                <td>{member.phone}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: member.cardType?.color + '20',
                      color: member.cardType?.color
                    }}
                  >
                    {member.cardType?.name}
                  </span>
                </td>
                <td style={{ fontWeight: '600', color: '#e67e22' }}>
                  {member.points.toLocaleString()}
                </td>
                <td>{member.totalPoints.toLocaleString()}</td>
                <td>{member.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">暂无会员数据</div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">新增会员</div>

            <div className="form-group">
              <label>姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入会员姓名"
              />
            </div>

            <div className="form-group">
              <label>手机号</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入手机号"
              />
            </div>

            <div className="form-group">
              <label>卡种</label>
              <select
                value={formData.cardTypeId}
                onChange={e => setFormData({ ...formData, cardTypeId: e.target.value })}
              >
                {cardTypes.map(card => (
                  <option key={card.id} value={card.id}>{card.name} (Lv.{card.level})</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>确认添加</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default MembersAdmin
