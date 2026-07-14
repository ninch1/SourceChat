import { useMutation, useQuery } from '@tanstack/react-query';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from '../api/authApi';

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

export const useRefreshAccessToken = () => {
  return useMutation({
    mutationFn: refreshAccessToken,
    retry: false,
  });
};

export const useGetCurrentUser = (accessToken: string | null) => {
  return useQuery({
    queryKey: ['currentUser', accessToken],
    queryFn: () => {
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      return getCurrentUser(accessToken);
    },
    enabled: Boolean(accessToken),
    retry: false,
  });
};
