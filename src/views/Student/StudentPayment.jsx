import React, { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

// Mock router hooks
const useNavigate = () => {
  return (path) => {
    console.log("Navigating to:", path);
    toast.success(`Navigating to ${path}`);
  };
};

// Mock useStudent hook
const useMockStudent = () => {
  const [state] = useState({
    student: {
      id: "stu_12345",
      name: "Alex Johnson",
      email: "alex.johnson@student.com",
      enrollmentDate: "2024-09-01",
      status: "active",
      paymentMethod: {
        type: "credit_card",
        lastFour: "4242",
        brand: "visa",
        expiry: "12/26"
      }
    },
    isLoading: false
  });

  return state;
};

// Mock usePayments hook
const useMockPayments = () => {
  const [payments, setPayments] = useState([
    {
      id: "inv_001",
      type: "course_payment",
      description: "Advanced Web Development Course",
      amount: 299.99,
      date: "2024-12-15T10:30:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "course_fee"
    },
    {
      id: "inv_002",
      type: "subscription",
      description: "Monthly Learning Subscription - December",
      amount: 49.99,
      date: "2024-12-01T14:20:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "subscription"
    },
    {
      id: "inv_003",
      type: "course_payment",
      description: "Data Science Bootcamp",
      amount: 499.99,
      date: "2024-11-20T09:15:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "course_fee"
    },
    {
      id: "inv_004",
      type: "certification",
      description: "Web Developer Certification Fee",
      amount: 149.99,
      date: "2024-11-10T16:45:00Z",
      status: "pending",
      receiptUrl: "#",
      category: "certification"
    },
    {
      id: "inv_005",
      type: "subscription",
      description: "Monthly Learning Subscription - November",
      amount: 49.99,
      date: "2024-11-01T11:10:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "subscription"
    },
    {
      id: "inv_006",
      type: "course_payment",
      description: "React Masterclass",
      amount: 199.99,
      date: "2024-10-25T13:30:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "course_fee"
    },
    {
      id: "inv_007",
      type: "refund",
      description: "Refund: JavaScript Basics Course",
      amount: -89.99,
      date: "2024-10-20T15:45:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "refund"
    },
    {
      id: "inv_008",
      type: "course_payment",
      description: "Python for Beginners",
      amount: 149.99,
      date: "2024-10-15T10:00:00Z",
      status: "completed",
      receiptUrl: "#",
      category: "course_fee"
    }
  ]);

  const [upcomingPayments, setUpcomingPayments] = useState([
    {
      id: "upcoming_001",
      description: "Monthly Learning Subscription - January",
      amount: 49.99,
      dueDate: "2025-01-01",
      status: "scheduled",
      autoPay: true
    },
    {
      id: "upcoming_002",
      description: "Advanced React Course",
      amount: 299.99,
      dueDate: "2025-01-15",
      status: "pending_confirmation",
      autoPay: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm_001",
      type: "credit_card",
      brand: "visa",
      lastFour: "4242",
      expiry: "12/26",
      isDefault: true,
      addedOn: "2024-09-01"
    },
    {
      id: "pm_002",
      type: "credit_card",
      brand: "mastercard",
      lastFour: "8888",
      expiry: "08/25",
      isDefault: false,
      addedOn: "2024-10-15"
    },
    {
      id: "pm_003",
      type: "paypal",
      brand: "paypal",
      lastFour: null,
      expiry: null,
      isDefault: false,
      addedOn: "2024-11-20"
    }
  ]);

  return {
    payments,
    upcomingPayments,
    paymentMethods,
    setPaymentMethods
  };
};

// Mock useSubscription hook
const useMockSubscription = () => {
  const [subscription] = useState({
    plan: "Pro Monthly",
    price: 49.99,
    billingCycle: "monthly",
    nextBillingDate: "2025-01-01",
    status: "active",
    autoRenew: true,
    features: [
      "Access to all courses",
      "Certificate upon completion",
      "Priority support",
      "Downloadable resources"
    ]
  });

  return { subscription };
};

// Confirm Toast Component
const ConfirmToast = ({ message, onConfirm, onCancel, darkMode }) => {
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
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
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component - Student Payments
export default function StudentPayments() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Use mock hooks
  const student = useMockStudent();
  const paymentsHooks = useMockPayments();
  const subscriptionHooks = useMockSubscription();
  
  const payments = paymentsHooks.payments || [];
  const upcomingPayments = paymentsHooks.upcomingPayments || [];
  const paymentMethods = paymentsHooks.paymentMethods || [];
  const subscription = subscriptionHooks.subscription;

  const isLoading = student.isLoading;

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    const totalPaid = payments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingPayments = payments
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const upcomingAmount = upcomingPayments
      .filter(p => p.status === "scheduled")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const refunds = payments
      .filter(p => p.category === "refund")
      .reduce((sum, p) => sum + Math.abs(p.amount), 0);
    
    return {
      totalPaid,
      pendingPayments,
      upcomingAmount,
      refunds,
      totalTransactions: payments.length
    };
  }, [payments, upcomingPayments]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format payment type
  const formatPaymentType = (type) => {
    const types = {
      "course_payment": "Course Payment",
      "subscription": "Subscription",
      "certification": "Certification Fee",
      "refund": "Refund",
      "other": "Other"
    };
    return types[type] || type;
  };

  // Get payment icon
  const getPaymentIcon = (type) => {
    const icons = {
      "course_payment": "📚",
      "subscription": "🔄",
      "certification": "🏆",
      "refund": "💰",
      "other": "💳"
    };
    return icons[type] || "💳";
  };

  // Get card brand icon
  const getCardBrandIcon = (brand) => {
    const icons = {
      "visa": "🔵",
      "mastercard": "🔴",
      "amex": "🔷",
      "discover": "🟠",
      "paypal": "🔵"
    };
    return icons[brand] || "💳";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Event handlers
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    toast.success("Opening receipt...");
  };

  const handleDownloadReceipt = (payment) => {
    toast.success("Downloading receipt...");
  };

  const handleMakePayment = () => {
    toast.custom((t) => (
      <ConfirmToast
        message="Proceed with payment of $49.99 for your subscription renewal?"
        onConfirm={() => {
          toast.success("Payment processed successfully!");
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
        darkMode={darkMode}
      />
    ));
  };

  const handleAddCard = () => {
    setShowAddCard(true);
    toast.success("Add new card form opened");
  };

  const handleSetDefault = (methodId) => {
    toast.success("Payment method set as default");
  };

  const handleRemoveMethod = (methodId) => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to remove this payment method?"
        onConfirm={() => {
          toast.success("Payment method removed");
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
        darkMode={darkMode}
      />
    ));
  };

  const handleToggleAutoPay = (upcomingId) => {
    toast.success("Auto-pay setting updated");
  };

  const handleCancelSubscription = () => {
    toast.custom((t) => (
      <ConfirmToast
        message="Are you sure you want to cancel your subscription? You'll lose access to premium features."
        onConfirm={() => {
          toast.success("Subscription cancelled. Access continues until end of billing period.");
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
        darkMode={darkMode}
      />
    ));
  };

  // THE ACTUAL UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Payments & Billing
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your payments, view history, and update billing information
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleMakePayment}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Make a Payment
              </button>
              <button
                onClick={handleAddCard}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(paymentStats.totalPaid)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{formatCurrency(paymentStats.pendingPayments)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(paymentStats.upcomingAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Refunds</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{formatCurrency(paymentStats.refunds)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  {[
                    { id: "overview", label: "Overview", icon: "📊" },
                    { id: "history", label: "Payment History", icon: "📋" },
                    { id: "upcoming", label: "Upcoming Payments", icon: "📅" },
                    { id: "methods", label: "Payment Methods", icon: "💳" },
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

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {currentTab === "overview" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Overview</h3>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Export Statement
                      </button>
                    </div>
                    
                    {/* Recent Payments */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Payments</h4>
                      <div className="space-y-4">
                        {payments.slice(0, 3).map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-lg">{getPaymentIcon(payment.type)}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{payment.description}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(payment.date)} • {formatPaymentType(payment.type)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${payment.amount < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {formatCurrency(payment.amount)}
                              </div>
                              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                payment.status === "completed"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Payments */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Payments</h4>
                      <div className="space-y-4">
                        {upcomingPayments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{payment.description}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Due: {formatDate(payment.dueDate)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {formatCurrency(payment.amount)}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  onClick={() => handleToggleAutoPay(payment.id)}
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                    payment.autoPay
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                  }`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-current"></span>
                                  {payment.autoPay ? "Auto-pay ON" : "Auto-pay OFF"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Methods Preview */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {paymentMethods.slice(0, 2).map((method) => (
                          <div key={method.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{getCardBrandIcon(method.brand)}</span>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}
                                    {method.lastFour && ` •••• ${method.lastFour}`}
                                  </div>
                                  {method.expiry && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Expires {method.expiry}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {method.isDefault && (
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSetDefault(method.id)}
                                className="flex-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                Set as Default
                              </button>
                              <button
                                onClick={() => handleRemoveMethod(method.id)}
                                className="flex-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {currentTab === "history" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment History</h3>
                      <div className="flex items-center gap-3">
                        <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm">
                          <option>All Time</option>
                          <option>Last 30 Days</option>
                          <option>Last 90 Days</option>
                          <option>2024</option>
                        </select>
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>
                    
                    {payments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {payments.map((payment) => (
                              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  {formatDate(payment.date)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                  {payment.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span>{getPaymentIcon(payment.type)}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatPaymentType(payment.type)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                  {formatCurrency(payment.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    payment.status === "completed"
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                      : payment.status === "pending"
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                  }`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleViewReceipt(payment)}
                                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() => handleDownloadReceipt(payment)}
                                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium"
                                    >
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Payment History</h3>
                        <p className="text-gray-600 dark:text-gray-400">Your payment history will appear here.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Upcoming Tab */}
                {currentTab === "upcoming" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming & Scheduled Payments</h3>
                      <button
                        onClick={handleMakePayment}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Pay All Upcoming
                      </button>
                    </div>
                    
                    {upcomingPayments.length > 0 ? (
                      <div className="grid gap-6">
                        {upcomingPayments.map((payment) => (
                          <div key={payment.id} className="bg-white dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">{payment.description}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Due on {formatDate(payment.dueDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                                  payment.status === "scheduled"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                }`}>
                                  {payment.status === "scheduled" ? "Scheduled" : "Pending Confirmation"}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${payment.autoPay ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {payment.autoPay ? "Auto-pay enabled" : "Auto-pay disabled"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleToggleAutoPay(payment.id)}
                                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  {payment.autoPay ? "Disable Auto-pay" : "Enable Auto-pay"}
                                </button>
                                <button
                                  onClick={handleMakePayment}
                                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                  Pay Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Upcoming Payments</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">You have no scheduled payments at this time.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Methods Tab */}
                {currentTab === "methods" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h3>
                      <button
                        onClick={handleAddCard}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Add New Method
                      </button>
                    </div>
                    
                    <div className="grid gap-6">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="bg-white dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">{getCardBrandIcon(method.brand)}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">
                                  {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}
                                  {method.lastFour && ` •••• ${method.lastFour}`}
                                </h4>
                                <div className="flex items-center gap-4 mt-2">
                                  {method.expiry && (
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Expires {method.expiry}
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Added {formatDate(method.addedOn)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              {method.isDefault && (
                                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                  Default Payment Method
                                </span>
                              )}
                              <div className="flex gap-2">
                                {!method.isDefault && (
                                  <button
                                    onClick={() => handleSetDefault(method.id)}
                                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    Set as Default
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveMethod(method.id)}
                                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Card Form (Conditional) */}
                    {showAddCard && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Add New Payment Method</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Card Number
                              </label>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  CVC
                                </label>
                                <input
                                  type="text"
                                  placeholder="123"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Zip/Postal Code
                              </label>
                              <input
                                type="text"
                                placeholder="12345"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <input type="checkbox" id="setDefault" className="rounded" />
                              <label htmlFor="setDefault" className="text-sm text-gray-700 dark:text-gray-300">
                                Set as default payment method
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setShowAddCard(false)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setShowAddCard(false);
                              toast.success("Payment method added successfully!");
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            Add Payment Method
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Your Subscription</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{subscription.plan}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Price</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(subscription.price)}/{subscription.billingCycle}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{subscription.status}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Next Billing</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatDate(subscription.nextBillingDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Auto Renew</span>
                  <span className={`font-semibold ${subscription.autoRenew ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {subscription.autoRenew ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleMakePayment}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                >
                  Make a Payment
                </button>
                <button
                  onClick={handleAddCard}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Add Payment Method
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Download Statements
                </button>
                <button
                  onClick={() => navigate("/StudentLayout/BillingSettings")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Billing Settings
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our support team is here to help with any billing questions.
                </p>
                <button
                  onClick={() => navigate("/StudentLayout/Support")}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}