function BenefitItem({ memberBenefit, onClick }) {
  const { benefit, status, expireDate } = memberBenefit

  const getStatusBadge = () => {
    switch (status) {
      case 'available':
        return <span className="badge badge-success">待使用</span>
      case 'used':
        return <span className="badge badge-warning">已使用</span>
      case 'expired':
        return <span className="badge badge-danger">已过期</span>
      default:
        return null
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'points': return '⭐'
      case 'service': return '🎧'
      case 'parking': return '🅿️'
      case 'discount': return '🏷️'
      case 'event': return '🎉'
      case 'gift': return '🎁'
      default: return '🎫'
    }
  }

  return (
    <div
      className={`benefit-item ${status}`}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ fontSize: '28px' }}>{getTypeIcon(benefit?.type)}</div>
        {getStatusBadge()}
      </div>
      <div className="benefit-name">{benefit?.name}</div>
      <div className="benefit-desc">{benefit?.description}</div>
      <div className="benefit-meta">
        <span>有效期至: {expireDate}</span>
      </div>
    </div>
  )
}

export default BenefitItem
