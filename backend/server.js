const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8762;

app.use(cors());
app.use(express.json());

const data = {
  cardTypes: [
    {
      id: 1,
      name: '普通卡',
      color: '#95a5a6',
      level: 1,
      pointsRequired: 0,
      benefits: ['生日双倍积分', '专属客服'],
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: '银卡',
      color: '#7f8c8d',
      level: 2,
      pointsRequired: 1000,
      benefits: ['生日双倍积分', '专属客服', '免费停车2小时', '积分兑换95折'],
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: '金卡',
      color: '#f1c40f',
      level: 3,
      pointsRequired: 5000,
      benefits: ['生日三倍积分', '专属客户经理', '免费停车4小时', '积分兑换9折', '优先预约'],
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      name: '钻石卡',
      color: '#3498db',
      level: 4,
      pointsRequired: 20000,
      benefits: ['生日五倍积分', '一对一专属管家', '全天免费停车', '积分兑换85折', 'VIP专属活动', '年度礼盒'],
      createdAt: '2024-01-01'
    }
  ],
  members: [
    {
      id: 1,
      name: '张三',
      phone: '13800138001',
      cardTypeId: 3,
      points: 8650,
      totalPoints: 12650,
      joinDate: '2023-06-15',
      avatar: null
    },
    {
      id: 2,
      name: '李四',
      phone: '13800138002',
      cardTypeId: 2,
      points: 2340,
      totalPoints: 4340,
      joinDate: '2023-09-20',
      avatar: null
    },
    {
      id: 3,
      name: '王五',
      phone: '13800138003',
      cardTypeId: 4,
      points: 25800,
      totalPoints: 45800,
      joinDate: '2022-03-10',
      avatar: null
    }
  ],
  benefits: [
    { id: 1, name: '生日双倍积分', description: '生日当月消费积分翻倍', type: 'points', value: 2, validDays: 30 },
    { id: 2, name: '专属客服', description: '7x24小时专属客服热线', type: 'service', value: null, validDays: 365 },
    { id: 3, name: '免费停车2小时', description: '每日可享受2小时免费停车', type: 'parking', value: 2, validDays: 1 },
    { id: 4, name: '免费停车4小时', description: '每日可享受4小时免费停车', type: 'parking', value: 4, validDays: 1 },
    { id: 5, name: '积分兑换95折', description: '积分兑换商品享95折优惠', type: 'discount', value: 0.95, validDays: 365 },
    { id: 6, name: '积分兑换9折', description: '积分兑换商品享9折优惠', type: 'discount', value: 0.9, validDays: 365 },
    { id: 7, name: '积分兑换85折', description: '积分兑换商品享85折优惠', type: 'discount', value: 0.85, validDays: 365 },
    { id: 8, name: '优先预约', description: '热门服务优先预约', type: 'service', value: null, validDays: 365 },
    { id: 9, name: 'VIP专属活动', description: '受邀参加VIP专属活动', type: 'event', value: null, validDays: 365 },
    { id: 10, name: '年度礼盒', description: '每年赠送精美会员礼盒', type: 'gift', value: null, validDays: 365 },
    { id: 11, name: '专属客户经理', description: '配备专属客户经理服务', type: 'service', value: null, validDays: 365 },
    { id: 12, name: '一对一专属管家', description: '一对一专属管家式服务', type: 'service', value: null, validDays: 365 },
    { id: 13, name: '生日三倍积分', description: '生日当月消费积分三倍', type: 'points', value: 3, validDays: 30 },
    { id: 14, name: '生日五倍积分', description: '生日当月消费积分五倍', type: 'points', value: 5, validDays: 30 },
    { id: 15, name: '全天免费停车', description: '每日全天免费停车', type: 'parking', value: 24, validDays: 1 }
  ],
  memberBenefits: [
    { id: 1, memberId: 1, benefitId: 13, status: 'available', expireDate: '2025-07-31', usedDate: null },
    { id: 2, memberId: 1, benefitId: 11, status: 'available', expireDate: '2025-12-31', usedDate: null },
    { id: 3, memberId: 1, benefitId: 4, status: 'available', expireDate: '2024-06-16', usedDate: null },
    { id: 4, memberId: 1, benefitId: 6, status: 'available', expireDate: '2025-12-31', usedDate: null },
    { id: 5, memberId: 1, benefitId: 8, status: 'used', expireDate: '2024-05-01', usedDate: '2024-05-10' },
    { id: 16, memberId: 1, benefitId: 2, status: 'available', expireDate: '2026-12-31', usedDate: null },
    { id: 6, memberId: 2, benefitId: 1, status: 'available', expireDate: '2024-10-31', usedDate: null },
    { id: 7, memberId: 2, benefitId: 2, status: 'available', expireDate: '2025-12-31', usedDate: null },
    { id: 8, memberId: 2, benefitId: 3, status: 'available', expireDate: '2024-06-16', usedDate: null },
    { id: 9, memberId: 2, benefitId: 5, status: 'expired', expireDate: '2024-03-31', usedDate: null },
    { id: 10, memberId: 3, benefitId: 14, status: 'available', expireDate: '2025-04-30', usedDate: null },
    { id: 11, memberId: 3, benefitId: 12, status: 'available', expireDate: '2025-12-31', usedDate: null },
    { id: 12, memberId: 3, benefitId: 15, status: 'available', expireDate: '2024-06-16', usedDate: null },
    { id: 13, memberId: 3, benefitId: 7, status: 'available', expireDate: '2025-12-31', usedDate: null },
    { id: 14, memberId: 3, benefitId: 9, status: 'available', expireDate: '2025-12-31', usedDate: null },
    { id: 15, memberId: 3, benefitId: 10, status: 'used', expireDate: '2024-01-31', usedDate: '2024-01-15' }
  ],
  redemptionRecords: [
    { id: 1, memberId: 1, benefitId: 8, operator: '前台小王', time: '2024-05-10 14:30:00', status: 'success' },
    { id: 2, memberId: 3, benefitId: 10, operator: '前台小李', time: '2024-01-15 10:15:00', status: 'success' }
  ],
  pointsRules: [
    { id: 1, name: '消费积分', description: '每消费1元获得1积分', rule: '1元=1积分', multiplier: 1, status: 'active' },
    { id: 2, name: '签到积分', description: '每日签到获得10积分', rule: '每日签到+10积分', multiplier: 10, status: 'active' },
    { id: 3, name: '推荐新用户', description: '成功推荐新用户获得200积分', rule: '推荐+200积分', multiplier: 200, status: 'active' }
  ],
  stats: {
    totalCards: 12580,
    todayNewCards: 36,
    totalRedemptions: 8942,
    todayRedemptions: 128,
    cardDistribution: [
      { name: '普通卡', count: 6520, color: '#95a5a6' },
      { name: '银卡', count: 3280, color: '#7f8c8d' },
      { name: '金卡', count: 2150, color: '#f1c40f' },
      { name: '钻石卡', count: 630, color: '#3498db' }
    ],
    weeklyRedemptions: [
      { day: '周一', count: 156 },
      { day: '周二', count: 132 },
      { day: '周三', count: 178 },
      { day: '周四', count: 145 },
      { day: '周五', count: 198 },
      { day: '周六', count: 245 },
      { day: '周日', count: 210 }
    ]
  }
};

