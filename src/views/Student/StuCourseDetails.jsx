import useCourse from "@/hooks/useCourse";
import useStudent from "@/hooks/useStudent";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import useLesson from "@/hooks/useLesson";
import useQuiz from "@/hooks/useQuiz";

export default function StuCourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("about");

  const { CourseById } = useCourse(id);
  const { data: course, isLoading } = CourseById;

  const {
    saveCourse,
    savedCourses,
    removeSavedCourse,
    enrollCourse,
    myEnrollments,
    removeEnrollment,
    addToCart,
    cart,
  } = useStudent();
  // console.log(course);
  const { getStudentcourseProgress } = useLesson();
  const { checkQuizStatusMutation } = useQuiz();
  const { data: progressData } = getStudentcourseProgress(id);
  const isInCart = cart.data?.some((c) => c.id === course?.id);
  const isSaved = savedCourses.data?.some((c) => c.id === course?.id);
  const isEnrolled = myEnrollments.data?.some((c) => c.id === course?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card p-8 text-center max-w-md">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-text-primary">
            Loading course details...
          </h3>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Course Not Found
          </h2>
          <p className="text-text-secondary">
            The course you're looking for doesn't exist or is no longer
            available.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveCourse = () => {
    saveCourse.mutate(course.id, {
      onSuccess: () => toast.success("Course saved successfully! 💾"),
      onError: () => toast.error("Failed to save course"),
    });
  };

  const handleRemoveSaved = () => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to remove this course from saved?"
        onConfirm={() => {
          removeSavedCourse.mutate(course.id, {
            onSuccess: () => toast.success("Course removed from saved!"),
            onError: () => toast.error("Failed to remove course"),
          });
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  const handleAddToCart = () => {
    addToCart.mutate(course.id, {
      onSuccess: () => toast.success("Course added to cart! 🛒"),
      onError: () => toast.error("Failed to add course to cart"),
    });
  };

  const handleEnroll = () => {
    enrollCourse.mutate(course.id, {
      onSuccess: () => toast.success("Successfully enrolled in course! 🎉"),
      onError: () => toast.error("Failed to enroll in course"),
    });
  };
  const isSubmitted = (quizId) => {
    checkQuizStatusMutation.mutate(quizId, {
      onSuccess: (data) => {
        if (data?.status === "submitted") {
          console.log(data?.status);
          // toast.error("You have already submitted this quiz.");
          navigate(`/StudentLayout/StuQuizResult/${quizId}`);
        } else {
          navigate(`/StudentLayout/StuQuizPage/${id}/${quizId}`);
        }
      },
      onError: () => {
        toast.error("Failed to check quiz status.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "dark:bg-surface dark:text-text-primary",
        }}
      />

      <div className="custom-container py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header Card */}
            <div className="card border border-border p-8 card-hover">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative">
                  <img
                    src={
                      course.image ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={course.title}
                    className="w-full md:w-80 h-48 object-cover rounded-xl shadow-lg"
                  />
                  {course.isNew && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                        {course.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          ⭐ {course.rating ?? "No ratings"}
                        </span>
                        {/* <span className="text-text-secondary text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          {course.studentsEnrolled || 0} students
                        </span> */}
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {course.author?.[0]?.toUpperCase() || "I"}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {course.author || "Instructor"}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Course Instructor
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress or Action Buttons */}
                  {isEnrolled ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-text-primary">
                          Your Progress
                        </span>
                        {/* <span className="text-sm text-text-secondary">
                          {progressData?.completedItems || 0} of {progressData?.totalItems || 0} completed
                        </span> */}
                      </div>

                      {/* Enhanced Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-muted rounded-full h-3 shadow-inner overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out relative"
                              style={{
                                width: `${progressData?.progressPercent ?? 0}%`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                          </div>
                          <span
                            className={`text-lg font-bold min-w-12 transition-all duration-700 ${
                              progressData?.progressPercent === 100
                                ? "text-green-500 scale-110"
                                : "text-text-primary"
                            }`}
                          >
                            {progressData?.progressPercent ?? 0}%
                          </span>
                        </div>

                        {progressData?.progressPercent === 100 && (
                          <div className="flex items-center gap-2 text-green-600">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-semibold">
                              Course Completed! 🎉
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {/* If course is saved → show remove + buy buttons */}
                        {isSaved && !isEnrolled && (
                          <>
                            {/* Remove from Saved */}
                            <button
                              onClick={() => {
                                removeSavedCourse.mutate(course.id, {
                                  onSuccess: () => {
                                    toast.success("Course removed from saved!");
                                    navigate("/StudentLayout/StuSavedCourses");
                                  },
                                  onError: () =>
                                    toast.error("Failed to remove from saved"),
                                });
                              }}
                              className="btn flex-1 py-3 font-semibold bg-gray-700 text-white btn-hover"
                            >
                              Remove from Saved
                            </button>

                            {/* Buy Now (remove from saved + add to cart + go to cart page) */}
                            <button
                              onClick={() => {
                                // 1. Remove from saved
                                removeSavedCourse.mutate(course.id, {
                                  onSuccess: () => {
                                    // 2. Add to cart
                                    addToCart.mutate(course.id, {
                                      onSuccess: () => {
                                        toast.success(
                                          "Moved from saved → cart!"
                                        );
                                        navigate(
                                          "/StudentLayout/StuShoppingCart"
                                        );
                                      },
                                      onError: () =>
                                        toast.error("Failed to add to cart"),
                                    });
                                  },
                                });
                              }}
                              className="btn flex-1 py-3 font-semibold bg-primary text-white btn-hover"
                            >
                              Buy Now
                            </button>
                          </>
                        )}

                        {/* Normal Save Course + Buy Now (when NOT saved) */}
                        {!isSaved && (
                          <>
                            {/* Save Course Button */}
                            <button
                              onClick={() => {
                                if (!isSaved) {
                                  saveCourse.mutate(course.id, {
                                    onSuccess: () =>
                                      toast.success(
                                        "Course saved successfully!"
                                      ),
                                    onError: () =>
                                      toast.error("Failed to save course"),
                                  });
                                }
                              }}
                              disabled={isEnrolled}
                              className={`btn flex-1 py-3 font-semibold ${
                                isEnrolled
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "btn-primary btn-hover"
                              }`}
                            >
                              {isEnrolled ? "Enrolled" : "Save Course"}
                            </button>

                            {/* Buy Now */}
                            <button
                              onClick={() => {
                                addToCart.mutate(course.id, {
                                  onSuccess: () =>
                                    toast.success("Added to cart!"),
                                  onError: () =>
                                    toast.error("Failed to add to cart"),
                                });
                              }}
                              disabled={isEnrolled || isInCart}
                              className={`btn flex-1 py-3 font-semibold ${
                                isEnrolled || isInCart
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "btn-primary btn-hover"
                              }`}
                            >
                              {isInCart
                                ? "In Cart"
                                : isEnrolled
                                ? "Enrolled"
                                : "Buy Now"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="card border border-border">
              <div className="border-b border-border">
                <nav className="flex gap-8">
                  {[
                    { id: "about", label: "About Course", icon: "" },
                    { id: "content", label: "Course Content", icon: "" },
                    { id: "reviews", label: "Reviews", icon: "" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`pb-4 font-semibold transition-all duration-300 flex items-center gap-2 ${
                        currentTab === tab.id
                          ? "text-secondary border-b-2 border-secondary"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                      onClick={() => setCurrentTab(tab.id)}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {currentTab === "about" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-4">
                        Course Description
                      </h2>
                      <p className="text-text-secondary leading-relaxed text-lg">
                        {course.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          What You'll Learn
                        </h3>
                        <ul className="space-y-3">
                          {[
                            "Master key concepts and skills",
                            "Practical hands-on projects",
                            "Industry best practices",
                            "Real-world applications",
                            "Problem-solving techniques",
                          ].map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-text-secondary"
                            >
                              <svg
                                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                            />
                          </svg>
                          Requirements
                        </h3>
                        <ul className="space-y-3">
                          {[
                            "Basic computer knowledge",
                            "Internet connection",
                            "Willingness to learn",
                            "Dedication to complete the course",
                            "No prior experience required",
                          ].map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-text-secondary"
                            >
                              <svg
                                className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "content" && (
                  <div
                    className={
                      !isEnrolled ? "opacity-50 pointer-events-none" : ""
                    }
                  >
                    {/* Lessons Section */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-primary">
                          Course Lessons ({course.lessons?.length || 0})
                        </h2>
                        <span className="text-text-secondary">
                          Total duration: {course.hours || "N/A"} hours
                        </span>
                      </div>

                      {course.lessons && course.lessons.length > 0 ? (
                        <div className="space-y-4">
                          {course.lessons.map((lesson, index) => (
                            <div
                              key={index}
                              className={`card p-6 cursor-pointer border border-border transition-all duration-300 hover:shadow-lg ${
                                !isEnrolled ? "opacity-60" : "card-hover"
                              }`}
                              onClick={() => {
                                navigate(
                                  `/StudentLayout/StudentLessonPage/${course.id}/${lesson.lessonId}`
                                );
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <span className="text-primary font-bold text-lg">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-text-primary text-lg">
                                      {lesson.title || `Lesson ${index + 1}`}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-text-secondary text-sm flex items-center gap-1">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        {lesson.duration || "10:30"}
                                      </span>
                                      <span className="text-text-secondary text-sm">
                                        {lesson.type || "Video"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lesson.isFreePreview && (
                                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
                                      Free Preview
                                    </span>
                                  )}
                                  <svg
                                    className="w-5 h-5 text-text-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-text-secondary">
                          <svg
                            className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <p className="text-lg">
                            No lessons available for this course yet.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quizzes Section */}
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-6">
                        Course Quizzes ({course.quizzes?.length || 0})
                      </h2>
                      {course.quizzes && course.quizzes.length > 0 ? (
                        <div className="space-y-4">
                          {course.quizzes.map((quiz, index) => (
                            <div
                              key={index}
                              className="card p-6 cursor-pointer border border-border card-hover"
                              onClick={() => {
                                isSubmitted(quiz.id);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                                    <span className="text-secondary font-bold text-lg">
                                      Q{index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-text-primary text-lg">
                                      {quiz.title || `Quiz ${index + 1}`}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-text-secondary text-sm">
                                        {quiz.totalQuestions || 0} questions
                                      </span>
                                      <span className="text-text-secondary text-sm flex items-center gap-1">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        {quiz.duration || "15 mins"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-text-primary font-semibold">
                                    Total Score: {quiz.totalMarks || "--"}
                                  </span>
                                  <div className="text-sm text-text-secondary">
                                    Passing: {quiz.passingScore || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-text-secondary">
                          <svg
                            className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg">
                            No quizzes available for this course yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentTab === "reviews" && (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Reviews Coming Soon
                    </h3>
                    <p className="text-text-secondary">
                      Student reviews and ratings will be available here soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Course Info Card */}
            <div className="card border border-border p-6 sticky top-6">
              <h2 className="text-xl font-bold text-text-primary mb-6 pb-4 border-b border-border">
                Course Information
              </h2>
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-text-secondary text-lg">Price</span>
                  <span className="text-3xl font-bold text-primary">
                    ${course.price || "Free"}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary flex items-center gap-2">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Duration
                    </span>
                    <span className="font-semibold text-text-primary">
                      {course.hours || "N/A"} Hours
                    </span>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-text-secondary flex items-center gap-2">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Views
                    </span>
                    <span className="font-semibold text-text-primary">
                      {course.views || 0}
                    </span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary flex items-center gap-2">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Author
                    </span>
                    <span className="font-semibold text-text-primary">
                      {course.author || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary flex items-center gap-2">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Category
                    </span>
                    <span className="font-semibold text-text-primary">
                      {course.category || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary flex items-center gap-2">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Certificate
                    </span>
                    <span
                      className={`font-semibold ${
                        course.certificateIncluded
                          ? "text-green-600"
                          : "text-text-secondary"
                      }`}
                    >
                      {course.certificateIncluded ? "Included" : "Not Included"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="card border border-border p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6 pb-4 border-b border-border">
                Course Features
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-lg">📚</span>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {course.lessons?.length || 0} Lessons
                    </div>
                    <div className="text-sm text-text-secondary">
                      Comprehensive content
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-secondary/5 rounded-lg">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-secondary text-lg">📝</span>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {course.quizzes?.length || 0} Quizzes
                    </div>
                    <div className="text-sm text-text-secondary">
                      Test your knowledge
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-500/5 rounded-lg">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">🏆</span>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      Certificate
                    </div>
                    <div className="text-sm text-text-secondary">
                      Upon completion
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-blue-500/5 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🔄</span>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      Lifetime Access
                    </div>
                    <div className="text-sm text-text-secondary">
                      Learn at your pace
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            {/* <div className="card border border-border p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-lg font-bold text-text-primary mb-3">Need Help?</h3>
              <p className="text-text-secondary text-sm mb-4">
                Have questions about this course? Our support team is here to help you.
              </p>
              <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg btn-hover">
                Contact Support
              </button>
            </div> */}
          </aside>
        </div>
      </div>
    </div>
  );
}
