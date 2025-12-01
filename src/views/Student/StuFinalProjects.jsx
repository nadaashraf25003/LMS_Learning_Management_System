import useCourse from "@/hooks/useCourse";
import useStudent from "@/hooks/useStudent";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import useFinalProject from "@/hooks/useFinalProject"; // Assuming a custom hook for final projects

export default function StuFinalProject() {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");

  const { CourseById } = useCourse(id);
  const { data: course, isLoading: courseLoading } = CourseById;

  const {
    getStudentProject,
    submitProjectMutation,
    myEnrollments,
  } = useStudent();

  const { getProjectGuidelines } = useFinalProject(id);
  const { data: projectData } = getStudentProject(id);
  const { data: guidelinesData } = getProjectGuidelines(id);

  const isEnrolled = myEnrollments.data?.some((c) => c.id === course?.id);
  const project = projectData?.project || {};
  const isSubmitted = project.status === "submitted";
  const guidelines = guidelinesData?.guidelines || {};

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card p-8 text-center max-w-md">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-text-primary">
            Loading final project...
          </h3>
        </div>
      </div>
    );
  }

  if (!course || !isEnrolled) {
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
            Access Denied
          </h2>
          <p className="text-text-secondary">
            You must be enrolled in this course to access the final project.
          </p>
          <button
            onClick={() => navigate(`/StudentLayout/StuCourseDetails/${id}`)}
            className="mt-4 btn btn-primary"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitProject = () => {
    if (!project.files || project.files.length === 0) {
      toast.error("Please upload your project files before submitting.");
      return;
    }
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to submit your final project? This action cannot be undone."
        onConfirm={() => {
          submitProjectMutation.mutate(
            { courseId: id, ...project },
            {
              onSuccess: () => {
                toast.success("Project submitted successfully! 🎉");
                navigate(`/StudentLayout/StuCourseDetails/${id}`);
              },
              onError: () => toast.error("Failed to submit project."),
            }
          );
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  const handleViewSubmission = () => {
    if (isSubmitted) {
      navigate(`/StudentLayout/ProjectSubmission/${project.id}`);
    }
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
            {/* Project Header Card */}
            <div className="card border border-border p-8 card-hover">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative">
                  <img
                    src={
                      guidelines.image ||
                      "https://via.placeholder.com/300x200?text=Final+Project"
                    }
                    alt="Final Project"
                    className="w-full md:w-80 h-48 object-cover rounded-xl shadow-lg"
                  />
                  {isSubmitted && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                      Submitted
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                        {guidelines.title || "Final Project"}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          📁 {project.files?.length || 0} Files
                        </span>
                        {project.grade && (
                          <span className="text-green-600 text-sm font-semibold">
                            Grade: {project.grade}/100
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Info */}
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${isSubmitted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className={`font-semibold ${isSubmitted ? 'text-green-600' : 'text-yellow-600'}`}>
                          {isSubmitted ? 'Submitted' : 'Draft'}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {isSubmitted ? `Submitted on ${project.submissionDate}` : 'Ready to submit'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {!isSubmitted ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => navigate(`/StudentLayout/ProjectSubmission/${id}`)}
                          className="btn flex-1 py-4 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-2 btn-hover"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Edit Submission
                        </button>
                        <button
                          onClick={handleSubmitProject}
                          className="btn flex-1 py-4 bg-green-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 btn-hover"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Submit Project
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleViewSubmission}
                        className="w-full py-4 bg-secondary text-white font-bold rounded-lg flex items-center justify-center gap-2 btn-hover"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        View Submission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="card border border-border">
              <div className="border-b border-border">
                <nav className="flex gap-8">
                  {[
                    { id: "overview", label: "Overview", icon: "📋" },
                    { id: "guidelines", label: "Guidelines", icon: "📄" },
                    { id: "rubric", label: "Rubric", icon: "📊" },
                    { id: "resources", label: "Resources", icon: "🔗" },
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
                {currentTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-4">
                        Project Overview
                      </h2>
                      <p className="text-text-secondary leading-relaxed text-lg">
                        {guidelines.description || "Create a comprehensive final project demonstrating your mastery of the course material. Include code, documentation, and a presentation."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Requirements
                        </h3>
                        <ul className="space-y-3">
                          {[
                            "Original work demonstrating course concepts",
                            "Include source code and documentation",
                            "Presentation or demo video (optional)",
                            "Submit by due date: {guidelines.dueDate || 'End of semester'}",
                          ].map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-text-secondary">
                              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                          </svg>
                          Submission Format
                        </h3>
                        <ul className="space-y-3">
                          {[
                            "ZIP file containing all files",
                            "PDF report (max 10 pages)",
                            "Code repository link (GitHub)",
                            "Video demo (under 5 minutes)",
                          ].map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-text-secondary">
                              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "guidelines" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                      Detailed Guidelines
                    </h2>
                    <div className="prose text-text-secondary max-w-none">
                      <div className="whitespace-pre-wrap bg-muted p-6 rounded-lg border border-border">
                        {guidelines.fullGuidelines || "Follow the project rubric and ensure your submission addresses all required components. Consult the course syllabus for additional details."}
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "rubric" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                      Grading Rubric
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-2">Criteria</h3>
                        <ul className="space-y-2 text-text-secondary">
                          <li>• Functionality (30%)</li>
                          <li>• Code Quality (25%)</li>
                          <li>• Documentation (20%)</li>
                          <li>• Creativity (15%)</li>
                          <li>• Presentation (10%)</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-2">Scoring</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>A: 90-100</span>
                            <span>Excellent</span>
                          </div>
                          <div className="flex justify-between">
                            <span>B: 80-89</span>
                            <span>Good</span>
                          </div>
                          <div className="flex justify-between">
                            <span>C: 70-79</span>
                            <span>Satisfactory</span>
                          </div>
                          <div className="flex justify-between">
                            <span>D: 60-69</span>
                            <span>Needs Improvement</span>
                          </div>
                          <div className="flex justify-between">
                            <span>F: Below 60</span>
                            <span>Unsatisfactory</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "resources" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                      Helpful Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-text-primary">Tutorials</h3>
                        <ul className="space-y-2 text-text-secondary">
                          <li>• GitHub Project Setup Guide</li>
                          <li>• Documentation Best Practices</li>
                          <li>• Video Editing Tools</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-text-primary">Tools</h3>
                        <ul className="space-y-2 text-text-secondary">
                          <li>• VS Code (Recommended Editor)</li>
                          <li>• Git for Version Control</li>
                          <li>• OBS Studio for Recordings</li>
                        </ul>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open("https://example.com/resources", "_blank")}
                      className="btn btn-secondary"
                    >
                      More Resources
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Project Status Card */}
            <div className="card border border-border p-6 sticky top-6">
              <h2 className="text-xl font-bold text-text-primary mb-6 pb-4 border-b border-border">
                Project Status
              </h2>
              <div className="space-y-5">
                <div className={`flex justify-between items-center p-3 rounded-lg ${isSubmitted ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <span className="text-text-secondary">Status</span>
                  <span className={`font-semibold ${isSubmitted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {isSubmitted ? 'Submitted' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-text-secondary">Due Date</span>
                  <span className="font-semibold text-text-primary">
                    {guidelines.dueDate || 'End of Semester'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Max Grade</span>
                  <span className="font-semibold text-text-primary">100 Points</span>
                </div>
                {project.grade && (
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-text-secondary">Your Grade</span>
                    <span className="text-2xl font-bold text-green-600">{project.grade}/100</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card border border-border p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6 pb-4 border-b border-border">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {!isSubmitted ? (
                  <>
                    <button
                      onClick={() => navigate(`/StudentLayout/ProjectSubmission/${id}`)}
                      className="w-full btn btn-primary btn-hover"
                    >
                      Edit & Upload Files
                    </button>
                    <button
                      onClick={handleSubmitProject}
                      className="w-full btn bg-green-500 text-white btn-hover"
                    >
                      Submit Project
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleViewSubmission}
                    className="w-full btn btn-secondary btn-hover"
                  >
                    View My Submission
                  </button>
                )}
                <button
                  onClick={() => navigate(`/StudentLayout/StuCourseDetails/${id}`)}
                  className="w-full btn bg-transparent border border-input text-text-primary btn-hover"
                >
                  Back to Course
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}