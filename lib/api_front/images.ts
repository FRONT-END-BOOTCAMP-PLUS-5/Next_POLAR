import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ApiGetImageUrlResponse } from '../models/getImageUrl';

export const uploadImage = async (
  formData: FormData
): Promise<ApiGetImageUrlResponse> => {
  const response = await apiClient.post<ApiGetImageUrlResponse>(
    API_ENDPOINTS.HELP_IMAGE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
