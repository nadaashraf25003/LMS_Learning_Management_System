import { useNavigate, useParams } from "react-router-dom";
import useQuiz from "@/hooks/useQuiz";
import toast, { Toaster } from "react-hot-toast";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import ConfirmToast from "@/utils/ConfirmToast";
import useQuestion from "@/hooks/useQuestion";
import { useState } from "react";

export default function InstructorQuizDetails() {
  const { quizid: quizId, courseid: courseId } = useParams();
  const navigate = useNavigate();
  const { getQuizById, deleteQuizMutation } = useQuiz();
  const { deleteQuestionMutation, updateQuestionMutation } = useQuestion();

  const { data: quiz, isLoading, error } = getQuizById(quizId);
  // ✅ Modal state
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Form state for editing
  const [editForm, setEditForm] = useState(null);

  const handleDeleteQuiz = async () => {
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

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading quiz details...</div>
      </div>
    );

  if (error || !quiz)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-red-600">
          Failed to fetch quiz details.
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-card rounded-2xl shadow-lg flex flex-col gap-6">
      <LandingHeading header={`Quiz: ${quiz.title}`} />
      <Toaster position="top-center" />

      {/* Quiz Info */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Quiz Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Title:</strong> {quiz.title}
          </div>
          <div>
            <strong>Duration:</strong> {quiz.duration} seconds
          </div>
          <div>
            <strong>Total Marks:</strong> {quiz.totalMarks}
          </div>
          <div>
            <strong>Passing Score:</strong> {quiz.passingScore}
          </div>
          <div>
            <strong>Total Questions:</strong> {quiz.totalQuestions || 0}
          </div>
          <div>
            <strong>Posted:</strong> {quiz.posted}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={() =>
              navigate(
                `/InstructorLayout/EditQuiz/${quiz.id}/${quiz.courseId}/${quiz.lessonId}`
              )
            }
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Edit Quiz
          </button>

          <button
            onClick={handleDeleteQuiz}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700/90"
          >
            Delete Quiz
          </button>

          <button
            onClick={() =>
              navigate(
                `/InstructorLayout/CreateQuestions/${quiz.courseId}/${quiz.lessonId}/${quiz.id}`
              )
            }
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90"
          >
            Add Question
          </button>
        </div>
      </div>

     {/* Questions List */}
<div className="bg-surface p-6 rounded-xl border border-border shadow-sm card-hover">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-text-primary">Questions</h2>
    <div className="text-sm text-text-secondary bg-muted px-3 py-1 rounded-full">
      {quiz.questions?.length || 0} questions
    </div>
  </div>
  
  {quiz.questions && quiz.questions.length ? (
    <div className="space-y-4">
      {quiz.questions.map((q, idx) => (
        <div
          key={q.id}
          className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-300 card-hover group"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-semibold flex-shrink-0">
                  {idx + 1}
                </div>
                <h3 className="font-semibold text-text-primary text-lg">
                  {q.text}
                </h3>
              </div>
              
              {q.options && (
                <ul className="space-y-2 ml-9">
                  {q.options.map((opt) => (
                    <li
                      key={opt.id}
                      className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                        q.answer === opt.id
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold border border-green-200 dark:border-green-800"
                          : "bg-muted text-text-secondary"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        q.answer === opt.id
                          ? "bg-green-500 text-white"
                          : "bg-border text-text-secondary"
                      }`}>
                        {opt.id.toUpperCase()}
                      </div>
                      <span className={!opt.text ? "text-muted-foreground italic" : ""}>
                        {opt.text || "[Empty option]"}
                      </span>
                      {q.answer === opt.id && (
                        <svg className="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => {
                  setEditingQuestion(q);
                  setEditForm({ ...q });
                }}
                className="flex items-center gap-2 text-primary hover:text-primary/80 px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <button
                onClick={() =>
                  toast.custom((t) => (
                    <ConfirmToast
                      message="Are you sure you want to delete this question?"
                      onConfirm={async () => {
                        toast.dismiss(t.id);
                        try {
                          await deleteQuestionMutation.mutateAsync(q.id);
                          toast.success("Question deleted successfully!");
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to delete question");
                        }
                      }}
                      onCancel={() => toast.dismiss(t.id)}
                    />
                  ))
                }
                className="flex items-center gap-2 text-destructive hover:text-destructive/80 px-3 py-2 rounded-md bg-destructive/10 hover:bg-destructive/20 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">No Questions Added</h3>
      <p className="text-text-secondary">Start by creating your first question above.</p>
    </div>
  )}
</div>

{/* Edit Question Modal */}
{editingQuestion && editForm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-up">
    <div className="bg-card border border-border rounded-xl w-full max-w-2xl shadow-2xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">Edit Question</h2>
        <button
          onClick={() => setEditingQuestion(null)}
          className="text-muted-foreground hover:text-text-primary transition-colors p-1 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Question Text
          </label>
          <input
            type="text"
            value={editForm.text}
            onChange={(e) =>
              setEditForm({ ...editForm, text: e.target.value })
            }
            className="w-full border border-input bg-background text-text-primary px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="Enter your question here..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            Answer Options
          </label>
          <div className="space-y-3">
            {editForm.options.map((opt, idx) => (
              <div 
                key={opt.id} 
                className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${
                  editForm.answer === opt.id 
                    ? 'ring-2 ring-primary bg-primary/5 border-primary/20' 
                    : 'border-border hover:bg-surface'
                }`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full font-medium text-sm ${
                  editForm.answer === opt.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {opt.id.toUpperCase()}
                </div>
                
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => {
                    const newOptions = [...editForm.options];
                    newOptions[idx].text = e.target.value;
                    setEditForm({ ...editForm, options: newOptions });
                  }}
                  className="flex-1 border border-input bg-background text-text-primary px-3 py-2 rounded-md focus:ring-1 focus:ring-primary focus:border-transparent"
                  placeholder={`Option ${opt.id.toUpperCase()}`}
                />
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="correct"
                    checked={editForm.answer === opt.id}
                    onChange={() =>
                      setEditForm({ ...editForm, answer: opt.id })
                    }
                    className="w-4 h-4 text-primary focus:ring-primary border-border"
                  />
                  <span className="text-sm font-medium text-text-secondary">Correct</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-border bg-surface rounded-b-xl">
        <button
          onClick={() => setEditingQuestion(null)}
          className="px-6 py-2 rounded-lg border border-border text-text-secondary hover:bg-muted transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!editForm) return;
            try {
              await updateQuestionMutation.mutateAsync({
                id: editingQuestion.id,
                question: editForm,
              });
              toast.success("Question updated successfully!");
              setEditingQuestion(null);
            } catch (err) {
              toast.error("Failed to update question");
            }
          }}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium btn-hover"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
