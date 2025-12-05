import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCourse from "@/hooks/useCourse";
import DefaultImage from "../../../public/images/default-avatar.png";
export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("about");

  const { CourseById } = useCourse(id);
  const { data: course, isLoading } = CourseById;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-fade-in-up text-lg font-medium text-[var(--text-secondary)]">
          Loading course...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-lg font-medium text-[var(--text-secondary)]">
          No course found.
        </div>
      </div>
    );
  } const imageUrl = course.image
      ? `${import.meta.env.VITE_BASE_URL}${course.image}` // Vite
      : DefaultImage;


  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="flex flex-col lg:flex-row items-start gap-6 bg-[var(--color-card)] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--color-border)]">
              <img
                src={
                  imageUrl
                }
                alt={course.title}
                className="w-full lg:w-72 h-48 lg:h-40 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              />
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight">
                  {course.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/20">
                    ⭐ {course.rating ?? "-"} Rating
                  </span>
                  <span className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    📚 {course.studentsEnrolled} enrolled
                  </span>
                  <span className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    🗓️ {course.posted}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    className="btn btn-primary btn-hover px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                    onClick={() =>
                      navigate(`/InstructorLayout/CreateLesson/${id}`)
                    }
                  >
                    <span className="text-lg">+</span>
                    Add Lesson
                  </button>
                  {/* <button
                    className="btn btn-outline border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    onClick={() =>
                      navigate(`/InstructorLayout/CreateQuiz/${id}`)
                    }
                  >
                    <span className="text-lg">+</span>
                    Add Quiz
                  </button> */}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-[var(--color-card)] rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden">
              <div className="flex border-b border-[var(--color-border)]">
                {[
                  { id: "about", label: "About Course" },
                  { id: "content", label: "Course Content" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 px-6 py-4 font-semibold text-lg transition-all duration-300 ${
                      currentTab === tab.id
                        ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                        : "text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                    }`}
                    onClick={() => setCurrentTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              <div className="p-8">
                {currentTab === "about" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full"></span>
                        Course Description
                      </h2>
                      <p className="text-[var(--text-secondary)] text-lg leading-relaxed bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]">
                        {course.description || "No description provided."}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="w-2 h-8 bg-[var(--color-secondary)] rounded-full"></span>
                        Course Duration
                      </h2>
                      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]">
                        <p className="text-[var(--color-primary)] text-xl font-semibold">
                          {course.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "content" && (
                  <div className="space-y-8">
                    {/* Lessons */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full"></span>
                        Lessons ({course.lessons?.length || 0})
                      </h2>
                      {course.lessons.map((lesson, idx) => (
                        <div
                          key={idx}
                          className="p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg cursor-pointer transition-all duration-300 group"
                          onClick={() =>
                            navigate(
                              `/InstructorLayout/InstLessonDetails/${lesson.lessonId}`
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                                  {lesson.title || `Lesson ${idx + 1}`}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">
                                  Click to view details
                                </p>
                              </div>
                            </div>
                            <div className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              →
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quizzes */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="w-2 h-8 bg-[var(--color-secondary)] rounded-full"></span>
                        Quizzes ({course.quizzes?.length || 0})
                      </h2>
                      {course.quizzes && course.quizzes.length ? (
                        <div className="space-y-3">
                          {course.quizzes.map((quiz, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                navigate(
                                  `/InstructorLayout/InstQuizDetails/${quiz.id}/${quiz.courseId}/${quiz.lessonId}`
                                )
                              }
                              className="p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[var(--color-secondary)] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                  Q{idx + 1}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-[var(--text-primary)]">
                                    {quiz.title || `Quiz ${idx + 1}`}
                                  </h3>
                                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                                    Test your knowledge
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                          <p className="text-[var(--text-secondary)] text-lg">
                            No quizzes available yet.
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] mt-2">
                            Add quizzes to test your students!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full"></span>
                Course Information
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "💰", label: "Price", value: `$${course.price}` },
                  // { icon: "👀", label: "Views", value: course.views },
                  { icon: "⏱️", label: "Duration", value: course.hours },
                  {
                    icon: "👨‍🎓",
                    label: "Students",
                    value: course.studentsEnrolled,
                  },
                  { icon: "👨‍🏫", label: "Author", value: course.author },
                  {
                    icon: "📚",
                    label: "Category",
                    value: course.category || "N/A",
                  },
                  {
                    icon: "📜",
                    label: "Certificate",
                    value: course.certificateIncluded
                      ? "Included"
                      : "Not Included",
                    color: course.certificateIncluded
                      ? "text-green-600"
                      : "text-[var(--text-secondary)]",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[var(--text-secondary)] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`font-semibold text-[var(--text-primary)] ${
                        item.color || ""
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3"
                  onClick={() =>
                    navigate(`/InstructorLayout/CreateLesson/${id}`)
                  }
                >
                  <span className="text-lg">📖</span>
                  Add New Lesson
                </button>
                <button
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3"
                  onClick={() => navigate(`/InstructorLayout/CreateQuiz/${id}/0`)}
                >
                  <span className="text-lg">🧩</span>
                  Create Quiz
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
