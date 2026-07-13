import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../api/documentsApi';
import { useAuth } from '../context/AuthContext';

export const useGetDocuments = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['documents'],
    queryFn: () => {
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      return getDocuments(accessToken);
    },
    enabled: Boolean(accessToken),
  });
};
