import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

// Mock router hooks
const useParams = () => {
  // Return a mock course ID that exists in our data
  return { id: "course-1" };
};

const useNavigate = () => {
  return (path) => {
    console.log("Navigating to:", path);
    // In a real app, this would change the route
    toast.success(`Navigating to ${path}`);
  };
};

// Mock Course Data
const MOCK_COURSES = {
  "course-1": {
    id: "course-1",
    title: "Advanced Web Development",
    instructor: "John Doe",
    description: "Learn full-stack web development with modern frameworks and best practices.",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "12 weeks",
    level: "Intermediate",
    enrolled: true
  }
};

// Mock useCourse hook
const useMockCourse = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      const course = MOCK_COURSES[id];
      if (course) {
        setData(course);
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);

  return { data, isLoading };
};

// Mock useStudent hook
const useMockStudent = () => {
  const [state] = useState({
    myEnrollments: [
      { id: "course-1", title: "Advanced Web Development", status: "active" }
    ],
    studentProject: {
      project: {
        id: "project-123",
        status: "draft",
        files: [
          { id: "file-1", name: "main.js", size: "2.4 KB", type: "javascript" },
          { id: "file-2", name: "report.pdf", size: "1.2 MB", type: "pdf" },
          { id: "file-3", name: "presentation.pptx", size: "4.5 MB", type: "presentation" }
        ],
        grade: null,
        submittedAt: null,
        updatedAt: "2024-12-10T10:30:00Z"
      }
    },
    isLoading: false
  });

  const submitProject = {
    mutate: async (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Project submitted:", data);
          resolve({ success: true });
        }, 1000);
      });
    }
  };

  return { 
    ...state, 
    submitProject
  };
};

