import { useEffect, useMemo, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
// Mock router hook
const useNavigate = () => {
  return (path) => {
    console.log("Navigating to:", path);
    toast.success(`Navigating to ${path}`);
  };
};
// Mock LandingHeading component
const LandingHeading = ({ header }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{header}</h1>
  </div>
);
// Mock Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
     
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
     
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};
// Mock API config
const api = {
  get: async (endpoint, options) => {
    console.log(`Mock GET to ${endpoint}`, options);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { sessions: [], success: true } });
      }, 300);
    });
  },
  post: async (endpoint, data) => {
    console.log(`Mock POST to ${endpoint}`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true } });
      }, 300);
    });
  }
};
// Define URLs directly in the component
const URLS = {
  getLiveSessions: "Student/get-live-sessions",
  getUpcomingSessions: "Student/get-upcoming-sessions",
  getPastSessions: "Student/get-past-sessions",
  joinSession: "Student/join-session",
  leaveSession: "Student/leave-session",
  getSessionDetails: "Student/get-session-details",
  rateSession: "Student/rate-session",
  getSessionResources: "Student/get-session-resources",
  enrollInSession: "Student/enroll-in-session",
};
const GetLiveSessionsEndPoint = URLS.getLiveSessions;
const GetUpcomingSessionsEndPoint = URLS.getUpcomingSessions;
const GetPastSessionsEndPoint = URLS.getPastSessions;
const JoinSessionEndPoint = URLS.joinSession;
const LeaveSessionEndPoint = URLS.leaveSession;
const GetSessionDetailsEndPoint = URLS.getSessionDetails;
const RateSessionEndPoint = URLS.rateSession;
const GetSessionResourcesEndPoint = URLS.getSessionResources;
const EnrollInSessionEndPoint = URLS.enrollInSession;
const SESSIONS_PER_PAGE = 9;
const SESSION_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  ENDED: "ended",
  CANCELLED: "cancelled"
};
const SESSION_CATEGORIES = {
  LECTURE: "lecture",
  QUIZ: "quiz",
  WORKSHOP: "workshop",
  OFFICE_HOURS: "office_hours",
  REVIEW: "review",
  OTHER: "other"
};
// Mock data for demonstration
const MOCK_SESSIONS = [
  {
    id: "1",
    title: "Advanced React Hooks Workshop",
    description: "Deep dive into React hooks with practical examples and real-world use cases",
    instructor: {
      id: "instructor_1",
      name: "Dr. Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4.8
    },
    course: {
      id: "course_1",
      title: "React Masterclass",
      category: "Web Development"
    },
    startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now
    endTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // 2 hours from now
    duration: 90,
    status: SESSION_STATUS.UPCOMING,
    category: SESSION_CATEGORIES.WORKSHOP,
    enrolledCount: 45,
    maxParticipants: 100,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingPlatform: "google_meet",
    requirements: ["Basic React knowledge", "Code editor"],
    materials: ["workshop-slides.pdf", "sample-code.zip"],
    isEnrolled: true,
    isFavorite: true,
    rating: null,
    notes: ""
  },
  {
    id: "2",
    title: "Live Coding: Building a REST API",
    description: "Watch as we build a complete REST API from scratch with Node.js and Express",
    instructor: {
      id: "instructor_2",
      name: "Prof. Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.9
    },
    course: {
      id: "course_2",
      title: "Backend Development",
      category: "Web Development"
    },
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
    duration: 60,
    status: SESSION_STATUS.LIVE,
    category: SESSION_CATEGORIES.LECTURE,
    enrolledCount: 120,
    maxParticipants: 200,
    meetingLink: "https://zoom.us/j/123456789",
    meetingPlatform: "zoom",
    requirements: ["JavaScript basics"],
    materials: ["api-spec.pdf"],
    isEnrolled: true,
    isFavorite: false,
    rating: null,
    notes: ""
  },
  {
    id: "3",
    title: "Data Structures Q&A Session",
    description: "Ask anything about arrays, linked lists, trees, and graphs",
    instructor: {
      id: "instructor_3",
      name: "Dr. Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.7
    },
    course: {
      id: "course_3",
      title: "Algorithms & Data Structures",
      category: "Computer Science"
    },
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
    duration: 60,
    status: SESSION_STATUS.ENDED,
    category: SESSION_CATEGORIES.OFFICE_HOURS,
    enrolledCount: 85,
    maxParticipants: 100,
    meetingLink: null,
    meetingPlatform: "microsoft_teams",
    recordingUrl: "https://drive.google.com/file/d/xyz",
    requirements: [],
    materials: ["qa-notes.pdf", "additional-resources.zip"],
    isEnrolled: true,
    isFavorite: true,
    rating: 4.5,
    notes: "Great explanations about binary trees!"
  },
  {
    id: "4",
    title: "Midterm Exam Review Session",
    description: "Comprehensive review of topics covered in the first half of the course",
    instructor: {
      id: "instructor_1",
      name: "Dr. Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4.8
    },
    course: {
      id: "course_1",
      title: "React Masterclass",
      category: "Web Development"
    },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 49).toISOString(), // 49 hours from now
    duration: 60,
    status: SESSION_STATUS.UPCOMING,
    category: SESSION_CATEGORIES.REVIEW,
    enrolledCount: 95,
    maxParticipants: 150,
    meetingLink: "https://meet.google.com/review-session",
    meetingPlatform: "google_meet",
    requirements: ["Completed first 5 modules"],
    materials: ["review-guide.pdf"],
    isEnrolled: false,
    isFavorite: false,
    rating: null,
    notes: ""
  },
  {
    id: "5",
    title: "JavaScript Fundamentals Quiz Session",
    description: "Interactive quiz session to test your JavaScript knowledge",
    instructor: {
      id: "instructor_4",
      name: "Alex Thompson",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 4.6
    },
    course: {
      id: "course_4",
      title: "JavaScript Basics",
      category: "Programming"
    },
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), // 11 hours ago
    duration: 60,
    status: SESSION_STATUS.ENDED,
    category: SESSION_CATEGORIES.QUIZ,
    enrolledCount: 65,
    maxParticipants: 100,
    meetingLink: null,
    meetingPlatform: "zoom",
    recordingUrl: "https://drive.google.com/file/d/quiz-recording",
    requirements: ["Basic JavaScript knowledge"],
    materials: ["quiz-answers.pdf"],
    isEnrolled: true,
    isFavorite: false,
    rating: 4.2,
    notes: "Challenging but fair questions"
  }
];
function LiveSession() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  const [ratingModal, setRatingModal] = useState({ show: false, sessionId: null, rating: 0 });
  const [notesModal, setNotesModal] = useState({ show: false, sessionId: null, notes: "" });
 
  const autoRefreshInterval = useRef(null);
  // Fetch sessions data
  const fetchSessions = async (showLoading = true) => {
    if (showLoading) setLoading(true);
   
    // Always use mock data for this standalone version
    setTimeout(() => {
      setSessions(MOCK_SESSIONS);
      if (showLoading) setLoading(false);
    }, 500);
  };
  // Initial fetch
  useEffect(() => {
    fetchSessions();
   
    // Set up auto-refresh for live sessions
    autoRefreshInterval.current = setInterval(() => {
      if (statusFilter === "all" || statusFilter === SESSION_STATUS.LIVE) {
        fetchSessions(false);
      }
    }, 30000); // Refresh every 30 seconds for live sessions
    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, []);
  // Reset page on filters
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, search, dateRange, showOnlyEnrolled, showOnlyFavorites]);
  // Filtered sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions;
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(session => session.category === categoryFilter);
    }
    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= startDate;
      });
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate <= endDate;
      });
    }
    // Apply enrolled filter
    if (showOnlyEnrolled) {
      filtered = filtered.filter(session => session.isEnrolled);
    }
    // Apply favorites filter
    if (showOnlyFavorites) {
      filtered = filtered.filter(session => session.isFavorite);
    }
    // Apply search filter
    const q = search.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (session) =>
          session.title?.toLowerCase().includes(q) ||
          session.description?.toLowerCase().includes(q) ||
          session.instructor?.name?.toLowerCase().includes(q) ||
          session.course?.title?.toLowerCase().includes(q) ||
          session.course?.category?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [sessions, statusFilter, categoryFilter, search, dateRange, showOnlyEnrolled, showOnlyFavorites]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / SESSIONS_PER_PAGE)
  );
  const pageStartIndex = (currentPage - 1) * SESSIONS_PER_PAGE;
  const pageSessions = filteredSessions.slice(
    pageStartIndex,
    pageStartIndex + SESSIONS_PER_PAGE
  );
  // Get session status color
  const getStatusColor = (status) => {
    switch (status) {
      case SESSION_STATUS.LIVE:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse";
      case SESSION_STATUS.UPCOMING:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case SESSION_STATUS.ENDED:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800";
      case SESSION_STATUS.CANCELLED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
    }
  };
  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case SESSION_CATEGORIES.LECTURE:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case SESSION_CATEGORIES.QUIZ:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case SESSION_CATEGORIES.WORKSHOP:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case SESSION_CATEGORIES.OFFICE_HOURS:
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      case SESSION_CATEGORIES.REVIEW:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
   
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffMs < 0) {
      const absDiffMin = Math.abs(diffMin);
      if (absDiffMin < 60) return `${absDiffMin}m ago`;
      if (absDiffMin < 1440) return `${Math.abs(diffHour)}h ago`;
      return `${Math.abs(diffDay)}d ago`;
    } else {
      if (diffMin < 60) return `in ${diffMin}m`;
      if (diffHour < 24) return `in ${diffHour}h`;
      return `in ${diffDay}d`;
    }
  };
  // Handle join session
  const handleJoinSession = async (session) => {
    if (!session.isEnrolled) {
      toast.error("You need to enroll in this session first");
      return;
    }
    if (session.status !== SESSION_STATUS.LIVE) {
      toast.error("This session is not live yet");
      return;
    }
    if (!session.meetingLink) {
      toast.error("Meeting link not available");
      return;
    }
    try {
      // Open meeting link in new tab
      window.open(session.meetingLink, '_blank');
      toast.success("Joining session...");
    } catch (err) {
      console.error("Error joining session:", err);
      toast.error("Failed to join session");
    }
  };
  // Handle enroll in session
  const handleEnrollSession = async (session) => {
    if (session.isEnrolled) {
      toast.error("You are already enrolled in this session");
      return;
    }
    if (session.enrolledCount >= session.maxParticipants) {
      toast.error("This session is full");
      return;
    }
    try {
      // Mock enrollment
      setSessions(prev => prev.map(s =>
        s.id === session.id
          ? { ...s, isEnrolled: true, enrolledCount: s.enrolledCount + 1 }
          : s
      ));
      toast.success("Successfully enrolled in session!");
    } catch (err) {
      console.error("Error enrolling in session:", err);
      toast.error("Failed to enroll in session");
    }
  };
  // Handle toggle favorite
  const handleToggleFavorite = async (session) => {
    try {
      // Mock favorite toggle
      setSessions(prev => prev.map(s =>
        s.id === session.id
          ? { ...s, isFavorite: !s.isFavorite }
          : s
      ));
      toast.success(session.isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Failed to update favorites");
    }
  };
  // Handle submit rating
  const handleSubmitRating = async () => {
    if (ratingModal.rating < 1 || ratingModal.rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }
    try {
      // Mock rating submission
      setSessions(prev => prev.map(s =>
        s.id === ratingModal.sessionId
          ? { ...s, rating: ratingModal.rating }
          : s
      ));
      toast.success("Thank you for your rating!");
      setRatingModal({ show: false, sessionId: null, rating: 0 });
    } catch (err) {
      console.error("Error submitting rating:", err);
      toast.error("Failed to submit rating");
    }
  };
  // Handle save notes
  const handleSaveNotes = async () => {
    try {
      // Mock notes save
      setSessions(prev => prev.map(s =>
        s.id === notesModal.sessionId
          ? { ...s, notes: notesModal.notes }
          : s
      ));
      toast.success("Notes saved successfully!");
      setNotesModal({ show: false, sessionId: null, notes: "" });
    } catch (err) {
      console.error("Error saving notes:", err);
      toast.error("Failed to save notes");
    }
  };
  // Get session statistics
  const getSessionStats = useMemo(() => {
    const stats = {
      total: sessions.length,
      live: sessions.filter(s => s.status === SESSION_STATUS.LIVE).length,
      upcoming: sessions.filter(s => s.status === SESSION_STATUS.UPCOMING).length,
      enrolled: sessions.filter(s => s.isEnrolled).length,
      favorites: sessions.filter(s => s.isFavorite).length,
      today: sessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        const today = new Date();
        return sessionDate.toDateString() === today.toDateString();
      }).length
    };
    return stats;
  }, [sessions]);
  // Refresh sessions
  const handleRefresh = () => {
    fetchSessions();
    toast.success("Sessions refreshed");
  };
  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading live sessions...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
        }}
      />
     
      <div className="p-4 md:p-6">
        <LandingHeading header="Live Sessions" />
       
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Join live lectures, workshops, and interactive sessions with your instructors and classmates
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">
              Using Demo Data
            </span>
          </p>
        </div>
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Live Now</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{getSessionStats.live}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{getSessionStats.upcoming}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrolled</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{getSessionStats.enrolled}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{getSessionStats.today}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Filters, Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sessions by title, instructor, course, or description..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value={SESSION_STATUS.LIVE}>Live Now</option>
                <option value={SESSION_STATUS.UPCOMING}>Upcoming</option>
                <option value={SESSION_STATUS.ENDED}>Ended</option>
                <option value={SESSION_STATUS.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value={SESSION_CATEGORIES.LECTURE}>Lecture</option>
                <option value={SESSION_CATEGORIES.QUIZ}>Quiz</option>
                <option value={SESSION_CATEGORIES.WORKSHOP}>Workshop</option>
                <option value={SESSION_CATEGORIES.OFFICE_HOURS}>Office Hours</option>
                <option value={SESSION_CATEGORIES.REVIEW}>Review</option>
                <option value={SESSION_CATEGORIES.OTHER}>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Start Date"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="End Date"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enrolledOnly"
                  checked={showOnlyEnrolled}
                  onChange={(e) => setShowOnlyEnrolled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="enrolledOnly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enrolled Only
                </label>
              </div>
             
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="favoritesOnly"
                  checked={showOnlyFavorites}
                  onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                  className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="favoritesOnly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Favorites
                </label>
              </div>
            </div>
          </div>
          {/* Clear Filters Button */}
          {(dateRange.start || dateRange.end || showOnlyEnrolled || showOnlyFavorites || search || statusFilter !== "all" || categoryFilter !== "all") && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSearch("");
                  setDateRange({ start: "", end: "" });
                  setShowOnlyEnrolled(false);
                  setShowOnlyFavorites(false);
                }}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pageSessions.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00 — 2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium mb-2 dark:text-gray-300">No sessions found</p>
                <p className="text-sm dark:text-gray-400">Try adjusting your filters or check back later for new sessions</p>
              </div>
            </div>
          ) : (
            pageSessions.map((session) => (
              <div
                key={session.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  session.status === SESSION_STATUS.LIVE
                    ? "border-red-300 dark:border-red-700"
                    : session.status === SESSION_STATUS.UPCOMING
                    ? "border-blue-300 dark:border-blue-700"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Session Header */}
                <div className={`p-4 ${
                  session.status === SESSION_STATUS.LIVE
                    ? "bg-red-50 dark:bg-red-900/20"
                    : session.status === SESSION_STATUS.UPCOMING
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-gray-50 dark:bg-gray-900"
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status === SESSION_STATUS.LIVE && (
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        )}
                        {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(session.category)}`}>
                        {session.category?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                   
                    <button
                      onClick={() => handleToggleFavorite(session)}
                      className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    >
                      {session.isFavorite ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {session.title}
                  </h3>
                 
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {session.description}
                  </p>
                </div>
                {/* Session Body */}
                <div className="p-4">
                  {/* Instructor Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={session.instructor?.avatar || "https://via.placeholder.com/40"}
                      alt={session.instructor?.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{session.instructor?.name}</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{session.instructor?.rating}/5.0</span>
                      </div>
                    </div>
                  </div>
                  {/* Course Info */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Course</p>
                    <p className="font-medium text-gray-900 dark:text-white">{session.course?.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{session.course?.category}</p>
                  </div>
                  {/* Session Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(session.startTime)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(session.duration)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatRelativeTime(session.startTime)}</p>
                    </div>
                  </div>
                  {/* Enrollment Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Participants</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.enrolledCount}/{session.maxParticipants}
                        </span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(session.enrolledCount / session.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                   
                    {session.rating && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Rating</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < session.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Requirements */}
                  {session.requirements && session.requirements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {session.requirements.map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {session.status === SESSION_STATUS.LIVE && session.isEnrolled ? (
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Live Session
                      </button>
                    ) : session.status === SESSION_STATUS.UPCOMING && !session.isEnrolled ? (
                      <button
                        onClick={() => handleEnrollSession(session)}
                        disabled={session.enrolledCount >= session.maxParticipants}
                        className={`w-full py-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          session.enrolledCount >= session.maxParticipants
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {session.enrolledCount >= session.maxParticipants ? "Session Full" : "Enroll Now"}
                      </button>
                    ) : session.status === SESSION_STATUS.UPCOMING && session.isEnrolled ? (
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Already Enrolled
                      </button>
                    ) : session.status === SESSION_STATUS.ENDED && session.recordingUrl ? (
                      <a
                        href={session.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Watch Recording
                      </a>
                    ) : null}
                    {/* Additional Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Details
                      </button>
                     
                      {session.status === SESSION_STATUS.ENDED && !session.rating && session.isEnrolled && (
                        <button
                          onClick={() => setRatingModal({ show: true, sessionId: session.id, rating: 0 })}
                          className="flex-1 py-2 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 font-medium rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                        >
                          Rate
                        </button>
                      )}
                     
                      {session.isEnrolled && (
                        <button
                          onClick={() => setNotesModal({ show: true, sessionId: session.id, notes: session.notes || "" })}
                          className="flex-1 py-2 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          Notes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
        {filteredSessions.length > SESSIONS_PER_PAGE && (
          <div className="mb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        {/* Session Details Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSession.status)}`}>
                    {selectedSession.status?.charAt(0).toUpperCase() + selectedSession.status?.slice(1)}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSession.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Instructor & Course Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Instructor</h3>
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedSession.instructor?.avatar || "https://via.placeholder.com/50"}
                          alt={selectedSession.instructor?.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedSession.instructor?.name}</p>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{selectedSession.instructor?.rating}/5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Course</h3>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{selectedSession.course?.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession.course?.category}</p>
                      </div>
                    </div>
                  </div>
                  {/* Session Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Schedule</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Date:</span>
                          <span className="font-medium dark:text-white">{formatDate(selectedSession.startTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Time:</span>
                          <span className="font-medium dark:text-white">{formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-medium dark:text-white">{formatDuration(selectedSession.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Participation</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Enrolled:</span>
                          <span className="font-medium dark:text-white">{selectedSession.enrolledCount}/{selectedSession.maxParticipants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Your Status:</span>
                          <span className={`font-medium ${
                            selectedSession.isEnrolled ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                          }`}>
                            {selectedSession.isEnrolled ? "Enrolled" : "Not Enrolled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                          <span className="font-medium dark:text-white">{selectedSession.meetingPlatform?.replace('_', ' ')?.toUpperCase() || "Not specified"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Session Info</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Category:</span>
                          <span className={`font-medium ${getCategoryColor(selectedSession.category).split(' ')[0]} ${getCategoryColor(selectedSession.category).split(' ')[1]}`}>
                            {selectedSession.category?.replace('_', ' ')?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`font-medium ${getStatusColor(selectedSession.status).split(' ')[0]} ${getStatusColor(selectedSession.status).split(' ')[1]}`}>
                            {selectedSession.status?.charAt(0).toUpperCase() + selectedSession.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Description</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedSession.description}</p>
                    </div>
                  </div>
                  {/* Requirements */}
                  {selectedSession.requirements && selectedSession.requirements.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSession.requirements.map((req, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Materials */}
                  {selectedSession.materials && selectedSession.materials.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Materials</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedSession.materials.map((material, index) => (
                          <a
                            key={index}
                            href="#"
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                          >
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white truncate">{material}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Session {formatRelativeTime(selectedSession.startTime)}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                 
                  {selectedSession.status === SESSION_STATUS.LIVE && selectedSession.isEnrolled ? (
                    <button
                      onClick={() => handleJoinSession(selectedSession)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors"
                    >
                      Join Session
                    </button>
                  ) : selectedSession.status === SESSION_STATUS.UPCOMING && !selectedSession.isEnrolled ? (
                    <button
                      onClick={() => handleEnrollSession(selectedSession)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      Enroll Now
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Rating Modal */}
        {ratingModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rate This Session</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">How would you rate this live session?</p>
             
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingModal(prev => ({ ...prev, rating: star }))}
                    className="p-2"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= ratingModal.rating
                          ? "text-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
             
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRatingModal({ show: false, sessionId: null, rating: 0 })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Notes Modal */}
        {notesModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Session Notes</h3>
              <textarea
                value={notesModal.notes}
                onChange={(e) => setNotesModal(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add your notes for this session..."
                className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 dark:placeholder-gray-400"
              />
             
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setNotesModal({ show: false, sessionId: null, notes: "" })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default LiveSession;