let nextMemberId = 4;
let nextBenefitId = 16;
let nextMemberBenefitId = 16;
let nextRecordId = 3;
let nextCardTypeId = 5;
let nextPointsRuleId = 4;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/member/:phone', (req, res) => {
  const { phone } = req.params;
  const member = data.members.find(m => m.phone === phone);
  
  if (!member) {
    return res.status(404).json({ error: '会员不存在' });
  }
  
  const cardType = data.cardTypes.find(c => c.id === member.cardTypeId);
  const memberBenefits = data.memberBenefits
    .filter(mb => mb.memberId === member.id)
    .map(mb => {
      const benefit = data.benefits.find(b => b.id === mb.benefitId);
      const dynamicStatus = mb.status === 'available' && isExpired(mb.expireDate) ? 'expired' : mb.status;
      return { ...mb, status: dynamicStatus, benefit };
    });
  
  res.json({
    ...member,
    cardType,
    benefits: memberBenefits
  });
});

app.get('/api/member/:phone/benefits', (req, res) => {
  const { phone } = req.params;
  const { status } = req.query;
  const member = data.members.find(m => m.phone === phone);
  
  if (!member) {
    return res.status(404).json({ error: '会员不存在' });
  }
  
  let memberBenefits = data.memberBenefits
    .filter(mb => mb.memberId === member.id)
    .map(mb => {
      const benefit = data.benefits.find(b => b.id === mb.benefitId);
      const dynamicStatus = mb.status === 'available' && isExpired(mb.expireDate) ? 'expired' : mb.status;
      return { ...mb, status: dynamicStatus, benefit };
    });
  
  if (status) {
    memberBenefits = memberBenefits.filter(mb => mb.status === status);
  }
  
  res.json(memberBenefits);
});

app.get('/api/card-types', (req, res) => {
  res.json(data.cardTypes);
});

app.post('/api/card-types', (req, res) => {
  const newCardType = {
    id: nextCardTypeId++,
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0]
  };
  data.cardTypes.push(newCardType);
  res.json(newCardType);
});

app.put('/api/card-types/:id', (req, res) => {
  const { id } = req.params;
  const index = data.cardTypes.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: '卡种不存在' });
  }
  
  data.cardTypes[index] = { ...data.cardTypes[index], ...req.body };
  res.json(data.cardTypes[index]);
});

