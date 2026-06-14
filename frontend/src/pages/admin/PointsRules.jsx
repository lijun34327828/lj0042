import { useState, useEffect } from 'react'

function PointsRules() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rule: '',
    multiplier: 1
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/points-rules')
      if (res.ok) {
        const data = await res.json()
        setRules(data)
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
    setEditingRule(null)
    setFormData({
      name: '',
      description: '',
      rule: '',
      multiplier: 1
    })
    setShowModal(true)
  }

  const handleEdit = (rule) => {
    setEditingRule(rule)
    setFormData({
      name: rule.name,
      description: rule.description,
      rule: rule.rule,
      multiplier: rule.multiplier
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除该规则？')) return
    try {
      const res = await fetch(`/api/points-rules/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('删除成功', 'success')
        fetchRules()
      }
    } catch (e) {
      showToast('删除失败', 'error')
    }
  }

  const toggleStatus = async (rule) => {
    const newStatus = rule.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`/api/points-rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rule, status: newStatus })
      })
      if (res.ok) {
        showToast(`已${newStatus === 'active' ? '启用' : '禁用'}`, 'success')
        fetchRules()
      }
    } catch (e) {
      showToast('操作失败', 'error')
    }
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      showToast('请输入规则名称', 'error')
      return
    }

    const payload = {
      ...formData,
      multiplier: Number(formData.multiplier)
    }

    try {
      let res
      if (editingRule) {
        res = await fetch(`/api/points-rules/${editingRule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/points-rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        showToast(editingRule ? '修改成功' : '添加成功', 'success')
        setShowModal(false)
        fetchRules()
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
          <h3 style={{ color: '#2c3e50' }}>积分规则管理</h3>
          <button className="btn btn-primary" onClick={handleAdd}>+ 新增规则</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>规则名称</th>
              <th>描述</th>
              <th>规则说明</th>
              <th>积分倍率</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.id}>
                <td style={{ fontWeight: '500' }}>{rule.name}</td>
                <td style={{ color: '#7f8c8d', fontSize: '14px' }}>{rule.description}</td>
                <td><span className="badge badge-info">{rule.rule}</span></td>
                <td>×{rule.multiplier}</td>
                <td>
                  <span className={`badge ${rule.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {rule.status === 'active' ? '启用' : '禁用'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginRight: '8px' }}
                    onClick={() => toggleStatus(rule)}
                  >
                    {rule.status === 'active' ? '禁用' : '启用'}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginRight: '8px' }}
                    onClick={() => handleEdit(rule)}
                  >
                    编辑
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rule.id)}>
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
              {editingRule ? '编辑积分规则' : '新增积分规则'}
            </div>

            <div className="form-group">
              <label>规则名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="如：消费积分"
              />
            </div>

            <div className="form-group">
              <label>规则描述</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="如：每消费1元获得1积分"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>规则说明</label>
                <input
                  type="text"
                  value={formData.rule}
                  onChange={e => setFormData({ ...formData, rule: e.target.value })}
                  placeholder="如：1元=1积分"
                />
              </div>
              <div className="form-group">
                <label>积分倍率</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.multiplier}
                  onChange={e => setFormData({ ...formData, multiplier: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingRule ? '保存修改' : '确认添加'}
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

export default PointsRules
