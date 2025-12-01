import { useEffect, useMemo, useState, useCallback } from "react";
import api from "@/API/Config";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast, { Toaster } from "react-hot-toast";

// Define URLs directly in the component (fallback URLs)
const FALLBACK_URLS = {
  // Log Management Endpoints
  getLogs: "Admin/get-logs",
  getLogById: "Admin/get-log",
  clearLogs: "Admin/clear-logs",
  exportLogs: "Admin/export-logs",
  getLogStats: "Admin/get-log-stats"
};

// Try to import actual Urls, otherwise use fallbacks
let ACTUAL_URLS = {};
try {
  // Dynamic import or check if Urls exists
  if (typeof Urls !== 'undefined') {
    ACTUAL_URLS = Urls;
  }
} catch (error) {
  console.log("Urls not found, using fallback URLs");
}

// Merge URLs - actual URLs take precedence over fallbacks
const URLS = { ...FALLBACK_URLS, ...ACTUAL_URLS };

// Use the merged URLs
const GetLogsEndPoint = URLS.getLogs;
const ClearLogsEndPoint = URLS.clearLogs;
const ExportLogsEndPoint = URLS.exportLogs;
const GetLogStatsEndPoint = URLS.getLogStats;

const LOGS_PER_PAGE = 15;
const LOG_LEVELS = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  DEBUG: "debug"
};

const LOG_TYPES = {
  AUTH: "authentication",
  PAYMENT: "payment",
  COURSE: "course",
  USER: "user",
  SYSTEM: "system",
  API: "api",
  OTHER: "other"
};

// Mock data for demonstration (remove in production)
const MOCK_LOGS = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    level: "info",
    type: "user",
    message: "User 'john_doe' logged in successfully",
    user: {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com"
    },
    ip: "192.168.1.100",
    action: "login",
    endpoint: "/api/auth/login",
    method: "POST",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    level: "error",
    type: "payment",
    message: "Payment processing failed: Invalid card details",
    user: {
      id: "user_456",
      name: "Jane Smith",
      email: "jane@example.com"
    },
    ip: "203.0.113.5",
    action: "payment.process",
    endpoint: "/api/payments/process",
    method: "POST",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    level: "warn",
    type: "course",
    message: "Course approval pending for more than 24 hours",
    user: {
      id: "admin_1",
      name: "Admin User",
      email: "admin@example.com"
    },
    ip: "10.0.0.1",
    action: "course.review",
    endpoint: "/api/courses/review",
    method: "GET"
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    level: "info",
    type: "api",
    message: "API rate limit reached for user user_123",
    user: {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com"
    },
    ip: "192.168.1.100",
    action: "api.limit",
    endpoint: "/api/courses/list",
    method: "GET"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    level: "debug",
    type: "system",
    message: "Database connection pool initialized with 10 connections",
    ip: "127.0.0.1",
    action: "system.startup"
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    level: "error",
    type: "authentication",
    message: "Failed login attempt for user 'test_user'",
    ip: "203.0.113.10",
    action: "login.failed",
    endpoint: "/api/auth/login",
    method: "POST",
    userAgent: "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
    metadata: {
      attemptCount: 3,
      reason: "Invalid password"
    }
  }
];

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch logs data
  const fetchLogs = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    // Check if we should use mock data (for development/demo)
    const shouldUseMockData = useMockData || !GetLogsEndPoint || GetLogsEndPoint === "Admin/get-logs";
    
    if (shouldUseMockData) {
      // Use mock data
      setTimeout(() => {
        setLogs(MOCK_LOGS);
        if (showLoading) setLoading(false);
      }, 500);
      return;
    }

    try {
      // Use real API
      const res = await api.get(GetLogsEndPoint);
      const data = res.data.logs || res.data || [];
      setLogs(Array.isArray(data) ? data.reverse() : []); // Show newest first
    } catch (err) {
      console.error("Error fetching logs:", err);
      toast.error("Failed to fetch logs. Using demo data.");
      setLogs(MOCK_LOGS);
      setUseMockData(true);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [useMockData]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto refresh logs
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLogs(false); // Silent refresh
      }, 10000); // Refresh every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchLogs]);

  // Reset page on filters
  useEffect(() => {
    setCurrentPage(1);
  }, [levelFilter, typeFilter, search, dateRange]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        logDate.setHours(0, 0, 0, 0);
        return logDate >= startDate;
      });
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        return logDate <= endDate;
      });
    }

    // Apply search filter
    const q = search.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (log) =>
          log.message?.toLowerCase().includes(q) ||
          log.user?.name?.toLowerCase().includes(q) ||
          log.user?.email?.toLowerCase().includes(q) ||
          log.ip?.toLowerCase().includes(q) ||
          log.action?.toLowerCase().includes(q) ||
          log.endpoint?.toLowerCase().includes(q) ||
          log.level?.toLowerCase().includes(q) ||
          log.type?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [logs, levelFilter, typeFilter, search, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / LOGS_PER_PAGE)
  );
  const pageStartIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const pageLogs = filteredLogs.slice(
    pageStartIndex,
    pageStartIndex + LOGS_PER_PAGE
  );

  // Get log level color
  const getLevelColor = (level) => {
    switch (level) {
      case LOG_LEVELS.ERROR:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800";
      case LOG_LEVELS.WARN:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case LOG_LEVELS.INFO:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case LOG_LEVELS.DEBUG:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
    }
  };

  // Get log type color
  const getTypeColor = (type) => {
    switch (type) {
      case LOG_TYPES.AUTH:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case LOG_TYPES.PAYMENT:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case LOG_TYPES.COURSE:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case LOG_TYPES.USER:
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case LOG_TYPES.SYSTEM:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case LOG_TYPES.API:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return formatDate(dateString);
  };

  // Clear logs
  const handleClearLogs = () => {
    if (logs.length === 0) return;
    
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Clear All Logs?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This will permanently delete all {logs.length} log entries. This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                if (useMockData || !ClearLogsEndPoint) {
                  // Handle mock clear
                  setLogs([]);
                  toast.success("All logs cleared successfully (demo)");
                } else {
                  try {
                    // Use real API
                    await api.delete(ClearLogsEndPoint);
                    setLogs([]);
                    toast.success("All logs cleared successfully");
                  } catch (err) {
                    console.error("Clear logs failed:", err);
                    toast.error("Failed to clear logs");
                  }
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear All Logs
            </button>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // Export logs
  const handleExportLogs = async () => {
    toast.loading("Preparing export...");
    
    if (useMockData || !ExportLogsEndPoint) {
      // Handle mock export
      setTimeout(() => {
        const csvContent = convertLogsToCSV(filteredLogs);
        downloadCSV(csvContent, `logs-${new Date().toISOString().split('T')[0]}.csv`);
        toast.dismiss();
        toast.success("Logs exported successfully (demo)");
      }, 1000);
      return;
    }

    try {
      // Use real API
      const params = {
        level: levelFilter !== "all" ? levelFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        startDate: dateRange.start,
        endDate: dateRange.end,
        search: search || undefined
      };

      const response = await api.get(ExportLogsEndPoint, { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success("Logs exported successfully");
    } catch (err) {
      console.error("Export failed:", err);
      toast.dismiss();
      toast.error("Failed to export logs");
    }
  };

  // Convert logs to CSV for mock export
  const convertLogsToCSV = (logs) => {
    const headers = ["Timestamp", "Level", "Type", "Message", "User", "Email", "IP", "Action", "Endpoint"];
    const rows = logs.map(log => [
      formatDate(log.timestamp || log.createdAt),
      log.level,
      log.type,
      `"${(log.message || '').replace(/"/g, '""')}"`,
      log.user?.name || "",
      log.user?.email || "",
      log.ip || "",
      log.action || "",
      log.endpoint || ""
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Download CSV
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Refresh logs
  const handleRefresh = () => {
    fetchLogs();
    toast.success("Logs refreshed");
  };

  // Get log statistics
  const getLogStats = useMemo(() => {
    const stats = {
      total: logs.length,
      errors: logs.filter(l => l.level === LOG_LEVELS.ERROR).length,
      warnings: logs.filter(l => l.level === LOG_LEVELS.WARN).length,
      info: logs.filter(l => l.level === LOG_LEVELS.INFO).length,
      debug: logs.filter(l => l.level === LOG_LEVELS.DEBUG).length,
      today: logs.filter(l => {
        const logDate = new Date(l.timestamp || l.createdAt);
        const today = new Date();
        return logDate.toDateString() === today.toDateString();
      }).length
    };
    return stats;
  }, [logs]);

  // Add new log (for testing)
  const handleAddTestLog = () => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: ["info", "warn", "error"][Math.floor(Math.random() * 3)],
      type: Object.values(LOG_TYPES)[Math.floor(Math.random() * Object.values(LOG_TYPES).length)],
      message: `Test log entry #${logs.length + 1} - This is a ${["info", "warning", "error"][Math.floor(Math.random() * 3)]} message for testing`,
      user: {
        id: "test_user",
        name: "Test User",
        email: "test@example.com"
      },
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      action: "test.action",
      endpoint: "/api/test/endpoint",
      method: "GET"
    };
    
    setLogs(prev => [newLog, ...prev]);
    toast.success("Test log added");
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <LandingHeading header="System Logs" />
      
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Monitor system activities, errors, and user actions
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
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Logs</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{getLogStats.total}</p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Errors</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">{getLogStats.errors}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Warnings</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{getLogStats.warnings}</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Today</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">{getLogStats.today}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                placeholder="Search logs by message, user, IP, action, or endpoint..."
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
            {useMockData && (
              <button
                onClick={handleAddTestLog}
                className="px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Test Log
              </button>
            )}

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
              onClick={handleExportLogs}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>

            <button
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                logs.length === 0
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Log Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value={LOG_LEVELS.ERROR}>Error</option>
              <option value={LOG_LEVELS.WARN}>Warning</option>
              <option value={LOG_LEVELS.INFO}>Info</option>
              <option value={LOG_LEVELS.DEBUG}>Debug</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Log Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value={LOG_TYPES.AUTH}>Authentication</option>
              <option value={LOG_TYPES.PAYMENT}>Payment</option>
              <option value={LOG_TYPES.COURSE}>Course</option>
              <option value={LOG_TYPES.USER}>User</option>
              <option value={LOG_TYPES.SYSTEM}>System</option>
              <option value={LOG_TYPES.API}>API</option>
              <option value={LOG_TYPES.OTHER}>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Auto Refresh (10s)
            </label>
            <div className="flex items-center h-[42px]">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRefresh ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRefresh ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {autoRefresh ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {(dateRange.start || dateRange.end) && (
            <div className="flex items-end">
              <button
                onClick={() => setDateRange({ start: "", end: "" })}
                className="px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Dates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pageLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">No logs found</p>
                      <p className="text-sm">Try adjusting your filters or search term</p>
                      {useMockData && logs.length === 0 && (
                        <button
                          onClick={handleAddTestLog}
                          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Demo Logs
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pageLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      log.level === LOG_LEVELS.ERROR ? "bg-red-50/50 dark:bg-red-900/10" : ""
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatRelativeTime(log.timestamp || log.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(log.timestamp || log.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                        {log.type?.charAt(0).toUpperCase() + log.type?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-md truncate">
                        {log.message}
                      </div>
                      {log.action && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Action: {log.action}
                        </div>
                      )}
                      {log.endpoint && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Endpoint: {log.endpoint}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.user?.name || "System"}
                      </div>
                      {log.user?.email && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {log.user.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 dark:text-white">
                        {log.ip || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-xs font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredLogs.length > LOGS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedLog.level)}`}>
                  {selectedLog.level?.toUpperCase()}
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Details</h2>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
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
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedLog.timestamp || selectedLog.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Log Type:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedLog.type)}`}>
                          {selectedLog.type?.charAt(0).toUpperCase() + selectedLog.type?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Log ID:</span>
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {selectedLog.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">User Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">User:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedLog.user?.name || "System"}
                        </span>
                      </div>
                      {selectedLog.user?.email && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedLog.user.email}
                          </span>
                        </div>
                      )}
                      {selectedLog.user?.id && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {selectedLog.user.id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Message</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                      {selectedLog.message}
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Action Details */}
                  {(selectedLog.action || selectedLog.endpoint || selectedLog.method) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Action Details</h3>
                      <div className="space-y-2">
                        {selectedLog.action && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Action:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {selectedLog.action}
                            </span>
                          </div>
                        )}
                        {selectedLog.endpoint && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Endpoint:</span>
                            <span className="font-mono text-sm text-gray-900 dark:text-white break-all">
                              {selectedLog.endpoint}
                            </span>
                          </div>
                        )}
                        {selectedLog.method && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">HTTP Method:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {selectedLog.method}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Network Details */}
                  {(selectedLog.ip || selectedLog.userAgent) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Network Details</h3>
                      <div className="space-y-2">
                        {selectedLog.ip && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">IP Address:</span>
                            <span className="font-mono text-sm text-gray-900 dark:text-white">
                              {selectedLog.ip}
                            </span>
                          </div>
                        )}
                        {selectedLog.userAgent && (
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600 dark:text-gray-400">User Agent:</span>
                            <span className="font-mono text-xs text-gray-900 dark:text-white break-all text-right">
                              {selectedLog.userAgent}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Metadata</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words font-mono">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Error Stack Trace */}
                {selectedLog.stackTrace && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Stack Trace</h3>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words font-mono">
                        {selectedLog.stackTrace}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Log created {formatRelativeTime(selectedLog.timestamp || selectedLog.createdAt)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;