app.delete('/api/card-types/:id', (req, res) => {
  const { id } = req.params;
  const index = data.cardTypes.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: '卡种不存在' });
  }
  
  data.cardTypes.splice(index, 1);
  res.json({ success: true });
});

app.get('/api/points-rules', (req, res) => {
  res.json(data.pointsRules);
});

app.post('/api/points-rules', (req, res) => {
  const newRule = {
    id: nextPointsRuleId++,
    ...req.body,
    status: 'active'
  };
  data.pointsRules.push(newRule);
  res.json(newRule);
});

app.put('/api/points-rules/:id', (req, res) => {
  const { id } = req.params;
  const index = data.pointsRules.findIndex(r => r.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: '规则不存在' });
  }
  
  data.pointsRules[index] = { ...data.pointsRules[index], ...req.body };
  res.json(data.pointsRules[index]);
});

app.delete('/api/points-rules/:id', (req, res) => {
  const { id } = req.params;
  const index = data.pointsRules.findIndex(r => r.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: '规则不存在' });
  }
  
  data.pointsRules.splice(index, 1);
  res.json({ success: true });
});

app.get('/api/benefits', (req, res) => {
  res.json(data.benefits);
});

app.post('/api/benefits', (req, res) => {
  const newBenefit = {
    id: nextBenefitId++,
    ...req.body
  };
  data.benefits.push(newBenefit);
  res.json(newBenefit);
});

app.put('/api/benefits/:id', (req, res) => {
  const { id } = req.params;
  const index = data.benefits.findIndex(b => b.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: '权益不存在' });
  }
  
  data.benefits[index] = { ...data.benefits[index], ...req.body };
  res.json(data.benefits[index]);
});

app.delete('/api/benefits/:id', (req, res) => {
  const { id } = req.params;
  const index = data.benefits.findIndex(b => b.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: '权益不存在' });
  }
  
  data.benefits.splice(index, 1);
  res.json({ success: true });
});

function isExpired(expireDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expire = new Date(expireDate);
  expire.setHours(0, 0, 0, 0);
  return expire < today;
}

app.post('/api/redeem', (req, res) => {
  const { phone, benefitId, operator } = req.body;
  const member = data.members.find(m => m.phone === phone);
  
  if (!member) {
    return res.status(404).json({ error: '会员不存在' });
  }
  
  const memberBenefit = data.memberBenefits.find(
    mb => mb.memberId === member.id && mb.benefitId === benefitId && mb.status === 'available'
  );
  
  if (!memberBenefit) {
    return res.status(400).json({ error: '权益不可用或已使用' });
  }
  
  if (isExpired(memberBenefit.expireDate)) {
    return res.status(400).json({ error: '权益已过期' });
  }
  
  memberBenefit.status = 'used';
  memberBenefit.usedDate = new Date().toISOString().split('T')[0];
  
  const record = {
    id: nextRecordId++,
    memberId: member.id,
    benefitId,
    operator: operator || '系统',
    time: new Date().toLocaleString('zh-CN'),
    status: 'success'
  };
  data.redemptionRecords.push(record);
  
  data.stats.todayRedemptions++;
  data.stats.totalRedemptions++;

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const todayName = dayNames[new Date().getDay()];
  const todayBar = data.stats.weeklyRedemptions.find(d => d.day === todayName);
  if (todayBar) {
    todayBar.count++;
  }
  
  res.json({
    success: true,
    record,
    memberBenefit
  });
});

app.get('/api/stats', (req, res) => {
  res.json(data.stats);
});

app.get('/api/redemption-records', (req, res) => {
  const { memberId, limit } = req.query;
  let records = [...data.redemptionRecords];
  
  if (memberId) {
    records = records.filter(r => r.memberId === parseInt(memberId));
  }
  
  if (limit) {
    records = records.slice(-parseInt(limit));
  }
  
  records.sort((a, b) => new Date(b.time) - new Date(a.time));
  
  res.json(records);
});

app.get('/api/members', (req, res) => {
  const membersWithCardType = data.members.map(m => ({
    ...m,
    cardType: data.cardTypes.find(c => c.id === m.cardTypeId)
  }));
  res.json(membersWithCardType);
});

app.post('/api/members', (req, res) => {
  const newMember = {
    id: nextMemberId++,
    ...req.body,
    cardTypeId: req.body.cardTypeId || 1,
    points: 0,
    totalPoints: 0,
    joinDate: new Date().toISOString().split('T')[0],
    avatar: null
  };
  data.members.push(newMember);
  data.stats.totalCards++;
  data.stats.todayNewCards++;
  
  const cardType = data.cardTypes.find(c => c.id === newMember.cardTypeId);
  const distItem = data.stats.cardDistribution.find(d => d.name === cardType.name);
  if (distItem) {
    distItem.count++;
  }

  res.json({ ...newMember, cardType });
});

app.listen(PORT, () => {
  console.log(`会员积分管理系统后端服务运行在 http://localhost:${PORT}`);
});
