import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/app";
import toast, { Toaster } from "react-hot-toast";

class ProjectService {
  constructor() {
    this.storageKey = "projects";
  }

  async getProjectById(id) {
    try {
      const projects = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
      return projects.find(project => project.id === id) || null;
    } catch (error) {
      console.error("Error getting project:", error);
      return null;
    }
  }

  async addProject(projectData) {
    try {
      const projects = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      projects.push(newProject);
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return newProject;
    } catch (error) {
      console.error("Error adding project:", error);
      return null;
    }
  }

  async updateProject(id, projectData) {
    try {
      const projects = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
      const index = projects.findIndex(project => project.id === id);
      
      if (index === -1) return null;
      
      const updatedProject = {
        ...projects[index],
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      
      projects[index] = updatedProject;
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return updatedProject;
    } catch (error) {
      console.error("Error updating project:", error);
      return null;
    }
  }
}

function InstFinalProjects() {
  const projectService = new ProjectService();
  const { saveLoading, setSaveLoading } = useAppStore();
  const { projectid } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(projectid);

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    difficulty: "intermediate",
    estimatedTime: "",
    requirements: "",
    deliverables: "",
    resources: "",
    submissionDeadline: "",
    points: 100,
    isPublished: false,
  });

  useEffect(() => {
    if (!isEdit) return;
    loadProject();
  }, [projectid]);

  const loadProject = async () => {
    try {
      const project = await projectService.getProjectById(projectid);
      if (project) {
        setForm({
          ...project,
          requirements: Array.isArray(project.requirements) 
            ? project.requirements.join("\n") 
            : project.requirements || "",
          deliverables: Array.isArray(project.deliverables) 
            ? project.deliverables.join("\n") 
            : project.deliverables || "",
          resources: Array.isArray(project.resources) 
            ? project.resources.join("\n") 
            : project.resources || "",
        });
      }
    } catch {
      toast.error("Failed to load project");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);

      const submitForm = {
        title: form.title.trim(),
        description: form.description.trim(),
        courseId: form.courseId.trim(),
        difficulty: form.difficulty,
        estimatedTime: form.estimatedTime.trim(),
        requirements: form.requirements
          .split("\n")
          .filter(item => item.trim() !== "")
          .map(item => item.trim()),
        deliverables: form.deliverables
          .split("\n")
          .filter(item => item.trim() !== "")
          .map(item => item.trim()),
        resources: form.resources
          .split("\n")
          .filter(item => item.trim() !== "")
          .map(item => item.trim()),
        submissionDeadline: form.submissionDeadline,
        points: Number(form.points) || 0,
        isPublished: form.isPublished,
      };

      let result;
      if (isEdit) {
        result = await projectService.updateProject(projectid, submitForm);
      } else {
        result = await projectService.addProject(submitForm);
      }

      if (result) {
        toast.success(
          isEdit ? "Project updated successfully!" : "Project created successfully!"
        );
        if (!isEdit) {
          setForm({
            title: "",
            description: "",
            courseId: "",
            difficulty: "intermediate",
            estimatedTime: "",
            requirements: "",
            deliverables: "",
            resources: "",
            submissionDeadline: "",
            points: 100,
            isPublished: false,
          });
        } else {
          navigate("/InstructorLayout/MyProjects");
        }
      } else {
        toast.error("Failed to save project.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? "Edit Final Project" : "Create Final Project"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEdit 
                  ? "Update your project details below." 
                  : "Design a comprehensive final project for your students"
                }
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Back
            </button>
          </div>
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            
            {/* Section 1: Basic Information */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Information</h2>
              
              {/* Project Title */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="E-commerce Web Application"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Grid: Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Course ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    placeholder="CS101"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={form.estimatedTime}
                    onChange={handleChange}
                    placeholder="20-30 hours"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={form.points}
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Submission Deadline */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="max-w-xs">
                    <input
                      type="date"
                      name="submissionDeadline"
                      value={form.submissionDeadline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Requirements */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements & Deliverables</h2>
              
              <div className="space-y-8">
                {/* Requirements */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Requirements <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">One per line</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    List all requirements that students must fulfill
                  </p>
                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    placeholder={`1. Implement user authentication\n2. Create product catalog\n3. Add shopping cart functionality\n4. Implement payment gateway\n5. Add admin dashboard`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 h-48 font-mono text-sm resize-none"
                    required
                  />
                </div>

                {/* Deliverables */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expected Deliverables <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">One per line</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    What students need to submit for evaluation
                  </p>
                  <textarea
                    name="deliverables"
                    value={form.deliverables}
                    onChange={handleChange}
                    placeholder={`1. Source code repository (GitHub/GitLab)\n2. Live demo URL\n3. Project documentation\n4. Presentation slides\n5. Video demonstration (optional)`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 h-48 font-mono text-sm resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Resources & Description */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resources & Description</h2>
              
              <div className="space-y-8">
                {/* Resources */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Learning Resources
                    </label>
                    <span className="text-xs text-gray-500">One per line</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Provide helpful resources, documentation, and references
                  </p>
                  <textarea
                    name="resources"
                    value={form.resources}
                    onChange={handleChange}
                    placeholder={`https://developer.mozilla.org/\nhttps://reactjs.org/docs/\nDatabase Design Fundamentals\nAPI Integration Guide\nUI/UX Best Practices`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 h-40 font-mono text-sm resize-none"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Describe the project objectives, learning outcomes, and evaluation criteria
                  </p>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder={`In this final project, students will build a complete e-commerce web application from scratch. The project aims to demonstrate proficiency in full-stack development, database design, and API integration.\n\nLearning Objectives:\n- Implement user authentication and authorization\n- Design and develop a product catalog system\n- Create a shopping cart with real-time updates\n- Integrate payment gateway for transactions\n- Build an admin dashboard for product management\n\nEvaluation will be based on functionality, code quality, UI/UX design, and documentation.`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 h-64 resize-none leading-relaxed"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Publish Settings */}
            <div className="p-8 bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Publish project immediately
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Students will be able to see and access this project in their dashboard. 
                    You can always unpublish it later.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Actions */}
            <div className="p-8 bg-white">
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                    saveLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {saveLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isEdit ? "Update Project" : "Create Project"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  );
}

export default InstFinalProjects;