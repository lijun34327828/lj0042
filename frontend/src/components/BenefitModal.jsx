function BenefitModal({ memberBenefit, onClose }) {
  const { benefit, status, expireDate, usedDate } = memberBenefit

  const getStatusText = () => {
    switch (status) {
      case 'available': return '待使用'
      case 'used': return '已使用'
      case 'expired': return '已过期'
      default: return ''
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case 'available': return 'badge-success'
      case 'used': return 'badge-warning'
      case 'expired': return 'badge-danger'
      default: return ''
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          权益详情
          <span className={`badge ${getStatusClass()}`} style={{ marginLeft: '12px' }}>
            {getStatusText()}
          </span>
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {benefit?.type === 'points' && '⭐'}
            {benefit?.type === 'service' && '🎧'}
            {benefit?.type === 'parking' && '🅿️'}
            {benefit?.type === 'discount' && '🏷️'}
            {benefit?.type === 'event' && '🎉'}
            {benefit?.type === 'gift' && '🎁'}
            {!benefit?.type && '🎫'}
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '8px', color: '#2c3e50' }}>{benefit?.name}</h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>{benefit?.description}</p>
        </div>

        <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#7f8c8d', fontSize: '14px' }}>权益类型</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {benefit?.type === 'points' && '积分权益'}
              {benefit?.type === 'service' && '服务权益'}
              {benefit?.type === 'parking' && '停车权益'}
              {benefit?.type === 'discount' && '折扣权益'}
              {benefit?.type === 'event' && '活动权益'}
              {benefit?.type === 'gift' && '礼品权益'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#7f8c8d', fontSize: '14px' }}>有效期至</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{expireDate}</span>
          </div>
          {benefit?.value && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#7f8c8d', fontSize: '14px' }}>权益值</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#e74c3c' }}>
                {benefit.type === 'discount' ? `${(1 - benefit.value) * 100}% OFF` : benefit.value}
              </span>
            </div>
          )}
          {usedDate && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7f8c8d', fontSize: '14px' }}>使用日期</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{usedDate}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  )
}

export default BenefitModal
