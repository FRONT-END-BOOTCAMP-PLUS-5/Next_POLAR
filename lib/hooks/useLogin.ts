import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';

interface LoginCredentials {
  loginId: string;
  password: string;
}

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      login({
        nickname: data.nickname,
        role: data.role,
      });
    },
  });
};
