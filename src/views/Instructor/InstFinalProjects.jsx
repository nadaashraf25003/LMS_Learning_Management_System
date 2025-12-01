import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useFinalProjects from "@/hooks/useFinalProjects"; // Assuming a custom hook similar to useLesson
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";

export default function InstructorFinalProjects() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  const [search, setSearch] = useState("");

  const { getProjects, gradeProjectMutation, deleteProjectMutation } = useFinalProjects();
  const { data: projectsData, isLoading } = getProjects();

  const projects = projectsData?.projects || [];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.studentName?.toLowerCase().includes(q) ||
          project.title?.toLowerCase().includes(q) ||
          project.description?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [projects, search]);

  const totalProjects = useMemo(() => projects.length, [projects]);
  const pendingProjects = useMemo(() => projects.filter((p) => p.status === "pending").length, [projects]);
  const gradedProjects = useMemo(() => projects.filter((p) => p.status === "graded").length, [projects]);
  const averageGrade = useMemo(() => {
    const graded = projects.filter((p) => p.grade !== null && p.grade > 0);
    return graded.length > 0 ? (graded.reduce((sum, p) => sum + p.grade, 0) / graded.length).toFixed(1) : 0;
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card prose">Loading final projects...</div>
      </div>
    );
  }

  const handleGradeProject = (projectId) => {
    // Navigate to grading page or open modal; here assuming navigation
    navigate(`/InstructorLayout/GradeProject/${projectId}`);
  };

  const handleDeleteProject = (projectId) => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to delete this project submission? This action cannot be undone."
        onConfirm={async () => {
          try {
            await deleteProjectMutation.mutateAsync(projectId);
            toast.success("Project deleted successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete project.");
          }
          toast.dismiss(t.id);
        }}
        onCancel={() => {
          toast.dismiss(t.id);
        }}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "graded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster position="top-center" />
      <div className="custom-container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Final Projects Management</h1>
          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-primary btn-hover"
              onClick={() => navigate("/InstructorLayout/CreateProjectGuidelines")}
            >
              Set Guidelines
            </button>
            <button
              className="btn btn-secondary btn-hover"
              onClick={() => {/* Export logic */ toast.success("Exporting projects...")}}
            >
              Export All
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Total Submissions</h3>
            <p className="text-3xl font-bold text-secondary mt-2">{totalProjects}</p>
          </div>
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Pending Review</h3>
            <p className="text-3xl font-bold text-primary mt-2">{pendingProjects}</p>
          </div>
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Graded</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{gradedProjects}</p>
          </div>
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Avg Grade</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{averageGrade}/100</p>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4 border border-border">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, project title..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text-primary"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card space-y-4 border border-border">
          <div className="flex gap-6 border-b border-border pb-3">
            <button
              className={`pb-2 font-semibold transition-colors duration-200 ${
                currentTab === "overview"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("overview")}
            >
              Overview
            </button>
            <button
              className={`pb-2 font-semibold transition-colors duration-200 ${
                currentTab === "pending"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("pending")}
            >
              Pending Review ({pendingProjects})
            </button>
            <button
              className={`pb-2 font-semibold transition-colors duration-200 ${
                currentTab === "graded"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("graded")}
            >
              Graded ({gradedProjects})
            </button>
          </div>

          {currentTab === "overview" && (
            <div className="prose mt-4 text-text-secondary">
              <p className="text-lg font-medium text-text-primary mb-4">Projects Summary</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Status Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span className="text-primary">{pendingProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Graded</span>
                      <span className="text-green-600">{gradedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejected</span>
                      <span className="text-red-600">{projects.filter((p) => p.status === "rejected").length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Grade Distribution</h4>
                  <p className="text-sm">Average: {averageGrade}/100</p>
                  {/* Placeholder for chart */}
                  <div className="h-32 bg-muted rounded-lg mt-2 flex items-center justify-center">
                    <span className="text-text-secondary">Grade Chart Placeholder</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(currentTab === "pending" || currentTab === "graded") && (
            <div className="space-y-3 mt-4">
              {filteredProjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Project Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Submission Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border dark:bg-card">
                      {filteredProjects
                        .filter((p) => currentTab === "pending" ? p.status === "pending" : p.status === "graded")
                        .map((project, index) => (
                          <tr key={project.id || index} className="hover:bg-muted">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                              {project.studentName || "Anonymous"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                              {project.title || "Untitled Project"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                              {formatDate(project.submissionDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                              {project.grade ? `${project.grade}/100` : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  className="text-primary hover:text-secondary"
                                  onClick={() => navigate(`/InstructorLayout/ViewProject/${project.id}`)}
                                >
                                  View
                                </button>
                                {project.status === "pending" && (
                                  <button
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => handleGradeProject(project.id)}
                                  >
                                    Grade
                                  </button>
                                )}
                                <button
                                  className="text-destructive hover:text-red-800"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">No {currentTab} projects found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 space-y-4 border border-border lg:col-span-2">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Project Guidelines</h2>
            <div className="prose text-text-secondary">
              <p className="whitespace-pre-wrap bg-muted p-4 rounded-lg border border-border">
                Final projects should demonstrate mastery of course concepts. Submissions due by end of semester. Include code, report, and presentation.
              </p>
              <button
                className="btn btn-primary btn-hover mt-4"
                onClick={() => navigate("/InstructorLayout/EditGuidelines")}
              >
                Edit Guidelines
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 space-y-4 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                className="w-full btn btn-primary btn-hover"
                onClick={() => navigate("/InstructorLayout/BulkGrade")}
              >
                Bulk Grade
              </button>
              <button
                className="w-full btn btn-secondary btn-hover"
                onClick={() => {/* Export */ toast.success("Exporting...")}}
              >
                Export Grades
              </button>
              <button
                className="w-full btn bg-transparent border border-input text-text-primary btn-hover"
                onClick={() => navigate("/InstructorLayout/ProjectRubric")}
              >
                View Rubric
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}