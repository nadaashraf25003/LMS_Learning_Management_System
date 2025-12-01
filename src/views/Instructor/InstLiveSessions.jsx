import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/API/Config";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast, { Toaster } from "react-hot-toast";

// Define URLs directly in the component (fallback URLs)
const FALLBACK_URLS = {
  // Instructor Live Session Endpoints
  getInstructorSessions: "Instructor/get-sessions",
  createLiveSession: "Instructor/create-session",
  updateLiveSession: "Instructor/update-session",
  deleteLiveSession: "Instructor/delete-session",
  startLiveSession: "Instructor/start-session",
  endLiveSession: "Instructor/end-session",
  getSessionAnalytics: "Instructor/get-session-analytics",
  getSessionParticipants: "Instructor/get-session-participants",
  generateMeetingLink: "Instructor/generate-meeting-link",
  uploadSessionMaterials: "Instructor/upload-session-materials",
};

// Try to import actual Urls, otherwise use fallbacks
let ACTUAL_URLS = {};
try {
  if (typeof Urls !== 'undefined') {
    ACTUAL_URLS = Urls;
  }
} catch (error) {
  console.log("Urls not found, using fallback URLs");
}

// Merge URLs - actual URLs take precedence over fallbacks
const URLS = { ...FALLBACK_URLS, ...ACTUAL_URLS };

// Use the merged URLs
const GetInstructorSessionsEndPoint = URLS.getInstructorSessions;
const CreateLiveSessionEndPoint = URLS.createLiveSession;
const UpdateLiveSessionEndPoint = URLS.updateLiveSession;
const DeleteLiveSessionEndPoint = URLS.deleteLiveSession;
const StartLiveSessionEndPoint = URLS.startLiveSession;
const EndLiveSessionEndPoint = URLS.endLiveSession;
const GetSessionAnalyticsEndPoint = URLS.getSessionAnalytics;
const GetSessionParticipantsEndPoint = URLS.getSessionParticipants;
const GenerateMeetingLinkEndPoint = URLS.generateMeetingLink;

const SESSIONS_PER_PAGE = 10;

const SESSION_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
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
  QNA: "qna",
  OTHER: "other"
};

const MEETING_PLATFORMS = [
  { value: "zoom", label: "Zoom", icon: "🔷" },
  { value: "google_meet", label: "Google Meet", icon: "🔴" },
  { value: "microsoft_teams", label: "Microsoft Teams", icon: "🔵" },
  { value: "custom", label: "Custom URL", icon: "🔗" },
  { value: "other", label: "Other", icon: "📱" }
];

// Mock courses for demo
const MOCK_COURSES = [
  { id: "course_1", title: "React Masterclass", code: "CS501" },
  { id: "course_2", title: "Backend Development", code: "CS502" },
  { id: "course_3", title: "Algorithms & Data Structures", code: "CS503" },
  { id: "course_4", title: "JavaScript Basics", code: "CS504" }
];

