import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQuiz from "@/hooks/useQuiz";
import toast, { Toaster } from "react-hot-toast";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import ConfirmToast from "@/utils/ConfirmToast";

export default function EditQuiz() {
  const {
    quizid: quizId,
    courseid: courseId,
    lessonId: lessonId,
  } = useParams();
  const navigate = useNavigate();
  const { getQuizById, updateQuizMutation, deleteQuizMutation } =
    useQuiz(quizId);

  const { data: quiz, isLoading } = getQuizById(quizId);

  const [form, setForm] = useState({
    title: "",
    // duration: 0,
    // passingScore: 50,
    // totalQuestions: 0,
  });

  useEffect(() => {
    if (quiz) {
      setForm({
        title: quiz.title,
        duration: quiz.duration,
        passingScore: quiz.passingScore,
        totalQuestions: quiz.totalQuestions || 0,
        totalMarks: quiz.totalMarks || 0,
        lessonId: Number(lessonId),
        courseId: Number(courseId),
      });
    }
  }, [quiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "duration" ||
        name === "passingScore" ||
        name === "totalQuestions" ||
        name === "totalMarks"
          ? Number(value)
          : value,
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        // Id: Number(quizId), // match QuizVM.Id
        Title: form.title,
        Duration: Number(form.duration),
        PassingScore: Number(form.passingScore),
        TotalMarks: Number(form.totalMarks),
        TotalQuestions: Number(form.totalQuestions),
        LessonId: Number(lessonId),
        CourseId: Number(courseId),
      };

      await updateQuizMutation.mutateAsync(payload);
      toast.success("Quiz updated successfully!");
      console.log("Payload for update:", payload);
      navigate(
        `/InstructorLayout/InstQuizDetails/${quizId}/${courseId}/${lessonId}`
      );
    } catch (err) {
      console.log("Update failed:", err.response || err);
      toast.error("Failed to update quiz.");
    }
  };

  const handleDelete = async () => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to delete this quiz?"
        onConfirm={async () => {
          toast.dismiss(t.id);
          try {
            await deleteQuizMutation.mutateAsync(quizId);
            toast.success("Quiz deleted successfully!");
            navigate(`/InstructorLayout/InstCourseDetails/${courseId}`);
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete quiz");
          }
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading quiz details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-card rounded-2xl shadow-lg flex flex-col gap-6">
      <Toaster />
      <LandingHeading header="Edit Quiz" />
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <label className="font-semibold">Quiz Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <label className="font-semibold">Duration (seconds)</label>
        <input
          type="number"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />
        <label className="font-semibold">Total Marks</label>
        <input
          type="number"
          name="totalMarks"
          value={form.totalMarks}
          onChange={handleChange}
          className="border p-3 rounded"
          min={0}
          max={100}
          required
        />
        <label className="font-semibold">Passing Score</label>
        <input
          type="number"
          name="passingScore"
          value={form.passingScore}
          onChange={handleChange}
          className="border p-3 rounded"
          min={0}
          max={100}
          required
        />

        <label className="font-semibold">Total Questions</label>
        <input
          type="number"
          name="totalQuestions"
          value={form.totalQuestions}
          onChange={handleChange}
          className="border p-3 rounded"
          min={0}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded hover:bg-primary/90 flex-1"
          >
            Update Quiz
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700 flex-1"
          >
            Delete Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