// Confirm Toast Component
const ConfirmToast = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Submission</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{message}</p>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component - COMPLETELY STANDALONE
export default function StuFinalProject() {
  const { id } = useParams(); // This will always return "course-1"
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  
  // Use mock hooks
  const { data: course, isLoading: courseLoading } = useMockCourse(id);
  const studentHooks = useMockStudent();
  
  // Extract data
  const project = studentHooks.studentProject?.project || {
    id: null,
    status: "draft",
    files: [],
    grade: null,
    submittedAt: null,
    updatedAt: null
  };
  
  const myEnrollments = studentHooks.myEnrollments || [];
  const submitProjectMutation = studentHooks.submitProject;
  const projectLoading = studentHooks.isLoading;

  // Project guidelines
  const guidelines = {
    title: "Final Project: Full-Stack E-Commerce Platform",
    description: "Build a complete, production-ready e-commerce web application from scratch.",
    dueDate: "December 31, 2024",
    fullGuidelines: "Create a modern e-commerce platform with user authentication, product management, shopping cart, and payment processing.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    maxPoints: 100
  };

  // State
  const isLoading = courseLoading || projectLoading;
  const isEnrolled = myEnrollments.some(c => c.id === course?.id) || true; // Always true for this demo
  const isSubmitted = project.status === "submitted";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Event handlers
  const handleSubmitProject = () => {
    if (!project.files || project.files.length === 0) {
      toast.error("Please upload your project files before submitting.");
      return;
    }
    
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to submit your final project?"
        onConfirm={() => {
          submitProjectMutation.mutate({ 
            courseId: id, 
            projectId: project.id,
            submission: project 
          }).then(() => {
            toast.success("🎉 Project submitted successfully!");
          }).catch(() => {
            toast.error("Failed to submit project.");
          });
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  const handleEditSubmission = () => {
    toast.success("Opening submission editor...");
  };

  const handleViewSubmission = () => {
    toast.success("Viewing submission...");
  };

  // THE ACTUAL UI - This will show instead of "Course Not Found"
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
          style: {
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
          },
        }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Final Project
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Course: <span className="font-semibold text-gray-800 dark:text-gray-200">{course?.title || "Advanced Web Development"}</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Project Image */}
                <div className="md:w-80">
                  <img
                    src={guidelines.image}
                    alt="Final Project"
                    className="w-full h-56 object-cover rounded-lg shadow-lg"
                  />
                </div>

                {/* Project Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {guidelines.title}
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Status */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                      isSubmitted 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${isSubmitted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="font-medium">
                        {isSubmitted ? 'Submitted' : 'In Progress'}
                      </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{project.files?.length || 0} files uploaded</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Due: {guidelines.dueDate}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {!isSubmitted ? (
                        <>
                          <button
                            onClick={handleEditSubmission}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {project.id ? "Edit Submission" : "Start Project"}
                          </button>
                          <button
                            onClick={handleSubmitProject}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Project
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleViewSubmission}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Submission
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  {[
                    { id: "overview", label: "Overview", icon: "📋" },
                    { id: "guidelines", label: "Guidelines", icon: "📄" },
                    { id: "rubric", label: "Rubric", icon: "📊" },
                    { id: "resources", label: "Resources", icon: "🔗" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                        currentTab === tab.id
                          ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {currentTab === "overview" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Build a complete e-commerce platform to demonstrate your full-stack development skills.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>User authentication system</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Product catalog with search</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Shopping cart functionality</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Payment processing</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Admin dashboard</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Deliverables</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Source code repository</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Live deployment</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Documentation</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Video demonstration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Presentation</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "guidelines" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Guidelines</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300">{guidelines.fullGuidelines}</p>
                    </div>
                  </div>
                )}

                {currentTab === "rubric" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Grading Rubric</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Criteria</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>Functionality</span>
                            <span className="font-semibold">30%</span>
                          </div>
                          <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>Code Quality</span>
                            <span className="font-semibold">25%</span>
                          </div>
                          <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>Documentation</span>
                            <span className="font-semibold">20%</span>
                          </div>
                          <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>Creativity</span>
                            <span className="font-semibold">15%</span>
                          </div>
                          <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>Presentation</span>
                            <span className="font-semibold">10%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Grading Scale</h4>
                        <div className="space-y-2">
                          <div className="text-gray-700 dark:text-gray-300 flex justify-between">
                            <span>A: 90-100</span>
                            <span className="text-green-600 dark:text-green-400">Excellent</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 flex justify-between">
                            <span>B: 80-89</span>
                            <span className="text-blue-600 dark:text-blue-400">Good</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 flex justify-between">
                            <span>C: 70-79</span>
                            <span className="text-yellow-600 dark:text-yellow-400">Satisfactory</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 flex justify-between">
                            <span>D: 60-69</span>
                            <span className="text-orange-600 dark:text-orange-400">Needs Improvement</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 flex justify-between">
                            <span>F: Below 60</span>
                            <span className="text-red-600 dark:text-red-400">Unsatisfactory</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "resources" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resources</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Documentation</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>React Documentation</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Node.js Guides</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>MongoDB Tutorials</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tools</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>VS Code</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Git</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Postman</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Need additional resources? Check out the course materials section for more learning resources.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Status</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`font-semibold ${isSubmitted ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {isSubmitted ? 'Submitted' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Due Date</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">{guidelines.dueDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Max Points</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">{guidelines.maxPoints}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Files Uploaded</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{project.files?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {!isSubmitted ? (
                  <>
                    <button
                      onClick={handleEditSubmission}
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                    >
                      {project.id ? "Edit Submission" : "Start Project"}
                    </button>
                    <button
                      onClick={handleSubmitProject}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                    >
                      Submit Project
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleViewSubmission}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                  >
                    View Submission
                  </button>
                )}
                <button
                  onClick={() => navigate(`/StudentLayout/StuCourseDetails/${id}`)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Course
                </button>
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Uploaded Files</h3>
              {project.files && project.files.length > 0 ? (
                <div className="space-y-3">
                  {project.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${
                          file.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' :
                          file.type === 'javascript' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            file.type === 'pdf' ? 'text-red-600 dark:text-red-400' :
                            file.type === 'javascript' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{file.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{file.size}</div>
                        </div>
                      </div>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No files uploaded yet</p>
                  <button
                    onClick={handleEditSubmission}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    Upload Files →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}