// Mock data for demonstration
const MOCK_SESSIONS = [
  {
    id: "1",
    title: "Advanced React Hooks Workshop",
    description: "Deep dive into React hooks with practical examples and real-world use cases",
    course: {
      id: "course_1",
      title: "React Masterclass",
      code: "CS501"
    },
    startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now
    endTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // 2 hours from now
    duration: 90,
    status: SESSION_STATUS.SCHEDULED,
    category: SESSION_CATEGORIES.WORKSHOP,
    enrolledCount: 45,
    maxParticipants: 100,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingPlatform: "google_meet",
    meetingId: "abc-defg-hij",
    meetingPassword: "react123",
    requirements: ["Basic React knowledge", "Code editor"],
    materials: ["workshop-slides.pdf", "sample-code.zip"],
    notes: "Focus on useReducer and useContext hooks",
    recordingUrl: null,
    averageRating: 4.8,
    totalRatings: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  },
  {
    id: "2",
    title: "Live Coding: Building a REST API",
    description: "Watch as we build a complete REST API from scratch with Node.js and Express",
    course: {
      id: "course_2",
      title: "Backend Development",
      code: "CS502"
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
    meetingId: "123456789",
    meetingPassword: "backend2024",
    requirements: ["JavaScript basics"],
    materials: ["api-spec.pdf"],
    notes: "Start with basic Express setup",
    recordingUrl: null,
    averageRating: 4.9,
    totalRatings: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Data Structures Q&A Session",
    description: "Ask anything about arrays, linked lists, trees, and graphs",
    course: {
      id: "course_3",
      title: "Algorithms & Data Structures",
      code: "CS503"
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
    meetingId: "teams-xyz-123",
    meetingPassword: null,
    requirements: [],
    materials: ["qa-notes.pdf", "additional-resources.zip"],
    notes: "Students had great questions about binary trees",
    recordingUrl: "https://drive.google.com/file/d/xyz",
    averageRating: 4.5,
    totalRatings: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  },
  {
    id: "4",
    title: "Midterm Exam Review Session",
    description: "Comprehensive review of topics covered in the first half of the course",
    course: {
      id: "course_1",
      title: "React Masterclass",
      code: "CS501"
    },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 49).toISOString(), // 49 hours from now
    duration: 60,
    status: SESSION_STATUS.SCHEDULED,
    category: SESSION_CATEGORIES.REVIEW,
    enrolledCount: 95,
    maxParticipants: 150,
    meetingLink: "https://meet.google.com/review-session",
    meetingPlatform: "google_meet",
    meetingId: "review-session",
    meetingPassword: "review123",
    requirements: ["Completed first 5 modules"],
    materials: ["review-guide.pdf"],
    notes: "Focus on hooks and state management",
    recordingUrl: null,
    averageRating: null,
    totalRatings: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "5",
    title: "Draft: JavaScript Fundamentals Quiz",
    description: "Interactive quiz session to test JavaScript knowledge",
    course: {
      id: "course_4",
      title: "JavaScript Basics",
      code: "CS504"
    },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // 3 days from now
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 73).toISOString(), // 73 hours from now
    duration: 45,
    status: SESSION_STATUS.DRAFT,
    category: SESSION_CATEGORIES.QUIZ,
    enrolledCount: 0,
    maxParticipants: 50,
    meetingLink: null,
    meetingPlatform: null,
    meetingId: null,
    meetingPassword: null,
    requirements: ["Basic JavaScript knowledge"],
    materials: [],
    notes: "Need to prepare quiz questions",
    recordingUrl: null,
    averageRating: null,
    totalRatings: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

function InstructorLiveSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    startTime: "",
    endTime: "",
    duration: 60,
    category: SESSION_CATEGORIES.LECTURE,
    maxParticipants: 100,
    meetingPlatform: "zoom",
    meetingLink: "",
    meetingPassword: "",
    requirements: [],
    materials: [],
    notes: "",
    status: SESSION_STATUS.SCHEDULED
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
 
  const autoRefreshInterval = useRef(null);

  // Fetch sessions data
  const fetchSessions = async (showLoading = true) => {
    if (showLoading) setLoading(true);
   
    // Check if we should use mock data
    const shouldUseMockData = useMockData || !GetInstructorSessionsEndPoint || GetInstructorSessionsEndPoint === "Instructor/get-sessions";
   
    if (shouldUseMockData) {
      // Use mock data
      setTimeout(() => {
        setSessions(MOCK_SESSIONS);
        if (showLoading) setLoading(false);
      }, 500);
      return;
    }
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (search) params.search = search;
      const res = await api.get(GetInstructorSessionsEndPoint, { params });
      const data = res.data.sessions || res.data || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      toast.error("Failed to fetch sessions. Using demo data.");
      setSessions(MOCK_SESSIONS);
      setUseMockData(true);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSessions();
   
    // Set up auto-refresh for live sessions
    autoRefreshInterval.current = setInterval(() => {
      fetchSessions(false);
    }, 30000); // Refresh every 30 seconds
    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, []);

  // Reset page on filters
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, search]);

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
    // Apply search filter
    const q = search.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (session) =>
          session.title?.toLowerCase().includes(q) ||
          session.description?.toLowerCase().includes(q) ||
          session.course?.title?.toLowerCase().includes(q) ||
          session.course?.code?.toLowerCase().includes(q) ||
          session.category?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [sessions, statusFilter, categoryFilter, search]);

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
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse";
      case SESSION_STATUS.SCHEDULED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case SESSION_STATUS.ENDED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800";
      case SESSION_STATUS.DRAFT:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
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
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case SESSION_CATEGORIES.QUIZ:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case SESSION_CATEGORIES.WORKSHOP:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case SESSION_CATEGORIES.OFFICE_HOURS:
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case SESSION_CATEGORIES.REVIEW:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case SESSION_CATEGORIES.QNA:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
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

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle create session
  const handleCreateSession = async (e) => {
    e.preventDefault();
   
    try {
      if (useMockData) {
        // Mock creation
        const selectedCourse = MOCK_COURSES.find(c => c.id === formData.courseId);
        const newSession = {
          id: Date.now().toString(),
          ...formData,
          course: selectedCourse ? { id: formData.courseId, title: selectedCourse.title, code: selectedCourse.code } : null,
          enrolledCount: 0,
          averageRating: null,
          totalRatings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSessions(prev => [newSession, ...prev]);
        toast.success("Session created successfully!");
      } else if (CreateLiveSessionEndPoint) {
        await api.post(CreateLiveSessionEndPoint, formData);
        toast.success("Session created successfully!");
        fetchSessions(false); // Refresh sessions
      }
     
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating session:", err);
      toast.error("Failed to create session");
    }
  };

  // Handle update session
  const handleUpdateSession = async (e) => {
    e.preventDefault();
   
    try {
      if (useMockData) {
        // Mock update
        const selectedCourse = MOCK_COURSES.find(c => c.id === formData.courseId);
        setSessions(prev => prev.map(session =>
          session.id === selectedSession.id
            ? { 
                ...session, 
                ...formData,
                course: selectedCourse ? { id: formData.courseId, title: selectedCourse.title, code: selectedCourse.code } : session.course,
                updatedAt: new Date().toISOString() 
              }
            : session
        ));
        toast.success("Session updated successfully!");
      } else if (UpdateLiveSessionEndPoint) {
        await api.put(`${UpdateLiveSessionEndPoint}/${selectedSession.id}`, formData);
        toast.success("Session updated successfully!");
        fetchSessions(false); // Refresh sessions
      }
     
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      console.error("Error updating session:", err);
      toast.error("Failed to update session");
    }
  };

  // Handle delete session
  const handleDeleteSession = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      return;
    }
    try {
      if (useMockData) {
        // Mock delete
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        toast.success("Session deleted successfully!");
      } else if (DeleteLiveSessionEndPoint) {
        await api.delete(`${DeleteLiveSessionEndPoint}/${sessionId}`);
        toast.success("Session deleted successfully!");
        fetchSessions(false); // Refresh sessions
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error("Failed to delete session");
    }
  };

  // Handle start session
  const handleStartSession = async (session) => {
    if (session.status !== SESSION_STATUS.SCHEDULED) {
      toast.error("Only scheduled sessions can be started");
      return;
    }
    try {
      if (useMockData) {
        // Mock start
        setSessions(prev => prev.map(s =>
          s.id === session.id
            ? { ...s, status: SESSION_STATUS.LIVE, updatedAt: new Date().toISOString() }
            : s
        ));
        toast.success("Session started successfully!");
      } else if (StartLiveSessionEndPoint) {
        await api.post(`${StartLiveSessionEndPoint}/${session.id}`);
        toast.success("Session started successfully!");
        fetchSessions(false); // Refresh sessions
      }
    } catch (err) {
      console.error("Error starting session:", err);
      toast.error("Failed to start session");
    }
  };

  // Handle end session
  const handleEndSession = async (session) => {
    if (session.status !== SESSION_STATUS.LIVE) {
      toast.error("Only live sessions can be ended");
      return;
    }
    try {
      if (useMockData) {
        // Mock end
        setSessions(prev => prev.map(s =>
          s.id === session.id
            ? { ...s, status: SESSION_STATUS.ENDED, updatedAt: new Date().toISOString() }
            : s
        ));
        toast.success("Session ended successfully!");
      } else if (EndLiveSessionEndPoint) {
        await api.post(`${EndLiveSessionEndPoint}/${session.id}`);
        toast.success("Session ended successfully!");
        fetchSessions(false); // Refresh sessions
      }
    } catch (err) {
      console.error("Error ending session:", err);
      toast.error("Failed to end session");
    }
  };

  // Handle generate meeting link
  const handleGenerateMeetingLink = async (session) => {
    try {
      if (useMockData) {
        // Mock generation
        const platforms = ["zoom", "google_meet", "microsoft_teams"];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const meetingId = Math.random().toString(36).substring(7);
        const meetingLink = platform === "zoom"
          ? `https://zoom.us/j/${meetingId}`
          : platform === "google_meet"
          ? `https://meet.google.com/${meetingId}`
          : `https://teams.microsoft.com/l/meet/${meetingId}`;
       
        setSessions(prev => prev.map(s =>
          s.id === session.id
            ? {
                ...s,
                meetingPlatform: platform,
                meetingLink: meetingLink,
                meetingId: meetingId,
                meetingPassword: Math.random().toString(36).substring(2, 8),
                updatedAt: new Date().toISOString()
              }
            : s
        ));
        toast.success("Meeting link generated successfully!");
      } else if (GenerateMeetingLinkEndPoint) {
        const response = await api.post(`${GenerateMeetingLinkEndPoint}/${session.id}`);
        toast.success("Meeting link generated successfully!");
        fetchSessions(false); // Refresh sessions
      }
    } catch (err) {
      console.error("Error generating meeting link:", err);
      toast.error("Failed to generate meeting link");
    }
  };

  // Handle copy meeting link
  const handleCopyMeetingLink = (session) => {
    if (!session.meetingLink) {
      toast.error("No meeting link available");
      return;
    }
    navigator.clipboard.writeText(session.meetingLink);
    toast.success("Meeting link copied to clipboard!");
  };

  // Handle copy meeting credentials
  const handleCopyCredentials = (session) => {
    const credentials = `Meeting ID: ${session.meetingId}\nPassword: ${session.meetingPassword || 'None'}\nLink: ${session.meetingLink}`;
    navigator.clipboard.writeText(credentials);
    toast.success("Meeting credentials copied to clipboard!");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseId: "",
      startTime: "",
      endTime: "",
      duration: 60,
      category: SESSION_CATEGORIES.LECTURE,
      maxParticipants: 100,
      meetingPlatform: "zoom",
      meetingLink: "",
      meetingPassword: "",
      requirements: [],
      materials: [],
      notes: "",
      status: SESSION_STATUS.SCHEDULED
    });
    setNewRequirement("");
    setNewMaterial("");
  };

  // Edit session
  const handleEditSession = (session) => {
    setFormData({
      title: session.title,
      description: session.description,
      courseId: session.course?.id || "",
      startTime: session.startTime ? session.startTime.split('T')[0] + 'T' + session.startTime.split('T')[1].substring(0, 5) : "",
      endTime: session.endTime ? session.endTime.split('T')[0] + 'T' + session.endTime.split('T')[1].substring(0, 5) : "",
      duration: session.duration,
      category: session.category,
      maxParticipants: session.maxParticipants,
      meetingPlatform: session.meetingPlatform || "zoom",
      meetingLink: session.meetingLink || "",
      meetingPassword: session.meetingPassword || "",
      requirements: session.requirements || [],
      materials: session.materials || [],
      notes: session.notes || "",
      status: session.status
    });
    setSelectedSession(session);
    setShowEditModal(true);
  };

  // Add requirement
  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  // Remove requirement
  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Add material
  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial("");
    }
  };

  // Remove material
  const handleRemoveMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  // Get session statistics
  const getSessionStats = useMemo(() => {
    const stats = {
      total: sessions.length,
      live: sessions.filter(s => s.status === SESSION_STATUS.LIVE).length,
      scheduled: sessions.filter(s => s.status === SESSION_STATUS.SCHEDULED).length,
      draft: sessions.filter(s => s.status === SESSION_STATUS.DRAFT).length,
      ended: sessions.filter(s => s.status === SESSION_STATUS.ENDED).length,
      totalEnrolled: sessions.reduce((sum, session) => sum + (session.enrolledCount || 0), 0),
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <LandingHeading header="Live Sessions Management" />
     
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Schedule, manage, and conduct live sessions for your students
          {useMockData && (
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded">
              Using Demo Data
            </span>
          )}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Sessions</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{getSessionStats.total}</p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Live Now</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">{getSessionStats.live}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Scheduled</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">{getSessionStats.scheduled}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Enrolled</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">{getSessionStats.totalEnrolled}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5h2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters, Search and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions by title, course, or description..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Session
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value={SESSION_STATUS.LIVE}>Live Now</option>
              <option value={SESSION_STATUS.SCHEDULED}>Scheduled</option>
              <option value={SESSION_STATUS.DRAFT}>Draft</option>
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value={SESSION_CATEGORIES.LECTURE}>Lecture</option>
              <option value={SESSION_CATEGORIES.QUIZ}>Quiz</option>
              <option value={SESSION_CATEGORIES.WORKSHOP}>Workshop</option>
              <option value={SESSION_CATEGORIES.OFFICE_HOURS}>Office Hours</option>
              <option value={SESSION_CATEGORIES.REVIEW}>Review</option>
              <option value={SESSION_CATEGORIES.QNA}>Q&A</option>
              <option value={SESSION_CATEGORIES.OTHER}>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Session Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Participants
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pageSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">No sessions found</p>
                      <p className="text-sm">Create your first live session to get started</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create New Session
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                pageSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            session.status === SESSION_STATUS.LIVE ? 'bg-red-100 dark:bg-red-900' :
                            session.status === SESSION_STATUS.SCHEDULED ? 'bg-blue-100 dark:bg-blue-900' :
                            session.status === SESSION_STATUS.DRAFT ? 'bg-yellow-100 dark:bg-yellow-900' :
                            'bg-gray-100 dark:bg-gray-900'
                          }`}>
                            <span className={`text-sm font-medium ${
                              session.status === SESSION_STATUS.LIVE ? 'text-red-600 dark:text-red-300' :
                              session.status === SESSION_STATUS.SCHEDULED ? 'text-blue-600 dark:text-blue-300' :
                              session.status === SESSION_STATUS.DRAFT ? 'text-yellow-600 dark:text-yellow-300' :
                              'text-gray-600 dark:text-gray-300'
                            }`}>
                              {session.category?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {session.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(session.category)}`}>
                              {session.category?.replace('_', ' ')?.toUpperCase()}
                            </span>
                            {session.averageRating && (
                              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {session.averageRating.toFixed(1)} ({session.totalRatings})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.course?.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.course?.code}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(session.startTime)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(session.startTime)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.enrolledCount}/{session.maxParticipants}
                        </p>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(session.enrolledCount / session.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status === SESSION_STATUS.LIVE && (
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        )}
                        {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          {session.status === SESSION_STATUS.SCHEDULED && (
                            <button
                              onClick={() => handleStartSession(session)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {session.status === SESSION_STATUS.LIVE && (
                            <button
                              onClick={() => handleEndSession(session)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              End
                            </button>
                          )}
                          <button
                            onClick={() => handleEditSession(session)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          {!session.meetingLink && session.status === SESSION_STATUS.SCHEDULED && (
                            <button
                              onClick={() => handleGenerateMeetingLink(session)}
                              className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                            >
                              Generate Link
                            </button>
                          )}
                          {session.meetingLink && (
                            <button
                              onClick={() => handleCopyMeetingLink(session)}
                              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                            >
                              Copy Link
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Live Session</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateSession} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Enter session title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Course *
                      </label>
                      <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a course</option>
                        {MOCK_COURSES.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        {Object.entries(SESSION_CATEGORIES).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFormChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Participants *
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleFormChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Describe what this session will cover..."
                    />
                  </div>
                </div>
                {/* Schedule */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                {/* Meeting Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Platform *
                      </label>
                      <select
                        name="meetingPlatform"
                        value={formData.meetingPlatform}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        {MEETING_PLATFORMS.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.icon} {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="https://meet.google.com/abc-defg-hij"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Password
                      </label>
                      <input
                        type="text"
                        name="meetingPassword"
                        value={formData.meetingPassword}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Add a requirement..."
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Materials */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Materials</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Add a material (e.g., slides.pdf)..."
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.materials.map((mat, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{mat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Session Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Notes</h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Add any notes or reminders for this session..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Session: {selectedSession.title}</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateSession} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Session Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
                        {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                      </span>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        {Object.entries(SESSION_STATUS).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Enrollment
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSession.enrolledCount}/{formData.maxParticipants}
                    </p>
                  </div>
                </div>
                {/* Meeting Credentials */}
                {selectedSession.meetingLink && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Meeting Credentials</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Platform:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {MEETING_PLATFORMS.find(p => p.value === selectedSession.meetingPlatform)?.label || selectedSession.meetingPlatform}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Meeting ID:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedSession.meetingId}</span>
                      </div>
                      {selectedSession.meetingPassword && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Password:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedSession.meetingPassword}</span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCredentials(selectedSession)}
                          className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        >
                          Copy Credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyMeetingLink(selectedSession)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Enter session title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Course *
                      </label>
                      <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a course</option>
                        {MOCK_COURSES.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        {Object.entries(SESSION_CATEGORIES).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFormChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Participants *
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleFormChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Describe what this session will cover..."
                    />
                  </div>
                </div>
                {/* Schedule */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                {/* Meeting Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Platform *
                      </label>
                      <select
                        name="meetingPlatform"
                        value={formData.meetingPlatform}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      >
                        {MEETING_PLATFORMS.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.icon} {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="https://meet.google.com/abc-defg-hij"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Password
                      </label>
                      <input
                        type="text"
                        name="meetingPassword"
                        value={formData.meetingPassword}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Add a requirement..."
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Materials */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Materials</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Add a material (e.g., slides.pdf)..."
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.materials.map((mat, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{mat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Session Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Notes</h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Add any notes or reminders for this session..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorLiveSessions;