import { useState, useEffect } from 'react'

function CardTypes() {
  const [cardTypes, setCardTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '#667eea',
    level: 1,
    pointsRequired: 0,
    benefits: ''
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchCardTypes()
  }, [])

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
    setLoading(false)
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAdd = () => {
    setEditingCard(null)
    setFormData({
      name: '',
      color: '#667eea',
      level: 1,
      pointsRequired: 0,
      benefits: ''
    })
    setShowModal(true)
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setFormData({
      name: card.name,
      color: card.color,
      level: card.level,
      pointsRequired: card.pointsRequired,
      benefits: card.benefits?.join('、') || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除该卡种？')) return
    try {
      const res = await fetch(`/api/card-types/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('删除成功', 'success')
        fetchCardTypes()
      }
    } catch (e) {
      showToast('删除失败', 'error')
    }
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      showToast('请输入卡种名称', 'error')
      return
    }

    const benefitsArray = formData.benefits
      ? formData.benefits.split(/[,、]/).map(b => b.trim()).filter(Boolean)
      : []

    const payload = {
      ...formData,
      benefits: benefitsArray,
      pointsRequired: Number(formData.pointsRequired),
      level: Number(formData.level)
    }

    try {
      let res
      if (editingCard) {
        res = await fetch(`/api/card-types/${editingCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/card-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        showToast(editingCard ? '修改成功' : '添加成功', 'success')
        setShowModal(false)
        fetchCardTypes()
      }
    } catch (e) {
      showToast('操作失败', 'error')
    }
  }

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#2c3e50' }}>卡种管理</h3>
          <button className="btn btn-primary" onClick={handleAdd}>+ 新增卡种</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>卡面颜色</th>
              <th>卡种名称</th>
              <th>等级</th>
              <th>所需积分</th>
              <th>权益数量</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {cardTypes.map(card => (
              <tr key={card.id}>
                <td>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: card.color
                    }}
                  />
                </td>
                <td style={{ fontWeight: '500' }}>{card.name}</td>
                <td>Lv.{card.level}</td>
                <td>{card.pointsRequired.toLocaleString()}</td>
                <td>{card.benefits?.length || 0}项</td>
                <td>{card.createdAt}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" style={{ marginRight: '8px' }} onClick={() => handleEdit(card)}>
                    编辑
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(card.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editingCard ? '编辑卡种' : '新增卡种'}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>卡种名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：金卡"
                />
              </div>
              <div className="form-group">
                <label>等级</label>
                <input
                  type="number"
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>卡面颜色</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  style={{ height: '42px', padding: '4px', cursor: 'pointer' }}
                />
              </div>
              <div className="form-group">
                <label>升级所需积分</label>
                <input
                  type="number"
                  value={formData.pointsRequired}
                  onChange={e => setFormData({ ...formData, pointsRequired: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>包含权益（用顿号或逗号分隔）</label>
              <textarea
                rows="3"
                value={formData.benefits}
                onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="如：生日双倍积分、专属客服、免费停车2小时"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingCard ? '保存修改' : '确认添加'}
              </button>
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

export default CardTypes
