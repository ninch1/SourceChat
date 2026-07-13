import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../api/documentsApi';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuth } from '../context/AuthContext';

export const useGetDocuments = () => {
  const { accessToken } = useAuth();
  const authFetch = useAuthFetch();

  return useQuery({
    queryKey: ['documents', accessToken],
    queryFn: () => getDocuments(authFetch),
    enabled: Boolean(accessToken),
  });
};
