import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ApiCreateHelpResponse } from '../models/createHelpDto';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { HelpPaginationResponseDto } from '@/backend/helps/applications/dtos/HelpPaginationDto';
import axios from 'axios';

export interface HelpFilterParams {
  categoryIds?: number[]; // 메인 카테고리 ID 배열 (categories 테이블)
  subCategoryIds?: number[]; // 서브 카테고리 ID 배열 (sub_categories 테이블)
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export const postHelp = async (formData: FormData) => {
  const response = await apiClient.post<ApiCreateHelpResponse>(
    API_ENDPOINTS.SENIOR_HELPS_CREATE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getHelpParticipants = async (helpId: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.HELP_PARTICIPANTS(helpId));
    return response.data;
  } catch (error) {
    console.error('Help 참여자 정보 조회 오류:', error);
    throw error;
  }
};

export const getHelpById = async (helpId: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.HELP_DETAIL(helpId));
    return response.data;
  } catch (error) {
    console.error('Help 상세 조회 오류:', error);
    throw error;
  }
};

export const getHelpList = async (
  filter?: HelpFilterParams
): Promise<HelpListResponseDto[]> => {
  try {
    const params = new URLSearchParams();

    if (filter?.categoryIds && filter.categoryIds.length > 0) {
      params.append('categoryIds', filter.categoryIds.join(','));
    }
    if (filter?.subCategoryIds && filter.subCategoryIds.length > 0) {
      params.append('subCategoryIds', filter.subCategoryIds.join(','));
    }
    if (filter?.startDate) {
      params.append('startDate', filter.startDate);
    }
    if (filter?.endDate) {
      params.append('endDate', filter.endDate);
    }
    if (filter?.status) {
      params.append('status', filter.status);
    }
    if (filter?.limit) {
      params.append('limit', filter.limit.toString());
    }
    if (filter?.offset) {
      params.append('offset', filter.offset.toString());
    }

    const url = `${API_ENDPOINTS.HELPS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    const response = await apiClient.get<HelpListResponseDto[]>(url);

    return response.data;
  } catch (error) {
    console.error('Help 리스트 조회 오류:', error);
    throw error;
  }
};

export const getHelpListWithPagination = async (
  filter?: HelpFilterParams
): Promise<HelpPaginationResponseDto> => {
  try {
    const params = new URLSearchParams();
    params.append('pagination', 'true');

    if (filter?.categoryIds && filter.categoryIds.length > 0) {
      params.append('categoryIds', filter.categoryIds.join(','));
    }
    if (filter?.subCategoryIds && filter.subCategoryIds.length > 0) {
      params.append('subCategoryIds', filter.subCategoryIds.join(','));
    }
    if (filter?.startDate) {
      params.append('startDate', filter.startDate);
    }
    if (filter?.endDate) {
      params.append('endDate', filter.endDate);
    }
    if (filter?.status) {
      params.append('status', filter.status);
    }
    if (filter?.page) {
      params.append('page', filter.page.toString());
    }
    if (filter?.limit) {
      params.append('limit', filter.limit.toString());
    }
    if (filter?.offset) {
      params.append('offset', filter.offset.toString());
    }

    const url = `${API_ENDPOINTS.HELPS}?${params.toString()}`;
    const response = await apiClient.get<HelpPaginationResponseDto>(url);
    return response.data;
  } catch (error) {
    console.error('Help 리스트 페이지네이션 조회 오류:', error);
    throw error;
  }
};

export const getHelpApplicants = async (helpId: number) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.HELP_APPLICANTS(helpId));
    return response.data;
  } catch (error) {
    console.error('Help 지원자 리스트 조회 오류:', error);
    throw error;
  }
};

export const applyHelp = async (helpId: number) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.HELP_APPLY(helpId));
    return response.data;
  } catch (error) {
    console.error('Help 지원 오류:', error);
    throw error;
  }
};

export const acceptHelpApplicant = async (
  helpId: number,
  juniorNickname: string
) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.HELP_ACCEPT_APPLICANT(helpId, juniorNickname)
    );
    return response.data;
  } catch (error) {
    console.error('Help 지원자 수락 오류:', error);
    throw error;
  }
};

export const checkHelpApplicationStatus = async (helpId: number) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.HELP_APPLICATION_STATUS(helpId)
    );
    return response.data;
  } catch (error) {
    console.error('Help 지원 상태 확인 오류:', error);
    throw error;
  }
};

export const getSeniorHelps = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SENIOR_HELPS_LIST);
    return response.data;
  } catch (error) {
    console.error('시니어 헬프 리스트 조회 오류:', error);
    throw error;
  }
};

export const requestSeniorHelpCompletion = async (helpId: number) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.SENIOR_HELP_COMPLETION(helpId)
    );
    return response.data;
  } catch (error) {
    console.error('시니어 헬프 완료 요청 오류:', error);
    throw error;
  }
};

export const verifyJuniorHelpCompletion = async (
  helpId: number,
  verificationCode: string
) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.JUNIOR_HELP_COMPLETION(helpId),
      { verificationCode }
    );
    return response.data;
  } catch (error) {
    console.error('주니어 헬프 완료 인증 오류:', error);
    throw error;
  }
};
