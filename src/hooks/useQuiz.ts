/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";

interface AddQuizData {
  title: string;
  duration: number;
  lessonId: number;
  passingScore: number;
  totalQuestions: number;
}

interface UpdateQuizData {
  id: number;
  title: string;
  duration: number;
  passingScore: number;
  lessonId: number; // required by backend
  totalQuestions: number;
}

interface SubmitQuizData {
  [questionId: string]: string; // the answers dictionary
}

const useQuiz = (id?: string) => {
  const queryClient = useQueryClient();

  // 🔹 Get quiz by ID
  const getQuizById = (id: string) =>
    useQuery({
      queryKey: ["quiz", id],
      queryFn: async () => {
        const res = await api.get(`${Urls.GetQuizById}${id}`);
        return res.data;
      },
      enabled: !!id,
    });

  // 🔹 Get all quizzes for instructor
  const getAllQuizzes = () =>
    useQuery({
      queryKey: ["quizzes"],
      queryFn: async () => {
        const res = await api.get(Urls.GetAllQuizzes);
        return res.data;
      },
    });

  // 🔹 Add quiz
  const addQuizMutation = useMutation({
    mutationFn: async (data: AddQuizData) => {
      const res = await api.post(Urls.AddQuiz, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: async (data: UpdateQuizData) => {
      const res = await api.put(`${Urls.UpdateQuiz}${id}`, data);
      return res.data;
    },
  });

  // 🔹 Delete quiz
  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${Urls.DeleteQuiz}${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
  // 🔹 Get quizzes for logged-in instructor automatically
  const getQuizzesByInstructor = () =>
    useQuery({
      queryKey: ["quizzes-instructor"],
      queryFn: async () => {
        const res = await api.get(Urls.GetQuizzesByInstructor);
        return res.data;
      },
    });

  // 🔹 Get quiz by ID for student
  const getQuizForStudentById = (id: string) =>
    useQuery({
      queryKey: ["quiz-student", id],
      queryFn: async () => {
        const res = await api.get(`${Urls.GetQuizByIdForStudent}${id}`);
        return res.data;
      },
      enabled: !!id,
    });

// 🔹 Submit quiz for student
const submitQuizMutation = useMutation({
  mutationFn: async ({ quizId, answers }: { quizId: number; answers: Record<string, string> }) => {
    const formattedAnswers: Record<string, string> = {};
    Object.entries(answers).forEach(([qId, optId]) => {
      formattedAnswers[qId] = optId.toString();
    });

    const res = await api.post(`${Urls.SubmitQuiz}${quizId}`, formattedAnswers);
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["quiz-student"] });
    queryClient.invalidateQueries({ queryKey: ["quizzes-instructor"] });
  },
});
// 🔹 Get student quiz result by quizId
const getQuizResultById = (quizId?: string) =>
  useQuery({
    queryKey: ["quiz-result", quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const res = await api.get(`${Urls.StudentQuizResult}/${quizId}`); // matches your controller route
      return res.data;
    },
    enabled: !!quizId, // only fetch if quizId is provided
  });

// const checkQuizStatusMutation = useMutation({
//   mutationFn: async (quizId: string) => {
//     const res = await api.get(`/Quiz/check/${quizId}`);
//     return res.data; // expected: { quizId: 1, status: "submitted", score: 100 }
//   },
// });

const checkQuizStatusMutation = (quizId?: string) =>
  useQuery({
    queryKey: ["quiz-status", quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const res = await api.get(`/StudentQuizStatus/check/${quizId}`);
      return res.data;
    },
    enabled: !!quizId,
  });
  return {
    // Queries
    getQuizById,
    getAllQuizzes,
    getQuizzesByInstructor,
    getQuizResultById,
    getQuizForStudentById,
    // Mutations
    addQuizMutation,
    updateQuizMutation,
    deleteQuizMutation,
    submitQuizMutation,
    checkQuizStatusMutation,
    
  };
};

export default useQuiz;
