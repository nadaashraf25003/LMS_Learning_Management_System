import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaBook,
  FaCheckCircle,
  FaClipboardList,
  FaCertificate,
  FaCalendarAlt,
  FaProjectDiagram,
  FaBell,
  FaChevronRight,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";

// Components
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import useAuth from "@/store/useAuth";
import useDashboard from "@/hooks/useDashboard";
import FullSpinner from "@/components/ui/Full Spinner/FullSpinner";

function Dashboard({ role }) {
  const { user } = useAuth();
  const { dashboard } = useDashboard();
  const { data, isLoading } = dashboard;
  const navigate = useNavigate();

  const [modalData, setModalData] = useState(null); // State for modal
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (note) => {
    setModalData(note);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  if (isLoading) {
    return <FullSpinner />;
  }

  // Normalize stats
  let stats = {};
  let liveSessions = [];
  let finalProjects = [];
  let notifications = [];

  if (data) {
    switch (role) {
      case "student":
        stats = {
          totalCourses: data.totalCourses,
          completedCourses: data.completedCourses,
          quizzesPassed: {
            passed: data.quizzesPassed,
            total: data.quizzesTotal,
            successRate: data.successRate,
          },
          certificatesEarned: data.certificatesEarned,
        };
        liveSessions = data.liveSessions || [];
        finalProjects = data.finalProjects || [];
        notifications = data.notifications?.$values || [];
        break;

      case "instructor":
        stats = {
          totalStudents: data.totalStudents,
          coursesCreated: data.coursesCreated,
          projectsSupervised: data.projectsSupervised,
          certificatesIssued: data.certificatesIssued,
        };
        notifications = data.notifications?.$values || [];
        break;

      case "admin":
        stats = {
          totalStudents: data.totalStudents,
          totalInstructors: data.totalInstructors,
          totalCourses: data.totalCourses,
          certificatesIssued: data.certificatesIssued,
        };
        notifications = data.notifications?.$values || [];
        break;

      default:
        break;
    }
  }

  const fullName = data?.fullName || "User";

  const handleViewAll = (section) => {
    switch (section) {
      case "courses":
        navigate("/StudentLayout/MyCourses");
        break;
      case "certificates":
        navigate("/StudentLayout/StuMyCertificates");
        break;
      case "Students":
        navigate("/InstructorLayout/AllStudents");
        break;
      case "Courses":
        navigate("/InstructorLayout/MyCourses");
        break;
      case "Adminstudents":
      case "Admininstructors":
        navigate("/AdminLayout/UserManagement");
        break;
      case "Admincourses":
        navigate("/AdminLayout/CourseManagement");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <LandingHeading
              header={`${
                role.charAt(0).toUpperCase() + role.slice(1)
              } Dashboard`}
              className="text-2xl sm:text-3xl lg:text-4xl"
            />
            <p className="text-text-secondary mt-2 text-base sm:text-lg">
              Welcome back,{" "}
              <span className="font-semibold text-primary">{fullName}</span>!
              Here's your overview.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {role === "student" && (
          <>
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              color="blue"
              icon={<FaBook className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("courses")}
            />
            <StatCard
              title="Completed Courses"
              value={stats.completedCourses}
              color="green"
              icon={<FaCheckCircle className="text-xl sm:text-2xl" />}
              progress={
                stats.totalCourses
                  ? (stats.completedCourses / stats.totalCourses) * 100
                  : 0
              }
            />
            <StatCard
              title="Quizzes Passed"
              // value={`${stats.quizzesPassed.passed}/${stats.quizzesPassed.total}`}
              color="yellow"
              icon={<FaClipboardList className="text-xl sm:text-2xl" />}
              // extra={`${stats.quizzesPassed.successRate}% success rate`}
            />
            <StatCard
              title="Certificates"
              value={stats.certificatesEarned}
              color="purple"
              icon={<FaCertificate className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("certificates")}
            />
          </>
        )}

        {role === "instructor" && (
          <>
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              color="blue"
              icon={<FaUsers className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("Students")}
            />
            <StatCard
              title="Courses Created"
              value={stats.coursesCreated}
              color="green"
              icon={<FaBook className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("Courses")}
            />
            <StatCard
              title="Projects Supervised"
              value={stats.projectsSupervised}
              color="yellow"
              icon={<FaProjectDiagram className="text-xl sm:text-2xl" />}
            />
            <StatCard
              title="Certificates Issued"
              value={stats.certificatesIssued}
              color="purple"
              icon={<FaCertificate className="text-xl sm:text-2xl" />}
            />
          </>
        )}

        {role === "admin" && (
          <>
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              color="blue"
              icon={<FaUsers className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("Adminstudents")}
            />
            <StatCard
              title="Total Instructors"
              value={stats.totalInstructors}
              color="green"
              icon={<FaChalkboardTeacher className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("Admininstructors")}
            />
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              color="yellow"
              icon={<FaBook className="text-xl sm:text-2xl" />}
              onClick={() => handleViewAll("Admincourses")}
            />
            <StatCard
              title="Certificates Issued"
              value={stats.certificatesIssued}
              color="purple"
              icon={<FaCertificate className="text-xl sm:text-2xl" />}
            />
          </>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {role === "student" && (
          <>
            <Section
              title="Live Sessions"
              icon={<FaCalendarAlt />}
              color="red"
              onViewAll={() => handleViewAll("sessions")}
            >
              {liveSessions.length > 0 ? (
                liveSessions.map((session) => (
                  <SessionCard key={session.sessionId} session={session} />
                ))
              ) : (
                <EmptyState message="No upcoming live sessions" />
              )}
            </Section>

            <Section
              title="Final Projects"
              icon={<FaProjectDiagram />}
              color="indigo"
              onViewAll={() => handleViewAll("projects")}
            >
              {finalProjects.length > 0 ? (
                finalProjects.map((project) => (
                  <ProjectCard key={project.projectId} project={project} />
                ))
              ) : (
                <EmptyState message="No active projects" />
              )}
            </Section>
          </>
        )}

        <Section
          title="Notifications"
          icon={<FaBell />}
          color="blue"
          onViewAll={() => navigate("/UserLayout/Notifications")}
        >
          {notifications.length > 0 ? (
            notifications.map((note) => {
              const message =
                note.message?.trim() || note.title || "No content";
              const time = note.createdAt
                ? new Date(note.createdAt).toLocaleString()
                : "Unknown time";

              return (
                <NotificationCard
                  key={note.notificationId}
                  note={{ message, time }}
                 onClick={() => handleOpenModal({ message, time, fullNote: note })}
                />
              );
            })
          ) : (
            <EmptyState message="No new notifications" />
          )}
        </Section>
         {/* Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Notification Details</h3>
            <p className="mb-2">
              <span className="font-semibold">Title:</span> {modalData.fullNote?.title || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Message:</span> {modalData.message}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Received at:</span> {modalData.time}
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

/* ---------- Sub Components ---------- */

const StatCard = ({ title, value, color, icon, progress, extra, onClick }) => {
  const colorClasses = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-600 dark:text-blue-400",
      progress: "bg-blue-500",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-600 dark:text-green-400",
      progress: "bg-green-500",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-600 dark:text-yellow-400",
      progress: "bg-yellow-500",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900",
      text: "text-purple-600 dark:text-purple-400",
      progress: "bg-purple-500",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`card card-hover border-l-4 ${currentColor.border} p-4 sm:p-6`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-text-primary">
            {value}
          </p>
        </div>
        <div
          className={`p-2 sm:p-3 rounded-xl ${currentColor.bg} ${currentColor.text}`}
        >
          {icon}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${currentColor.progress}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            {progress.toFixed(0)}% completion rate
          </p>
        </div>
      )}

      {extra && (
        <div className={`mt-3 text-sm font-medium ${currentColor.text}`}>
          {extra}
        </div>
      )}

      {onClick && (
        <div
          onClick={onClick}
          className={`mt-3 text-sm font-medium ${currentColor.text} cursor-pointer flex items-center hover:underline`}
        >
          <span>View All</span>
          <FaChevronRight className="inline ml-1 text-xs" />
        </div>
      )}
    </div>
  );
};

const Section = ({ title, icon, color, children, onViewAll }) => {
  const colorClasses = {
    red: "text-red-500",
    blue: "text-blue-500",
    indigo: "text-indigo-500",
    pink: "text-pink-500",
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center">
          <span className={`${currentColor} mr-3`}>{icon}</span> {title}
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:text-secondary font-medium flex items-center transition-colors btn-hover px-3 py-1 rounded-lg"
          >
            View all
            <FaChevronRight className="ml-1 text-xs" />
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
};

const SessionCard = ({ session }) => (
  <div className="flex items-center p-3 sm:p-4 rounded-lg border border-border hover:bg-accent transition-colors duration-200 card-hover">
    <div
      className={`w-2 h-2 rounded-full bg-${session.color}-500 mr-3 flex-shrink-0`}
    ></div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-text-primary truncate">
        {session.title}
      </p>
      <p className="text-sm text-text-secondary">
        {new Date(session.date).toLocaleString()}
      </p>
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-accent border border-border card-hover">
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-text-primary truncate">
        {project.title}
      </p>
      <p className="text-sm text-text-secondary capitalize">
        Status: {project.status}
      </p>
    </div>
    <div className="text-right ml-4">
      <p className="font-bold text-lg text-text-primary">{project.grade}</p>
      <p className="text-xs text-text-secondary">Grade</p>
    </div>
  </div>
);

const NotificationCard = ({ note, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-pointer card-hover transition-all duration-200"
  >
    <p className="font-semibold text-text-primary mb-1">{note.message}</p>
    <p className="text-sm text-text-secondary">{note.time}</p>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-8">
    <p className="text-text-secondary text-sm">{message}</p>
  </div>
);

export default Dashboard;
