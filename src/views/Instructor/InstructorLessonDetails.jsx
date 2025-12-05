import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLesson from "@/hooks/useLesson";
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";

export default function InstructorLessonDetails() {
  const { id } = useParams(); // lesson ID
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("content");

  const { getLessonById, deleteLessonMutation, markRequiredMutation } =
    useLesson(id);
  const { data: lesson, isLoading } = getLessonById(id);
  console.log(lesson);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card prose">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card prose">No lesson found.</div>
      </div>
    );
  }

  // const handleDelete = async () => {
  //   // if (!window.confirm("Are you sure you want to delete this lesson?")) return;
  //   try {
  //     await deleteLessonMutation.mutateAsync(lesson.lessonId);
  //     toast.success("Lesson deleted successfully!");
  //     navigate("/InstructorLayout/MyCourses");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to delete lesson.");
  //   }
  // };
  const handleDelete = () => {
    toast.custom((t) => (
      <ConfirmToast
        message={`Are you sure you want to delete the lesson "${lesson.title}"?`}
        onConfirm={async () => {
          try {
            await deleteLessonMutation.mutateAsync(lesson.lessonId);
            toast.success("Lesson deleted successfully!");
            navigate("/InstructorLayout/MyCourses");
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete lesson.");
          }
          toast.dismiss(t.id); // dismiss the toast after action
        }}
        onCancel={() => {
          toast.dismiss(t.id); // dismiss the toast on cancel
        }}
      />
    ));
  };

  // const handleMarkRequired = async () => {
  //   try {
  //     await markRequiredMutation.mutateAsync(lesson.lessonId);
  //     toast.success("Lesson marked as required for certification!");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to mark lesson.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster position="top-center" />
      <div className="custom-container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">
            {lesson.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-primary btn-hover"
              onClick={() =>
                navigate(`/InstructorLayout/EditLesson/${lesson.lessonId}`)
              }
            >
              Edit Lesson
            </button>
            <button
              className="btn bg-destructive text-white btn-hover"
              onClick={handleDelete}
            >
              Delete Lesson
            </button>
            {/* <button
              className="btn btn-secondary btn-hover"
              onClick={handleMarkRequired}
            >
              Mark for Certification
            </button> */}
            <button
              className="btn btn-hover border border-input bg-transparent text-text-primary"
              onClick={() =>
                navigate(
                  `/InstructorLayout/CreateQuiz/${lesson.courseId}/${lesson.lessonId}`
                )
              }
            >
              + Add Quiz
            </button>
          </div>
        </div>

        {/* Video */}
        {lesson.videoUrl && (
          <>
            {/* If YouTube URL */}
            {lesson.videoUrl.includes("youtu.be") ||
            lesson.videoUrl.includes("youtube.com") ? (
              <iframe
                src={`https://www.youtube.com/embed/${
                  lesson.videoUrl.includes("youtu.be")
                    ? lesson.videoUrl.split("youtu.be/")[1].split("?")[0]
                    : new URL(lesson.videoUrl).searchParams.get("v")
                }`}
                className="w-full h-72 md:h-96 rounded-lg border border-border shadow-md"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              /* If MP4 URL */
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-72 md:h-96 object-cover rounded-lg border border-border shadow-md"
              />
            )}
          </>
        )}

        {/* Tabs */}
        <div className="card space-y-4 border border-border">
          <div className="flex gap-6 border-b border-border pb-3">
            <button
              className={`pb-2 font-semibold transition-colors duration-200 ${
                currentTab === "content"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("content")}
            >
              Lesson Content
            </button>
            <button
              className={`pb-2 font-semibold transition-colors duration-200 ${
                currentTab === "quizzes"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("quizzes")}
            >
              Quizzes
            </button>
          </div>

          {currentTab === "content" && (
            <div className="prose mt-4 text-text-secondary">
              <p>
                <strong className="text-text-primary">Description:</strong>
              </p>
              <p className="whitespace-pre-wrap bg-muted p-4 rounded-lg border border-border">
                {lesson.description || "N/A"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <p>
                  <strong className="text-text-primary">Duration:</strong>{" "}
                  {lesson.duration} mins
                </p>
                <p>
                  <strong className="text-text-primary">Content Type:</strong>{" "}
                  {lesson.contentType}
                </p>
                <p>
                  <strong className="text-text-primary">Attachment:</strong>{" "}
                  {lesson.attachmentUrl ? (
                    <a
                      href={lesson.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline hover:text-secondary transition-colors"
                    >
                      View Attachment
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong className="text-text-primary">Free Preview:</strong>{" "}
                  {lesson.isFreePreview ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}

          {currentTab === "quizzes" && (
            <div className="space-y-3 mt-4">
              {lesson.quizzes && lesson.quizzes.length > 0 ? (
                <ul className="space-y-2">
                  {lesson.quizzes.map((quiz, index) => (
                    <li
                      key={index}
                      className="card p-4 cursor-pointer hover:bg-muted card-hover border border-border"
                      onClick={() =>
                        navigate(
                          `/InstructorLayout/InstQuizDetails/${quiz.id}/${quiz.courseId}/${quiz.lessonId}`
                        )
                      }
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-text-primary">
                            Quiz {index + 1}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {quiz.title}
                          </p>
                        </div>
                        <span className="text-text-secondary text-sm">
                          {quiz.questions?.length || 0} questions
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">
                    No quizzes available for this lesson.
                  </p>
                  <button
                    className="btn btn-primary btn-hover"
                    onClick={() =>
                      navigate(
                        `/InstructorLayout/CreateQuiz/${lesson.courseId}/${lesson.lessonId}`
                      )
                    }
                  >
                    Create First Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 space-y-4 border border-border lg:col-span-2">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Lesson Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Lesson ID</p>
                <p className="font-medium text-text-primary">
                  {lesson.lessonId}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Course ID</p>
                <p className="font-medium text-text-primary">
                  {lesson.courseId}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Order in Course</p>
                <p className="font-medium text-text-primary">{lesson.order}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Duration</p>
                <p className="font-medium text-text-primary">
                  {lesson.duration} minutes
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Free Preview</p>
                <p className="font-medium text-text-primary">
                  {lesson.isFreePreview ? (
                    <span className="text-green-600">Enabled</span>
                  ) : (
                    <span className="text-text-secondary">Disabled</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">
                  Certification Required
                </p>
                <p className="font-medium text-text-primary">
                  {lesson.isRequiredForCertification ? (
                    <span className="text-secondary">Required</span>
                  ) : (
                    <span className="text-text-secondary">Optional</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 space-y-4 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                className="w-full btn btn-primary btn-hover"
                onClick={() =>
                  navigate(`/InstructorLayout/EditLesson/${lesson.lessonId}`)
                }
              >
                Edit Lesson Content
              </button>
              <button
                className="w-full btn btn-secondary btn-hover"
                onClick={() =>
                  navigate(
                    `/InstructorLayout/CreateQuiz/${lesson.courseId}/${lesson.lessonId}`
                  )
                }
              >
                Add New Quiz
              </button>
              {/* <button
                className="w-full btn bg-transparent border border-input text-text-primary btn-hover"
                onClick={handleMarkRequired}
              >
                {lesson.isRequiredForCertification ? "Remove Certification Requirement" : "Mark for Certification"}
              </button> */}
              <button
                className="w-full btn bg-destructive text-white btn-hover"
                onClick={handleDelete}
              >
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
