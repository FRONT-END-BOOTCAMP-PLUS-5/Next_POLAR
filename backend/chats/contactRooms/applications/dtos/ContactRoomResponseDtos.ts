// ===== 조회 응답 DTOs =====

// 연락방 기본 정보 응답 DTO (닉네임 기반)
export interface ContactRoomResponseDto {
  contactRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
}

// 연락방 목록 응답 DTO
export interface ContactRoomListResponseDto {
  rooms: ContactRoomResponseDto[];
  totalCount: number;
}

// 참여자 정보 DTO
export interface ParticipantDto {
  nickname: string;
  name: string;
  profileImgUrl: string;
}

// 도움말 정보 DTO
export interface HelpInfoDto {
  title: string;
  description: string;
  status: string;
}

// 연락방 상세 정보 응답 DTO (참여자 정보 포함)
export interface ContactRoomDetailWithParticipantsResponseDto {
  contactRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  participants: {
    junior: ParticipantDto;
    senior: ParticipantDto;
  };
  helpInfo: HelpInfoDto;
}

export interface ConnectedHelpDto {
  id: number;
  title: string;
  representativeImage: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  category: { id: number; point: number }[];
}

// 통일된 연락방 상세 정보 응답 DTO
export interface ContactRoomDetailResponseDto {
  contactRoomId: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  opponentProfile: {
    nickname: string;
    name: string;
    profileImgUrl: string;
    address: string;
  };
  reviewStats?: {
    averageRating: number;
    reviewCount: number;
  };
  helps: ConnectedHelpDto[];
}
