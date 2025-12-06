import useCourse from "@/hooks/useCourse";
import useStudent from "@/hooks/useStudent";
import React, { useState } from "react";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import DefaultImage from "../../../../public/images/default-avatar.png";
export default function CourseDetails() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("about");

  const { CourseById } = useCourse(id);
  const { data: course, isLoading } = CourseById;
  // console.log(course)
  const {
    saveCourse,
    savedCourses,
    myEnrollments,
    cart,
    addToCart,
    removeSavedCourse,
  } = useStudent();

  const isSaved = savedCourses.data?.some((c) => c.id === course?.id);
  const isEnrolled = myEnrollments.data?.some((c) => c.id === course?.id);
  const isInCart = cart.data?.some((c) => c.id === course?.id);
  // console.log(isInCart)
  // const imageUrl = course.image
  //   ? `${import.meta.env.VITE_BASE_URL}${course.image}` // V  ite
  //   : DefaultImage;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card prose">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card prose">No course found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="custom-container py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header Card */}
            <div className="card border border-border p-6 card-hover">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                 src={course.image ? course.image : DefaultImage}
                  alt={course.title}
                  className="w-full md:w-64 h-48 object-cover rounded-lg shadow-md"
                />

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                      {course.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        ⭐ {course.rating ?? "No ratings"}
                      </span>
                      <span className="text-text-secondary text-sm">
                        {course.studentsEnrolled} students enrolled
                      </span>
                      <span className="text-text-secondary text-sm">
                        Posted {course.posted}
                      </span>
                    </div>

                    {/* <p className="text-text-secondary line-clamp-2">
                      {course.description || "No description provided."}
                    </p> */}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {/* Save Course Button */}
                    <button
                      onClick={() => {
                        if (!isSaved) {
                          saveCourse.mutate(course.id, {
                            onSuccess: () =>
                              toast.success("Course saved successfully!"),
                            onError: () => toast.error("Failed to save course"),
                          });
                        }
                      }}
                      disabled={isSaved}
                      className={`btn flex-1 py-3 font-semibold ${
                        isSaved || isEnrolled
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "btn-primary btn-hover"
                      }`}
                    >
                      {isEnrolled
                        ? "Enrolled"
                        : isSaved
                        ? "Saved"
                        : "Save course"}
                    </button>

                    {/* Buy Now / Enroll Button */}
                    <button
                      className="btn bg-transparent border border-input text-text-primary btn-hover flex-1 py-3 font-semibold"
                      onClick={() => {
                        if (isEnrolled) {
                          toast.error(
                            "You are already enrolled in this course"
                          );
                          return;
                        }

                        if (isInCart) {
                          toast.error("This course is already in your cart");
                          return;
                        }

                        addToCart.mutate(course.id, {
                          onSuccess: () => {
                            toast.success("Added to cart!");

                            // 🔥 Auto-remove from saved when added to cart
                            if (isSaved) {
                              removeSavedCourse.mutate(course.id);
                            }
                          },
                          onError: () => toast.error("Failed to add to cart"),
                        });
                      }}
                      disabled={isEnrolled || isInCart}
                      className={`btn flex-1 py-3 font-semibold ${
                        isEnrolled || isInCart
                          ? "bg-gray-400 cursor-not-allowed"
                          : "btn-primary btn-hover"
                      }`}
                    >
                      {isEnrolled
                        ? "Enrolled"
                        : isInCart
                        ? "In Cart"
                        : "Buy Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="card border border-border">
              <div className="border-b border-border">
                <div className="flex gap-8">
                  <button
                    className={`pb-4 font-semibold transition-colors duration-200 ${
                      currentTab === "about"
                        ? "text-secondary border-b-2 border-secondary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                    onClick={() => setCurrentTab("about")}
                  >
                    About Course
                  </button>
                  <button
                    className={`pb-4 font-semibold transition-colors duration-200 ${
                      currentTab === "content"
                        ? "text-secondary border-b-2 border-secondary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                    onClick={() => setCurrentTab("content")}
                  >
                    Course Content
                  </button>
                </div>
              </div>

              <div className="p-6">
                {currentTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary mb-3">
                        Course Description
                      </h2>
                      <p className="text-text-secondary leading-relaxed">
                        {course.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          What You'll Learn
                        </h3>
                        <ul className="space-y-2 text-text-secondary">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span>
                            Master key concepts and skills
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span>
                            Practical hands-on projects
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span>
                            Industry best practices
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          Requirements
                        </h3>
                        <ul className="space-y-2 text-text-secondary">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Basic computer knowledge
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Internet connection
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Willingness to learn
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "content" && (
                  <div className="space-y-6">
                    {/* Lessons Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Course Lessons ({course.lessons?.length || 0})
                      </h2>

                      {course.lessons && course.lessons.length > 0 ? (
                        <div className="space-y-3">
                          {course.lessons.map((lesson, index) => (
                            <div
                              key={index}
                              className="card p-4 border border-border rounded-lg bg-[var(--color-surface)]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-primary font-semibold text-sm">
                                    {index + 1}
                                  </span>
                                </div>

                                <div>
                                  <h4 className="font-medium text-text-primary">
                                    {lesson.title || `Lesson ${index + 1}`}
                                  </h4>

                                  <p className="text-text-secondary text-sm">
                                    {lesson.duration || "0 min"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-text-secondary">
                          No lessons available for this course.
                        </div>
                      )}
                    </div>

                    {/* Quizzes Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Course Quizzes ({course.quizzes?.length || 0})
                      </h2>
                      {course.quizzes && course.quizzes.length > 0 ? (
                        <div className="space-y-3">
                          {course.quizzes.map((quiz, index) => (
                            <div
                              key={index}
                              className="card p-4 cursor-pointer hover:bg-muted card-hover border border-border"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <span className="text-secondary font-semibold text-sm">
                                      Q{index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-text-primary">
                                      {quiz.title || `Quiz ${index + 1}`}
                                    </h4>
                                    <p className="text-text-secondary text-sm">
                                      {quiz.questions?.length || 0} questions •{" "}
                                      {quiz.duration || "15 mins"}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-text-secondary text-sm">
                                  Score: {quiz.passingScore || "70%"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-text-secondary">
                          No quizzes available for this course.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Course Info Card */}
            <div className="card border border-border p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Course Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-text-secondary">Price</span>
                  <span className="text-2xl font-bold text-primary">
                    ${course.price || "Free"}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-medium text-text-primary">
                      {course.hours} Hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Students</span>
                    <span className="font-medium text-text-primary">
                      {course.studentsEnrolled}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Views</span>
                    <span className="font-medium text-text-primary">
                      {course.views}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Author</span>
                    <span className="font-medium text-text-primary">
                      {course.author}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Category</span>
                    <span className="font-medium text-text-primary">
                      {course.category || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Certificate</span>
                    <span
                      className={`font-medium ${
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
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Course Features
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary">📚</span>
                  </div>
                  <span className="text-text-primary">
                    {course.lessons?.length || 0} Lessons
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-secondary">📝</span>
                  </div>
                  <span className="text-text-primary">
                    {course.quizzes?.length || 0} Quizzes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🏆</span>
                  </div>
                  <span className="text-text-primary">
                    Certificate of Completion
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🔄</span>
                  </div>
                  <span className="text-text-primary">Lifetime Access</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
