import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ApiCreateHelpResponse } from '../models/createHelpDto';

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
