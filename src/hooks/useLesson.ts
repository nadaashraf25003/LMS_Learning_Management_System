/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";

// export interface Lesson {
//   id: string;
//   title: string;
//   description?: string;
//   courseId: string;
//   videoUrl?: string;
//   isCompleted?: boolean;
//   order?: number;
// }

// export interface LessonProgress {
//   courseId: string;
//   completedLessons: number;
//   totalLessons: number;
//   progressPercentage: number;
// }
interface AddLessonData {
  courseId: number;
  title: string;
  videoUrl: string;
  order: number;
}

interface UpdateLessonData extends Omit<AddLessonData, "courseId"> {}

const useLesson = (id?: string) => {
  const queryClient = useQueryClient();

  // ✅ Get lesson by ID
  // Get single lesson by ID (Instructor)
  const getLessonById = (id: string) =>
    useQuery({
      queryKey: ["lesson", id],
      queryFn: async () => {
        const res = await api.get(Urls.GetLessonById + id);
        return res.data;
      },
      enabled: !!id,
    });

  // ✅ Get lessons by course
  // Get all lessons by Course (Instructor)
  const getLessonsByCourse = (courseId: string) =>
    useQuery({
      queryKey: ["lessons", courseId],
      queryFn: async () => {
        const res = await api.get(Urls.GetLessonByCourse + courseId);
        return res.data;
      },
      enabled: !!courseId,
    });

  // ✅ Add lesson
  const addLessonMutation = useMutation({
    mutationFn: async (data: AddLessonData) => {
      const res = await api.post(Urls.AddLesson, data);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  // ✅ Update lesson
  const updateLessonMutation = useMutation({
    mutationFn: async (data: UpdateLessonData) => {
      const res = await api.put(Urls.UpdateLesson + id, data);
      return res.data;
    },

    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
    },
  });

  // ✅ Delete lesson
  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(Urls.DeleteLesson + id);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  // 🔹 Get lessons for logged-in instructor automatically
  const getLessonsByInstructor = () =>
    useQuery({
      queryKey: ["lessons-instructor"],
      queryFn: async () => {
        const res = await api.get(Urls.GetLessonsByInstructor);
        return res.data;
      },
    });

  /* ============================
   *      Student Queries
   * ============================ */

  // Get lessons by course (Student)
  const getLessonsByCourseForStudent = (courseId: string) =>
    useQuery({
      queryKey: ["student-lessons", courseId],
      queryFn: async () => {
        const res = await api.get(
          `/Lesson/by-courseid-for-student/${courseId}`
        );
        return res.data;
      },
      enabled: !!courseId,
    });

  // Get single lesson (Student)
  const getLessonForStudent = (lessonId: string) =>
    useQuery({
      queryKey: ["student-lesson", lessonId],
      queryFn: async () => {
        const res = await api.get(
          `/Lesson/by-lessonid-for-student/${lessonId}`
        );
        return res.data;
      },
      enabled: !!lessonId,
    });

  // Get Lesson Progress
  const getStudentcourseProgress = (courseid: string) =>
    useQuery({
      queryKey: ["student-lesson-progress", courseid],
      queryFn: async () => {
        const res = await api.get(`/Lesson/course-progress/${courseid}`);
        return res.data;
      },
      enabled: !!courseid,
    });

  // Mark Lesson Complete (Student)
  const completeLessonForStudent = useMutation({
    mutationFn: async (lessonId: string) => {
      const res = await api.post(`/Lesson/complete/${lessonId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-lesson-progress"] });
      // toast.success("Completed 🎉");
    },
  });
  return {
    // Instructor
    getLessonById,
    getLessonsByCourse,
    getLessonsByInstructor,
    addLessonMutation,
    updateLessonMutation,
    deleteLessonMutation,

    // Student
    getLessonsByCourseForStudent,
    getLessonForStudent,
    getStudentcourseProgress,
    completeLessonForStudent,
  };
};

export default useLesson;
