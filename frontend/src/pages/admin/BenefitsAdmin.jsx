import { useState, useEffect } from 'react'

function BenefitsAdmin() {
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'service',
    value: '',
    validDays: 30
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchBenefits()
  }, [])

  const fetchBenefits = async () => {
    try {
      const res = await fetch('/api/benefits')
      if (res.ok) {
        const data = await res.json()
        setBenefits(data)
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
    setEditingBenefit(null)
    setFormData({
      name: '',
      description: '',
      type: 'service',
      value: '',
      validDays: 30
    })
    setShowModal(true)
  }

  const handleEdit = (benefit) => {
    setEditingBenefit(benefit)
    setFormData({
      name: benefit.name,
      description: benefit.description,
      type: benefit.type,
      value: benefit.value || '',
      validDays: benefit.validDays || 30
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除该权益？')) return
    try {
      const res = await fetch(`/api/benefits/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('删除成功', 'success')
        fetchBenefits()
      }
    } catch (e) {
      showToast('删除失败', 'error')
    }
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      showToast('请输入权益名称', 'error')
      return
    }

    const payload = {
      ...formData,
      value: formData.value ? (formData.type === 'discount' ? parseFloat(formData.value) : parseInt(formData.value)) : null,
      validDays: parseInt(formData.validDays) || 30
    }

    try {
      let res
      if (editingBenefit) {
        res = await fetch(`/api/benefits/${editingBenefit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/benefits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        showToast(editingBenefit ? '修改成功' : '添加成功', 'success')
        setShowModal(false)
        fetchBenefits()
      }
    } catch (e) {
      showToast('操作失败', 'error')
    }
  }

  const getTypeLabel = (type) => {
    const types = {
      points: '积分权益',
      service: '服务权益',
      parking: '停车权益',
      discount: '折扣权益',
      event: '活动权益',
      gift: '礼品权益'
    }
    return types[type] || type
  }

  const getTypeIcon = (type) => {
    const icons = {
      points: '⭐',
      service: '🎧',
      parking: '🅿️',
      discount: '🏷️',
      event: '🎉',
      gift: '🎁'
    }
    return icons[type] || '🎫'
  }

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#2c3e50' }}>权益管理</h3>
          <button className="btn btn-primary" onClick={handleAdd}>+ 新增权益</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>图标</th>
              <th>权益名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>权益值</th>
              <th>有效期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {benefits.map(benefit => (
              <tr key={benefit.id}>
                <td><span style={{ fontSize: '24px' }}>{getTypeIcon(benefit.type)}</span></td>
                <td style={{ fontWeight: '500' }}>{benefit.name}</td>
                <td><span className="badge badge-info">{getTypeLabel(benefit.type)}</span></td>
                <td style={{ color: '#7f8c8d', fontSize: '14px', maxWidth: '250px' }}>{benefit.description}</td>
                <td>
                  {benefit.value !== null ? (
                    benefit.type === 'discount'
                      ? `${(1 - benefit.value) * 100}% OFF`
                      : benefit.value
                  ) : '—'}
                </td>
                <td>{benefit.validDays}天</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginRight: '8px' }}
                    onClick={() => handleEdit(benefit)}
                  >
                    编辑
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(benefit.id)}>
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
              {editingBenefit ? '编辑权益' : '新增权益'}
            </div>

            <div className="form-group">
              <label>权益名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="如：生日双倍积分"
              />
            </div>

            <div className="form-group">
              <label>权益描述</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入权益描述"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>权益类型</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="points">积分权益</option>
                  <option value="service">服务权益</option>
                  <option value="parking">停车权益</option>
                  <option value="discount">折扣权益</option>
                  <option value="event">活动权益</option>
                  <option value="gift">礼品权益</option>
                </select>
              </div>
              <div className="form-group">
                <label>权益值</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === 'discount' ? '如：0.9 表示9折' : '如：2 表示2倍/2小时'}
                />
              </div>
            </div>

            <div className="form-group">
              <label>有效期（天）</label>
              <input
                type="number"
                value={formData.validDays}
                onChange={e => setFormData({ ...formData, validDays: e.target.value })}
                placeholder="30"
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingBenefit ? '保存修改' : '确认添加'}
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

export default BenefitsAdmin
