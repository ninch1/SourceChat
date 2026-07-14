import { useMutation } from '@tanstack/react-query';
import { askQuestion } from '../api/askApi';
import { useAuthFetch } from '../hooks/useAuthFetch';
import type { AskQuestionData } from '../types/ask';

export const useAskQuestion = () => {
  const authFetch = useAuthFetch();

  return useMutation({
    mutationFn: (questionData: AskQuestionData) =>
      askQuestion(authFetch, questionData),
  });
};
