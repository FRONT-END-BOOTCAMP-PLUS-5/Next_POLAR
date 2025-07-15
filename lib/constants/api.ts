// API 엔드포인트 상수들
export const API_ENDPOINTS = {
  // 사용자 관련
  USERS: '/api/users',
  USER_PROFILE: (nickname: string) => `/api/users/${nickname}`,
  USER_SEARCH: '/api/users/search',

  // 인증 관련
  LOGIN: '/api/user/login',
  LOGOUT: '/api/user/logout',
  SIGNUP: '/api/user/signup',
  REFRESH: '/api/user/refresh',
  WITHDRAWAL: '/api/user/withdrawal',

  // 도움 요청 관련
  HELPS: '/api/helps',
  HELP_DETAIL: (id: string) => `/api/helps/${id}`,
  HELP_STATUS: (id: string) => `/api/helps/${id}/status`,
  JUNIOR_HELPS: '/api/helps/junior',
  SENIOR_HELPS: '/api/seniors/help',
  SENIOR_HELP_DETAIL: (id: string) => `/api/seniors/help/${id}`,

  // 리뷰 관련
  REVIEWS: '/api/reviews',
  REVIEW_CREATE: '/api/reviews/create',
  REVIEW_DETAIL: (id: string) => `/api/reviews/${id}`,
  REVIEWS_RECEIVED: '/api/reviews/received',
  REVIEWS_WRITTEN: '/api/reviews/written',

  // 채팅 관련
  CHAT_ROOMS: '/api/chats/rooms',
  CHAT_ROOM_MESSAGES: (roomId: string) => `/api/chats/rooms/${roomId}/messages`,

  // 이미지 업로드 관련
  IMAGE_UPLOAD: '/api/images',
  PROFILE_IMAGE: '/api/images/profile',
  HELP_IMAGE: '/api/images/help',
  REVIEW_IMAGE: '/api/images/review',

  // 점수 관련
  SCORES: '/api/scores',
  USER_SCORES: '/api/scores/user',
  CATEGORY_SCORES: '/api/scores/category',
  SEASON_SCORES: '/api/scores/season',
  USER_CATEGORY_SCORES: '/api/scores/user-with-category',
  USER_SEASON_SCORES: '/api/scores/user-with-season',
  CATEGORY_SEASON_SCORES: '/api/scores/category-with-season',
} as const;

// 쿼리 키 상수들
export const QUERY_KEYS = {
  // 사용자 관련
  USERS: ['users'] as const,
  USER_PROFILE: (nickname: string) => ['users', 'profile', nickname] as const,
  USER_SEARCH: (query: string) => ['users', 'search', query] as const,

  // 도움 요청 관련
  HELPS: ['helps'] as const,
  HELP_DETAIL: (id: string) => ['helps', 'detail', id] as const,
  JUNIOR_HELPS: ['helps', 'junior'] as const,
  SENIOR_HELPS: ['helps', 'senior'] as const,
  SENIOR_HELP_DETAIL: (id: string) =>
    ['helps', 'senior', 'detail', id] as const,

  // 리뷰 관련
  REVIEWS: ['reviews'] as const,
  REVIEW_DETAIL: (id: string) => ['reviews', 'detail', id] as const,
  REVIEWS_RECEIVED: ['reviews', 'received'] as const,
  REVIEWS_WRITTEN: ['reviews', 'written'] as const,

  // 채팅 관련
  CHAT_ROOMS: ['chats', 'rooms'] as const,
  CHAT_MESSAGES: (roomId: string) =>
    ['chats', 'rooms', roomId, 'messages'] as const,

  // 점수 관련
  SCORES: ['scores'] as const,
  USER_SCORES: ['scores', 'user'] as const,
  CATEGORY_SCORES: ['scores', 'category'] as const,
  SEASON_SCORES: ['scores', 'season'] as const,
} as const;
