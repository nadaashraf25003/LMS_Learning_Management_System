import { useEffect, useMemo, useState } from "react";
import api from "@/API/Config";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import Urls from "@/API/URL";
import DefaultImage from "../../../public/images/default-avatar.png";

// Endpoints 
const GetPaymentsEndPoint = Urls.getPayments || "Admin/get-payments";
const UpdatePaymentStatusEndPoint = Urls.updatePaymentStatus || "Admin/update-payment-status";
const DeletePaymentEndPoint = Urls.deletePayment || "Admin/delete-payment";
const GetPaymentStatsEndPoint = Urls.getPaymentStats || "Admin/get-payment-stats";

const PAYMENTS_PER_PAGE = 10;
const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded"
};

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    refundedPayments: 0
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fetch payments data
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = () => {
    setLoading(true);
    api
      .get(GetPaymentsEndPoint)
      .then((res) => {
        const data = res.data.payments || res.data || [];
        setPayments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching payments:", err);
        toast.error("Failed to fetch payments");
        setPayments([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchStats = () => {
    api
      .get(GetPaymentStatsEndPoint)
      .then((res) => {
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        // If stats endpoint fails, calculate from payments
        if (payments.length > 0) {
          calculateStatsFromPayments();
        }
      });
  };

  const calculateStatsFromPayments = () => {
    const calculatedStats = {
      totalPayments: payments.length,
      totalRevenue: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
      pendingPayments: payments.filter(p => p.status === PAYMENT_STATUS.PENDING).length,
      completedPayments: payments.filter(p => p.status === PAYMENT_STATUS.COMPLETED).length,
      failedPayments: payments.filter(p => p.status === PAYMENT_STATUS.FAILED).length,
      refundedPayments: payments.filter(p => p.status === PAYMENT_STATUS.REFUNDED).length
    };
    setStats(calculatedStats);
  };

  // Reset page on filter/search
  useEffect(() => setCurrentPage(1), [filter, search, dateRange]);

  // Calculate stats when payments change
  useEffect(() => {
    if (payments.length > 0) {
      calculateStatsFromPayments();
    }
  }, [payments]);

  // Filtered + searched payments
  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(payment => payment.status === filter);
    }

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt || payment.date);
        paymentDate.setHours(0, 0, 0, 0);
        return paymentDate >= startDate;
      });
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt || payment.date);
        return paymentDate <= endDate;
      });
    }

    // Apply search filter
    const q = search.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (payment) =>
          payment.user?.name?.toLowerCase().includes(q) ||
          payment.user?.email?.toLowerCase().includes(q) ||
          payment.transactionId?.toLowerCase().includes(q) ||
          payment.course?.title?.toLowerCase().includes(q) ||
          payment.id?.toString().includes(q)
      );
    }

    return filtered;
  }, [payments, filter, search, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE)
  );
  const pageStartIndex = (currentPage - 1) * PAYMENTS_PER_PAGE;
  const pagePayments = filteredPayments.slice(
    pageStartIndex,
    pageStartIndex + PAYMENTS_PER_PAGE
  );

  // Update payment status
  const handleUpdateStatus = (payment, newStatus) => {
    const oldStatus = payment.status;
    
    toast.custom((t) => (
      <ConfirmToast
        message={`Change status of payment #${payment.transactionId || payment.id} from ${oldStatus} to ${newStatus}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          api
            .put(`${UpdatePaymentStatusEndPoint}/${payment.id}`, { status: newStatus })
            .then(() => {
              setPayments((prev) =>
                prev.map((p) =>
                  p.id === payment.id ? { ...p, status: newStatus } : p
                )
              );
              toast.success(`Payment status updated to ${newStatus}`);
              
              // Update stats
              setStats(prev => ({
                ...prev,
                [`${oldStatus}Payments`]: Math.max(0, prev[`${oldStatus}Payments`] - 1),
                [`${newStatus}Payments`]: prev[`${newStatus}Payments`] + 1
              }));
            })
            .catch((err) => {
              console.error("Update failed:", err);
              toast.error("Failed to update payment status");
            });
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  // Delete payment
  const handleDelete = (payment) => {
    toast.custom((t) => (
      <ConfirmToast
        message={`Delete payment #${payment.transactionId || payment.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
        onConfirm={() => {
          api
            .delete(`${DeletePaymentEndPoint}/${payment.id}`)
            .then(() => {
              setPayments((prev) => prev.filter((p) => p.id !== payment.id));
              toast.success(`Payment deleted successfully`);
              
              // Update stats
              const statusKey = `${payment.status}Payments`;
              setStats(prev => ({
                ...prev,
                totalPayments: prev.totalPayments - 1,
                totalRevenue: prev.totalRevenue - (parseFloat(payment.amount) || 0),
                [statusKey]: Math.max(0, prev[statusKey] - 1)
              }));
            })
            .catch((err) => {
              console.error("Delete failed:", err);
              toast.error("Failed to delete payment");
            });
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
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
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800";
      case PAYMENT_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case PAYMENT_STATUS.FAILED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800";
      case PAYMENT_STATUS.REFUNDED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
    }
  };

  // Handle export payments
  const handleExportPayments = () => {
    toast.loading("Preparing export...");
    api
      .get(Urls.exportPayments || "Admin/export-payments", {
        params: {
          filter,
          startDate: dateRange.start,
          endDate: dateRange.end,
          search
        },
        responseType: 'blob'
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `payments-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.dismiss();
        toast.success("Payments exported successfully");
      })
      .catch((err) => {
        console.error("Export failed:", err);
        toast.dismiss();
        toast.error("Failed to export payments");
      });
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <LandingHeading header="Payments Management" />
      
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Manage and monitor all payment transactions in your system
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Payments</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalPayments}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingPayments}</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completedPayments}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                placeholder="Search payments by user, email, transaction ID, or course..."
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Status:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Payments</option>
                <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                <option value={PAYMENT_STATUS.COMPLETED}>Completed</option>
                <option value={PAYMENT_STATUS.FAILED}>Failed</option>
                <option value={PAYMENT_STATUS.REFUNDED}>Refunded</option>
              </select>
            </div>

            <button
              onClick={handleExportPayments}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
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
                className="px-4 py-2.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
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

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
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
              {pagePayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">No payments found</p>
                      <p className="text-sm">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pagePayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                        {payment.transactionId || payment.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                            src={payment.user?.avatar || payment.user?.profileImage || DefaultImage}
                            alt={payment.user?.name}
                            onError={(e) => {
                              e.target.src = DefaultImage;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.user?.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {payment.user?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white max-w-[200px] truncate">
                        {payment.course?.title || "Unknown Course"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.course?.category || "Uncategorized"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-xs font-medium"
                        >
                          View
                        </button>
                        
                        {payment.status !== PAYMENT_STATUS.COMPLETED && payment.status !== PAYMENT_STATUS.REFUNDED && (
                          <button
                            onClick={() => handleUpdateStatus(payment, PAYMENT_STATUS.COMPLETED)}
                            className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-xs font-medium"
                          >
                            Complete
                          </button>
                        )}
                        
                        {payment.status === PAYMENT_STATUS.COMPLETED && (
                          <button
                            onClick={() => handleUpdateStatus(payment, PAYMENT_STATUS.REFUNDED)}
                            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-xs font-medium"
                          >
                            Refund
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(payment)}
                          className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
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
      {filteredPayments.length > PAYMENTS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* View Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Transaction: {selectedPayment.transactionId || selectedPayment.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">User Information</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <img
                        className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        src={selectedPayment.user?.avatar || selectedPayment.user?.profileImage || DefaultImage}
                        alt={selectedPayment.user?.name}
                        onError={(e) => {
                          e.target.src = DefaultImage;
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.user?.name || "Unknown User"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPayment.user?.email || "No email"}</p>
                        {selectedPayment.user?.phone && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPayment.user.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Course Information</h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.course?.title || "Unknown Course"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{selectedPayment.course?.category || "Uncategorized"}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{selectedPayment.course?.hours || 0} hours</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(selectedPayment.course?.price || selectedPayment.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                        <span className="font-bold text-xl text-green-600">
                          {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayment.status)}`}>
                          {selectedPayment.status?.charAt(0).toUpperCase() + selectedPayment.status?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                        <span className="font-medium">{selectedPayment.paymentMethod || "Credit Card"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium">{formatDate(selectedPayment.createdAt)}</span>
                      </div>
                      {selectedPayment.updatedAt && selectedPayment.updatedAt !== selectedPayment.createdAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                          <span className="font-medium">{formatDate(selectedPayment.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {selectedPayment.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">{selectedPayment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              {selectedPayment.status !== PAYMENT_STATUS.COMPLETED && selectedPayment.status !== PAYMENT_STATUS.REFUNDED && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedPayment, PAYMENT_STATUS.COMPLETED);
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;