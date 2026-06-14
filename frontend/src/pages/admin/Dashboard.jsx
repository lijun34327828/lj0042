import { useState, useEffect } from 'react'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (loading) return <div>加载中...</div>

  const maxRedemption = Math.max(...stats.weeklyRedemptions.map(r => r.count))
  const totalCards = stats.cardDistribution.reduce((sum, c) => sum + c.count, 0)

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">累计发卡量</div>
          <div className="stat-value">{stats.totalCards.toLocaleString()}</div>
          <div className="stat-trend up">今日新增 +{stats.todayNewCards}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">累计核销次数</div>
          <div className="stat-value">{stats.totalRedemptions.toLocaleString()}</div>
          <div className="stat-trend up">今日核销 +{stats.todayRedemptions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">今日新增会员</div>
          <div className="stat-value" style={{ color: '#27ae60' }}>{stats.todayNewCards}</div>
          <div className="stat-trend up">较昨日 +12%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">核销转化率</div>
          <div className="stat-value" style={{ color: '#e67e22' }}>
            {((stats.totalRedemptions / stats.totalCards) * 100).toFixed(1)}%
          </div>
          <div className="stat-trend up">持续提升中</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="chart-container">
          <div className="chart-title">本周核销趋势</div>
          <div className="bar-chart">
            {stats.weeklyRedemptions.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-value">{item.count}</div>
                <div
                  className="bar"
                  style={{ height: `${(item.count / maxRedemption) * 100}%` }}
                />
                <div className="bar-label">{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">卡种分布</div>
          <div className="pie-chart-container">
            <div
              className="pie-chart"
              style={{
                background: `conic-gradient(
                  ${stats.cardDistribution[0]?.color} 0deg ${(stats.cardDistribution[0]?.count / totalCards) * 360}deg,
                  ${stats.cardDistribution[1]?.color} ${(stats.cardDistribution[0]?.count / totalCards) * 360}deg ${((stats.cardDistribution[0]?.count + stats.cardDistribution[1]?.count) / totalCards) * 360}deg,
                  ${stats.cardDistribution[2]?.color} ${((stats.cardDistribution[0]?.count + stats.cardDistribution[1]?.count) / totalCards) * 360}deg ${((stats.cardDistribution[0]?.count + stats.cardDistribution[1]?.count + stats.cardDistribution[2]?.count) / totalCards) * 360}deg,
                  ${stats.cardDistribution[3]?.color} ${((stats.cardDistribution[0]?.count + stats.cardDistribution[1]?.count + stats.cardDistribution[2]?.count) / totalCards) * 360}deg 360deg
                )`
              }}
            />
            <div className="pie-legend">
              {stats.cardDistribution.map((card, index) => (
                <div key={index} className="pie-legend-item">
                  <div className="pie-legend-color" style={{ background: card.color }} />
                  <span className="pie-legend-label">{card.name}</span>
                  <span className="pie-legend-value">
                    {card.count.toLocaleString()} ({((card.count / totalCards) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-title" style={{ marginBottom: '16px' }}>核心指标概览</div>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>今日</th>
              <th>本周</th>
              <th>本月</th>
              <th>累计</th>
              <th>趋势</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>新增发卡</td>
              <td>{stats.todayNewCards}</td>
              <td>{Math.round(stats.todayNewCards * 5.8)}</td>
              <td>{Math.round(stats.todayNewCards * 24)}</td>
              <td>{stats.totalCards.toLocaleString()}</td>
              <td><span className="badge badge-success">↑ 12.5%</span></td>
            </tr>
            <tr>
              <td>权益核销</td>
              <td>{stats.todayRedemptions}</td>
              <td>{Math.round(stats.todayRedemptions * 6.2)}</td>
              <td>{Math.round(stats.todayRedemptions * 26)}</td>
              <td>{stats.totalRedemptions.toLocaleString()}</td>
              <td><span className="badge badge-success">↑ 8.3%</span></td>
            </tr>
            <tr>
              <td>活跃会员</td>
              <td>{Math.round(stats.todayNewCards * 3.5)}</td>
              <td>{Math.round(stats.todayNewCards * 20)}</td>
              <td>{Math.round(stats.todayNewCards * 80)}</td>
              <td>—</td>
              <td><span className="badge badge-success">↑ 5.1%</span></td>
            </tr>
            <tr>
              <td>积分发放</td>
              <td>{(stats.todayNewCards * 150).toLocaleString()}</td>
              <td>{(stats.todayNewCards * 900).toLocaleString()}</td>
              <td>{(stats.todayNewCards * 3800).toLocaleString()}</td>
              <td>—</td>
              <td><span className="badge badge-warning">↑ 2.8%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
