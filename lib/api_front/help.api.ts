import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ApiCreateHelpResponse } from '../models/createHelpDto';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { HelpPaginationResponseDto } from '@/backend/helps/applications/dtos/HelpPaginationDto';
import axios from 'axios';

export interface HelpFilterParams {
  id?: number; // 특정 헬프 ID
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
    API_ENDPOINTS.SENIOR_HELPS,
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
    const response = await axios.get(`/api/helps/${helpId}/participants`);
    return response.data;
  } catch (error) {
    console.error('Help 참여자 정보 조회 오류:', error);
    throw error;
  }
};

export const getHelpList = async (
  filter?: HelpFilterParams
): Promise<HelpListResponseDto[]> => {
  try {
    const params = new URLSearchParams();

    if (filter?.id) {
      params.append('id', filter.id.toString());
    }
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

    if (filter?.id) {
      params.append('id', filter.id.toString());
    }
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
