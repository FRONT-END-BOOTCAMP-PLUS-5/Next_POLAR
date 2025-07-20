export const getCategoryName = (categoryId: number) => {
  const categories: { [key: number]: string } = {
    6: '짐 나르기',
    7: '청소',
    8: '수확(농경 보조)',
    9: '재난/재해 봉사',
    10: '김장',
    11: '스마트폰 질문',
    12: '대리 상담',
    13: '재능기부',
    14: '가벼운 배달',
    15: '장보기(편의점 등)',
    16: '콘서트 예매',
    17: '가벼운 대화(교감)',
    18: '간단한 상담',
    19: '티켓팅 줄 서기',
  };
  return categories[categoryId] || '기타';
};

export const getCategoryEmoji = (categoryId: number) => {
  const emojis: { [key: number]: string } = {
    6: '📦',
    7: '🧹',
    8: '🌾',
    9: '🚨',
    10: '🥬',
    11: '📱',
    12: '💼',
    13: '🎨',
    14: '📦',
    15: '🛒',
    16: '🎫',
    17: '💬',
    18: '💭',
    19: '🎫',
  };
  return emojis[categoryId] || '✨';
};
