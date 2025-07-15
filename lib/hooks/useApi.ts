import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import apiClient, { ApiResponse, ApiError } from '../http.api';

// GET 요청을 위한 커스텀 훅
export function useApiQuery<TData = unknown>(
  queryKey: string[],
  url: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ApiResponse<TData>, ApiError>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TData>>(url);
      return response.data;
    },
    ...options,
  });
}

// POST 요청을 위한 커스텀 훅
export function useApiMutation<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, ApiError, TVariables>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.post<ApiResponse<TData>>(url, variables);
      return response.data;
    },
    onSuccess: () => {
      // 성공 시 관련 쿼리들을 무효화
      queryClient.invalidateQueries();
    },
    ...options,
  });
}

// PUT 요청을 위한 커스텀 훅
export function useApiPut<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, ApiError, TVariables>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.put<ApiResponse<TData>>(url, variables);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    ...options,
  });
}

// DELETE 요청을 위한 커스텀 훅
export function useApiDelete<TData = unknown>(
  url: string,
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, ApiError, void>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, ApiError, void>({
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<TData>>(url);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    ...options,
  });
}
