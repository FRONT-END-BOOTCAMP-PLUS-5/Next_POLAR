import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import {
  ApiCreateHelpImagesRequest,
  ApiCreateHelpImagesResponse,
  ApiCreateHelpResponse,
  ApiCreateHelp,
} from '../models/createHelpDto';

export const postHelp = async (helpData: ApiCreateHelp) => {
  const response = await apiClient.post<ApiCreateHelpResponse>(
    API_ENDPOINTS.SENIOR_HELPS,
    helpData
  );
  return response.data;
};

export const postHelpImages = async (helpData: ApiCreateHelpImagesRequest) => {
  const formData = helpData.formData;

  const response = await apiClient.post<ApiCreateHelpImagesResponse>(
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
