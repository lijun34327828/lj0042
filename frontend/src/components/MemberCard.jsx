function MemberCard({ member }) {
  const cardType = member.cardType
  const cardColor = cardType?.color || '#667eea'

  const formatCardNumber = (phone) => {
    if (!phone) return '**** **** **** ****'
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 **** $3')
  }

  const getCardIcon = (level) => {
    switch(level) {
      case 1: return '🥉'
      case 2: return '🥈'
      case 3: return '🥇'
      case 4: return '💎'
      default: return '💳'
    }
  }

  return (
    <div className="member-card-container">
      <div
        className="member-card"
        style={{ background: `linear-gradient(135deg, ${cardColor} 0%, ${adjustColor(cardColor, -30)} 100%)` }}
      >
        <div className="card-header">
          <div className="card-level">{cardType?.name || '会员卡'}</div>
          <div className="card-logo">{getCardIcon(cardType?.level)}</div>
        </div>
        <div className="card-number">{formatCardNumber(member.phone)}</div>
        <div className="card-footer">
          <div className="card-holder">
            <div>持卡人</div>
            <div className="card-holder-name">{member.name}</div>
          </div>
          <div className="card-points">
            <div className="points-label">可用积分</div>
            <div className="points-value">{member.points.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function adjustColor(color, amount) {
  const hex = color.replace('#', '')
  const num = parseInt(hex, 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

export default MemberCard
