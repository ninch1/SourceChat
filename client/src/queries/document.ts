import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDocumentFromText, getDocuments } from '../api/documentsApi';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuth } from '../context/AuthContext';
import type { CreateTextDocumentData } from '../types/document';

export const useGetDocuments = () => {
  const { accessToken } = useAuth();
  const authFetch = useAuthFetch();

  return useQuery({
    queryKey: ['documents', accessToken],
    queryFn: () => getDocuments(authFetch),
    enabled: Boolean(accessToken),
  });
};

export const useCreateDocumentFromText = () => {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentData: CreateTextDocumentData) =>
      createDocumentFromText(authFetch, documentData),
    onSuccess: () => {
      // The documents query key is ['documents', accessToken]. Matching on the
      // ['documents'] prefix refetches it regardless of the current token.
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};
