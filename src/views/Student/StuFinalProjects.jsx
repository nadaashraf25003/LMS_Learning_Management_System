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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading project details...</p>
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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Final Project
          </h1>
          <p className="text-gray-600 mt-2">
            Course: <span className="font-semibold text-gray-800">{course?.title || "Advanced Web Development"}</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Project Image */}
                <div className="md:w-80">
                  <img
                    src={guidelines.image}
                    alt="Final Project"
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>

                {/* Project Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {guidelines.title}
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Status */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${isSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${isSubmitted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="font-medium">
                        {isSubmitted ? 'Submitted' : 'In Progress'}
                      </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-700">{project.files?.length || 0} files uploaded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">Due: {guidelines.dueDate}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {!isSubmitted ? (
                        <>
                          <button
                            onClick={handleEditSubmission}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {project.id ? "Edit Submission" : "Start Project"}
                          </button>
                          <button
                            onClick={handleSubmitProject}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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
                          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
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
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 ${
                        currentTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
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
                    <h3 className="text-xl font-bold text-gray-900">Project Overview</h3>
                    <p className="text-gray-700">
                      Build a complete e-commerce platform to demonstrate your full-stack development skills.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>• User authentication system</li>
                          <li>• Product catalog with search</li>
                          <li>• Shopping cart functionality</li>
                          <li>• Payment processing</li>
                          <li>• Admin dashboard</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Deliverables</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Source code repository</li>
                          <li>• Live deployment</li>
                          <li>• Documentation</li>
                          <li>• Video demonstration</li>
                          <li>• Presentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "guidelines" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Detailed Guidelines</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-700">{guidelines.fullGuidelines}</p>
                    </div>
                  </div>
                )}

                {currentTab === "rubric" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Grading Rubric</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Criteria</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Functionality</span>
                            <span className="font-semibold">30%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Code Quality</span>
                            <span className="font-semibold">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Documentation</span>
                            <span className="font-semibold">20%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Grading Scale</h4>
                        <div className="space-y-2 text-gray-600">
                          <div>A: 90-100 (Excellent)</div>
                          <div>B: 80-89 (Good)</div>
                          <div>C: 70-79 (Satisfactory)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "resources" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Resources</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>• React Documentation</li>
                          <li>• Node.js Guides</li>
                          <li>• MongoDB Tutorials</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>• VS Code</li>
                          <li>• Git</li>
                          <li>• Postman</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Project Status</h3>
              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${isSubmitted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {isSubmitted ? 'Submitted' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-semibold">{guidelines.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Points</span>
                  <span className="font-semibold">{guidelines.maxPoints}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {!isSubmitted ? (
                  <>
                    <button
                      onClick={handleEditSubmission}
                      className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                    >
                      {project.id ? "Edit Submission" : "Start Project"}
                    </button>
                    <button
                      onClick={handleSubmitProject}
                      className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                    >
                      Submit Project
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleViewSubmission}
                    className="w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                  >
                    View Submission
                  </button>
                )}
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Uploaded Files</h3>
              {project.files && project.files.length > 0 ? (
                <div className="space-y-3">
                  {project.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">{file.size}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No files uploaded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}