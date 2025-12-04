/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";

interface QuestionOption {
  id: string; // a, b, c, d
  text: string;
}

export interface QuestionVM {
  id?: string;
  text: string;
  options: QuestionOption[];
  answer: string; // a, b, c, d
}

export interface QuizQuestionsVM {
  quizId: number;
  questions: QuestionVM[];
}

const useQuestion = (quizId?: number) => {
  const queryClient = useQueryClient();

  // 🔹 Get questions by quiz ID
  const getQuestionsByQuiz = (quizId: number) =>
    useQuery({
      queryKey: ["questions", quizId],
      queryFn: async () => {
        const res = await api.get(`${Urls.GetQuestionsByQuiz}${quizId}`);
        return res.data;
      },
      enabled: !!quizId,
    });

  // 🔹 Get question by ID
  const getQuestionById = (id: string) =>
    useQuery({
      queryKey: ["question", id],
      queryFn: async () => {
        const res = await api.get(`${Urls.GetQuestionById}${id}`);
        return res.data;
      },
      enabled: !!id,
    });

  // 🔹 Add multiple questions
  const addQuestionsMutation = useMutation({
    mutationFn: async (data: QuizQuestionsVM) => {
      const res = await api.post(Urls.AddQuestions, data);
      return res.data;
    },
    onSuccess: () => {
      if (quizId) queryClient.invalidateQueries({ queryKey: ["questions", quizId] });
    },
  });

  // 🔹 Update question
  const updateQuestionMutation = useMutation({
    mutationFn: async (data: { id: string; question: QuestionVM }) => {
      const res = await api.put(`${Urls.UpdateQuestion}${data.id}`, data.question);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
      if (quizId) queryClient.invalidateQueries({ queryKey: ["questions", quizId] });
    },
  });

  // 🔹 Delete question
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${Urls.DeleteQuestion}${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["questions", quizId] });
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  return {
    // Queries
    getQuestionsByQuiz,
    getQuestionById,

    // Mutations
    addQuestionsMutation,
    updateQuestionMutation,
    deleteQuestionMutation,
  };
};

export default useQuestion;
