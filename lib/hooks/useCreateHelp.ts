'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/api';
import { postHelp } from '../api_front/help.api';
import { ApiCreateHelpResponse } from '../models/createHelpDto';

export function useCreateHelp() {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync, isPending } = useMutation<
    ApiCreateHelpResponse,
    Error,
    FormData
  >({
    mutationFn: (formData: FormData) => postHelp(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENIOR_HELPS] });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return { data, mutate, mutateAsync, isPending };
}
