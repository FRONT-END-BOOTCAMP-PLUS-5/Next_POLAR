import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/api';
import { postHelp, postHelpImages } from '../api_front/help.api';
import {
  ApiCreateHelpImagesResponse,
  ApiCreateHelpResponse,
  ApiCreateHelp,
  ApiCreateHelpImagesRequest,
} from '../models/createHelpDto';

export function useCreateHelp() {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync, isPending } = useMutation<
    ApiCreateHelpResponse,
    Error,
    ApiCreateHelp
  >({
    mutationFn: (formData: ApiCreateHelp) => postHelp(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENIOR_HELPS] });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return { data, mutate, mutateAsync, isPending };
}

export function useCreateHelpImages() {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync } = useMutation<
    ApiCreateHelpImagesResponse,
    Error,
    ApiCreateHelpImagesRequest
  >({
    mutationFn: (formData: ApiCreateHelpImagesRequest) =>
      postHelpImages(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENIOR_HELPS] });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return { data, mutate, mutateAsync };
}
