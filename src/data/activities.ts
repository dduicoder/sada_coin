export interface Activity {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'club_to_student' | 'student_to_club';
  category: 'event' | 'purchase' | 'membership' | 'donation' | 'penalty' | 'reward';
  isActive: boolean;
}

export const PREDEFINED_ACTIVITIES: Activity[] = [
  // Club to Student Activities (Rewards/Payments)
  {
    id: 'act_001',
    title: '행사 참여 보상',
    description: '학교 행사나 동아리 활동에 적극적으로 참여한 학생에게 지급하는 보상금',
    amount: 500,
    type: 'club_to_student',
    category: 'reward',
    isActive: true
  },
  {
    id: 'act_002',
    title: '우수 활동 장려금',
    description: '동아리 내에서 모범적인 활동을 보인 학생에게 지급하는 장려금',
    amount: 1000,
    type: 'club_to_student',
    category: 'reward',
    isActive: true
  },
  {
    id: 'act_003',
    title: '대회 참가 지원금',
    description: '각종 대회나 경진대회 참가를 위한 지원금',
    amount: 2000,
    type: 'club_to_student',
    category: 'event',
    isActive: true
  },
  {
    id: 'act_004',
    title: '학습 자료 구입 지원',
    description: '교재나 학습 자료 구입을 위한 지원금',
    amount: 1500,
    type: 'club_to_student',
    category: 'purchase',
    isActive: true
  },
  {
    id: 'act_005',
    title: '프로젝트 완성 보상',
    description: '동아리 프로젝트를 성공적으로 완료한 팀에게 지급하는 보상금',
    amount: 3000,
    type: 'club_to_student',
    category: 'reward',
    isActive: true
  },

  // Student to Club Activities (Payments/Fees)
  {
    id: 'act_006',
    title: '동아리 회비',
    description: '월별 동아리 운영을 위한 기본 회비',
    amount: 5000,
    type: 'student_to_club',
    category: 'membership',
    isActive: true
  },
  {
    id: 'act_007',
    title: '행사 참가비',
    description: '동아리 주최 행사나 워크샵 참가를 위한 참가비',
    amount: 3000,
    type: 'student_to_club',
    category: 'event',
    isActive: true
  },
  {
    id: 'act_008',
    title: '장비 사용료',
    description: '동아리 전용 장비나 시설 사용에 대한 사용료',
    amount: 1000,
    type: 'student_to_club',
    category: 'purchase',
    isActive: true
  },
  {
    id: 'act_009',
    title: '교재 구입비',
    description: '동아리 활동에 필요한 교재나 자료 구입비',
    amount: 2500,
    type: 'student_to_club',
    category: 'purchase',
    isActive: true
  },
  {
    id: 'act_010',
    title: '지각 벌금',
    description: '동아리 활동 시간에 지각한 경우 부과되는 벌금',
    amount: 500,
    type: 'student_to_club',
    category: 'penalty',
    isActive: true
  },
  {
    id: 'act_011',
    title: '결석 벌금',
    description: '사전 양해 없이 동아리 활동에 결석한 경우 부과되는 벌금',
    amount: 1000,
    type: 'student_to_club',
    category: 'penalty',
    isActive: true
  },
  {
    id: 'act_012',
    title: '자발적 기부',
    description: '동아리 발전을 위한 학생들의 자발적 기부금',
    amount: 2000,
    type: 'student_to_club',
    category: 'donation',
    isActive: true
  },
  {
    id: 'act_013',
    title: '특별 행사 후원',
    description: '동아리 특별 행사나 대회 개최를 위한 후원금',
    amount: 5000,
    type: 'student_to_club',
    category: 'donation',
    isActive: true
  },
  {
    id: 'act_014',
    title: '간식 구입비',
    description: '동아리 활동 시간 간식이나 다과 구입비',
    amount: 1500,
    type: 'student_to_club',
    category: 'purchase',
    isActive: true
  },
  {
    id: 'act_015',
    title: 'MT 참가비',
    description: '동아리 멤버십 트레이닝(MT) 참가를 위한 참가비',
    amount: 10000,
    type: 'student_to_club',
    category: 'event',
    isActive: true
  }
];

export const getActivitiesByType = (type: 'club_to_student' | 'student_to_club') => {
  return PREDEFINED_ACTIVITIES.filter(activity => activity.type === type && activity.isActive);
};

export const getActivitiesByCategory = (category: Activity['category']) => {
  return PREDEFINED_ACTIVITIES.filter(activity => activity.category === category && activity.isActive);
};

export const getActivityById = (id: string) => {
  return PREDEFINED_ACTIVITIES.find(activity => activity.id === id);
};