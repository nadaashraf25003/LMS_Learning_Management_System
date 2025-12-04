import { useState } from "react";
import useQuiz from "@/hooks/useQuiz";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import ConfirmToast from "@/utils/ConfirmToast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const QUIZZES_PER_PAGE = 10;

function QuizManagement() {
  const navigate = useNavigate();
  const { getQuizzesByInstructor, deleteQuizMutation } = useQuiz();
  const { data: quizzesData, isLoading } = getQuizzesByInstructor();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const quizzes = quizzesData ?? [];
  const totalPages = Math.max(1, Math.ceil(quizzes.length / QUIZZES_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * QUIZZES_PER_PAGE;
  const pageQuizzes = quizzes.slice(
    pageStartIndex,
    pageStartIndex + QUIZZES_PER_PAGE
  );

  const handleView = (quiz) => {
    navigate(
      `/InstructorLayout/QuizDetails/${quiz.id}/${quiz.courseId}/${quiz.lessonId}`
    );
  };

  const handleEdit = (quiz) => {
    navigate(
      `/InstructorLayout/EditQuiz/${quiz.id}/${quiz.courseId}/${quiz.lessonId}`
    );
  };

  const handleDelete = (quiz) => {
    toast.custom((t) => (
      <ConfirmToast
        message={`Are you sure you want to delete the quiz "${quiz.title}"?`}
        onConfirm={async () => {
          try {
            await deleteQuizMutation.mutateAsync(quiz.id);
            toast.success("Quiz deleted successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete quiz.");
          }
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading quizzes...
      </div>
    );

  // if (isError)
  //   return (
  //     <div className="flex items-center justify-center h-48 text-red-500 font-semibold">
  //       ❌ Failed to load quizzes.
  //     </div>
  //   );

  return (
    <div className="p-6">
      <LandingHeading header="Quizzes Management" />

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Lesson ID</th>
              <th className="px-4 py-2 text-left">Course ID</th>
              <th className="px-4 py-2 text-left">Questions</th>
              <th className="px-4 py-2 text-left">Total Marks</th>
              <th className="px-4 py-2 text-left">Passing Score</th>
              <th className="px-4 py-2 text-left">Posted</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageQuizzes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No quizzes found.
                </td>
              </tr>
            ) : (
              pageQuizzes.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{quiz.title}</td>
                  <td className="px-4 py-3">{quiz.lessonId}</td>
                  <td className="px-4 py-3">{quiz.courseId}</td>
                  <td className="px-4 py-3">{quiz.totalQuestions}</td>
                  <td className="px-4 py-3">{quiz.totalMarks}</td>
                  <td className="px-4 py-3">{quiz.passingScore}</td>
                  <td className="px-4 py-3">{quiz.posted}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      className="px-2 py-1 text-xs bg-primary text-white rounded-md"
                      onClick={() => setSelectedQuiz(quiz)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-md"
                      onClick={() => handleEdit(quiz)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-secondary text-white rounded-md"
                      onClick={() => handleDelete(quiz)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {pageQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold mb-1">{quiz.title}</p>
              <p className="text-xs">Questions: {quiz.totalQuestions}</p>
              <p className="text-xs">Marks: {quiz.totalMarks}</p>
              <p className="text-xs">{quiz.posted}</p>
            </div>

            <div className="flex flex-col gap-1">
              <button
                className="px-2 py-1 text-xs bg-primary text-white rounded-md"
                onClick={() => setSelectedQuiz(quiz)}
              >
                View
              </button>
              <button
                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-md"
                onClick={() => handleEdit(quiz)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 text-xs bg-secondary text-white rounded-md"
                onClick={() => handleDelete(quiz)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* View Quiz Modal */}
      {selectedQuiz && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setSelectedQuiz(null)}
        >
          <div
            className="bg-surface dark:bg-card rounded-lg shadow-lg w-[400px] max-w-[90vw] p-6 relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-muted-foreground hover:text-destructive transition-colors duration-200 p-1 rounded-full hover:bg-muted/50"
              onClick={() => setSelectedQuiz(null)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {selectedQuiz.title}
              </h2>
              <p className="text-sm text-text-secondary">
                Quiz ID: {selectedQuiz.id}
              </p>
            </div>

            {/* Quiz Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Lesson ID:</span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedQuiz.lessonId}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Course ID:</span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedQuiz.courseId}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">
                  Total Questions:
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedQuiz.totalQuestions}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">
                  Total Marks:
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedQuiz.totalMarks}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">
                  Passing Score:
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedQuiz.passingScore}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Status:</span>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    selectedQuiz.posted
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}
                >
                  {selectedQuiz.posted ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 border border-border"
                onClick={() => setSelectedQuiz(null)}
              >
                Close
              </button>

              {!selectedQuiz.posted && (
                <button
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                  onClick={() => {
                    // Add publish functionality here
                    console.log("Publish quiz:", selectedQuiz.id);
                  }}
                >
                  Publish Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizManagement;
