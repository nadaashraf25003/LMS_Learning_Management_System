/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import useLesson from "@/hooks/useLesson";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import ConfirmToast from "@/utils/ConfirmToast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const LESSONS_PER_PAGE = 10;

function LessonManagement() {
  const navigate = useNavigate();
  const { getLessonsByInstructor, deleteLessonMutation } = useLesson();
  const { data: lessonsData, isLoading} = getLessonsByInstructor();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Example static lesson (optional)
  // const exampleLesson = {
  //   lessonId: 2,
  //   courseId: 2,
  //   title: "Lesson_2_1",
  //   videoUrl: "https://www.google.com/",
  //   description: "Lesson_2_1",
  //   duration: 10,
  //   contentType: "video",
  //   attachmentUrl: "https://www.google.com/",
  //   isFreePreview: true,
  //   order: 1,
  //   createdAt: "2025-11-16T22:56:18.0539065",
  //   quizzes: [],
  // };

  // Merge actual lessons with example
  const lessons = [
    // exampleLesson,
    ...(lessonsData?.map((lesson) => ({ ...lesson })) ?? []),
  ];
   console.log(lessons)
  const totalPages = Math.max(1, Math.ceil(lessons.length / LESSONS_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * LESSONS_PER_PAGE;
  const pageLessons = lessons.slice(
    pageStartIndex,
    pageStartIndex + LESSONS_PER_PAGE
  );

  const handleView = (lesson) => setSelectedLesson(lesson);

  const handleEdit = (lesson) => {
    navigate(`/InstructorLayout/EditLesson/${lesson.lessonId}`);
  };
  // console.log(object)

  const handleDelete = (lesson) => {
    toast.custom((t) => (
      <ConfirmToast
        message={`Are you sure you want to delete the lesson "${lesson.title}"?`}
        onConfirm={async () => {
          try {
            await deleteLessonMutation.mutateAsync(lesson.lessonId);
            toast.success("Lesson deleted successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete lesson.");
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
        Loading lessons...
      </div>
    );

  // if (isError)
  //   return (
  //     <div className="flex items-center justify-center h-48 text-red-500 font-semibold">
  //       ❌ Failed to load lessons.
  //     </div>
  //   );

  return (
    <div className="p-6">
      <LandingHeading header="Lessons Management" />

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">Preview</th>
              <th className="px-4 py-2 text-left">Quizzes</th>
              <th className="px-4 py-2 text-left">Posted</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageLessons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No lessons found.
                </td>
              </tr>
            ) : (
              pageLessons.map((lesson) => (
                <tr
                  key={lesson.lessonId}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{lesson.title}</td>
                  <td className="px-4 py-3">{lesson.duration} min</td>
                  <td className="px-4 py-3">{lesson.order}</td>
                  <td className="px-4 py-3">
                    {lesson.isFreePreview ? (
                      <span className="text-green-500 font-bold">✔ YES</span>
                    ) : (
                      <span className="text-red-500 font-bold">✖ NO</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{lesson.TotalQuizzes?? 0}</td>
                  <td className="px-4 py-3">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      className="px-2 py-1 text-xs bg-primary text-white rounded-md"
                      onClick={() => handleView(lesson)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-md"
                      onClick={() => handleEdit(lesson)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-secondary text-white rounded-md"
                      onClick={() => handleDelete(lesson)}
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
        {pageLessons.map((lesson) => (
          <div
            key={lesson.lessonId}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold mb-2">{lesson.title}</p>
              <p className="text-xs mb-2">Duration: {lesson.duration} min</p>
              <p className="text-xs mb-2">Order: {lesson.order}</p>
              <p className="text-xs mb-1">
                Free Preview: {lesson.isFreePreview ? "✔ YES" : "✖ NO"}
              </p>
              <p className="text-xs">
                {new Date(lesson.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <button
                className="px-2 py-1 text-xs bg-primary text-white rounded-md"
                onClick={() => handleView(lesson)}
              >
                View
              </button>
              <button
                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-md"
                onClick={() => handleEdit(lesson)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 text-xs bg-secondary text-white rounded-md"
                onClick={() => handleDelete(lesson)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* View Modal */}
      {selectedLesson && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setSelectedLesson(null)}
        >
          <div
            className="bg-surface dark:bg-card rounded-lg shadow-lg w-[400px] max-w-[90vw] p-6 relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-muted-foreground hover:text-destructive transition-colors duration-200 p-1 rounded-full hover:bg-muted/50"
              onClick={() => setSelectedLesson(null)}
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
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {selectedLesson.title}
              </h2>
              <p className="text-sm text-text-secondary">
                {selectedLesson.description}
              </p>
            </div>

            {/* Lesson Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Duration:</span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedLesson.duration} min
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Order:</span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedLesson.order}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">
                  Free Preview:
                </span>
                <span
                  className={`text-sm font-medium ${
                    selectedLesson.isFreePreview
                      ? "text-green-600"
                      : "text-text-secondary"
                  }`}
                >
                  {selectedLesson.isFreePreview
                    ? "✓ Available"
                    : "✗ Not Available"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Quizzes:</span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedLesson.quizzes?.length ?? 0}
                </span>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-2 mb-6">
              {selectedLesson.videoUrl && (
                <a
                  href={selectedLesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Watch Video
                </a>
              )}

              {selectedLesson.attachmentUrl && (
                <a
                  href={selectedLesson.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-secondary text-primary-foreground rounded-md hover:bg-secondary/90 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
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
                  View Attachment
                </a>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 border border-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default LessonManagement;
