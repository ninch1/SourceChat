import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/authApi';

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
