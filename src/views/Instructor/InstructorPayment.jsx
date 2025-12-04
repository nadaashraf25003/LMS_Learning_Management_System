import React, { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

// Mock useNavigate hook
const useNavigate = () => {
  return (path) => {
    console.log("Navigating to:", path);
    toast.success(`Navigating to ${path}`);
  };
};

// Mock ConfirmToast component
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Payout</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{message}</p>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              Confirm Payout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock usePayments hook
const usePayments = () => {
  const mockPayments = [
    {
      id: 1,
      date: "2024-12-15T10:30:00Z",
      description: "Web Development Course Sales",
      amount: 245.75,
      status: "completed",
      type: "course"
    },
    {
      id: 2,
      date: "2024-12-10T14:20:00Z",
      description: "React Advanced Lessons",
      amount: 189.50,
      status: "completed",
      type: "lesson"
    },
    {
      id: 3,
      date: "2024-12-05T09:15:00Z",
      description: "JavaScript Fundamentals",
      amount: 156.25,
      status: "completed",
      type: "course"
    },
    {
      id: 4,
      date: "2024-12-01T16:45:00Z",
      description: "December Monthly Earnings",
      amount: 420.80,
      status: "pending",
      type: "monthly"
    },
    {
      id: 5,
      date: "2024-11-28T11:10:00Z",
      description: "Node.js Masterclass",
      amount: 299.99,
      status: "completed",
      type: "course"
    },
    {
      id: 6,
      date: "2024-11-25T13:30:00Z",
      description: "Payout Request #001",
      amount: 350.00,
      status: "completed",
      type: "payout"
    },
    {
      id: 7,
      date: "2024-11-20T15:45:00Z",
      description: "Python Data Science",
      amount: 189.75,
      status: "pending",
      type: "course"
    },
    {
      id: 8,
      date: "2024-11-15T10:00:00Z",
      description: "Payout Request #002",
      amount: 275.50,
      status: "pending",
      type: "payout"
    }
  ];

  const [payments, setPayments] = useState(mockPayments);
  const [isLoading, setIsLoading] = useState(false);

  const getPayments = () => {
    return { data: { payments }, isLoading };
  };

  const requestPayoutMutation = {
    mutateAsync: async ({ amount }) => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setTimeout(() => {
          const newPayout = {
            id: payments.length + 1,
            date: new Date().toISOString(),
            description: `Payout Request #${(payments.filter(p => p.type === 'payout').length + 1).toString().padStart(3, '0')}`,
            amount: amount,
            status: "pending",
            type: "payout"
          };
          
          const updatedPayments = payments.map(payment => 
            payment.status === "pending" && payment.type !== "payout" 
              ? { ...payment, status: "completed" }
              : payment
          );
          
          updatedPayments.push(newPayout);
          setPayments(updatedPayments);
          setIsLoading(false);
          resolve({ success: true, payout: newPayout });
        }, 1500);
      });
    }
  };

  return {
    getPayments,
    requestPayoutMutation
  };
};

// Main Component
export default function InstructorPayments() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { getPayments, requestPayoutMutation } = usePayments();
  const { data: paymentsData, isLoading } = getPayments();

  const payments = paymentsData?.payments || [];
  
  const totalEarnings = useMemo(() => {
    return payments
      .filter(p => p.type !== "payout")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }, [payments]);
  
  const pendingBalance = useMemo(() => {
    return payments
      .filter(p => p.status === "pending" && p.type !== "payout")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);
  
  const completedEarnings = useMemo(() => {
    return payments
      .filter(p => p.status === "completed" && p.type !== "payout")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  const handleRequestPayout = () => {
    if (pendingBalance <= 0) {
      toast.error("No pending balance available for payout.");
      return;
    }
    
    toast.custom((t) => (
      <ConfirmToast
        message={`Request payout for $${pendingBalance.toFixed(2)}? This will process all pending earnings.`}
        onConfirm={async () => {
          try {
            await requestPayoutMutation.mutateAsync({ amount: pendingBalance });
            toast.success("Payout requested successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to request payout.");
          }
          toast.dismiss(t.id);
        }}
        onCancel={() => {
          toast.dismiss(t.id);
        }}
      />
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
        }}
      />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings & Payments</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Track your earnings and manage payouts</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {pendingBalance > 0 && (
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-2"
                  onClick={handleRequestPayout}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Request Payout (${pendingBalance.toFixed(2)})
                </button>
              )}
              <button
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                onClick={() => navigate("/InstructorLayout/PaymentSettings")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Payment Settings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pending Balance</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{formatCurrency(pendingBalance)}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Completed Payouts</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(completedEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card with Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {[
                { id: "overview", label: "Overview" },
                { id: "history", label: "Payment History" },
                { id: "requests", label: "Payout Requests" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                    currentTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setCurrentTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {currentTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Earnings Overview</h2>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Export Report
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Earnings Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Course Sales</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">70% of total earnings</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalEarnings * 0.7)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Quizzes</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">20% of total earnings</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalEarnings * 0.2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Other Sources</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">10% of total earnings</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalEarnings * 0.1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payout Schedule</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Next Scheduled Payout</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Payouts are processed twice monthly</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600 dark:text-blue-400">January 1, 2025</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">in 12 days</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Minimum Payout Threshold</span>
                            <span className="font-medium text-gray-900 dark:text-white">$50.00</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                            <span className="font-medium text-gray-900 dark:text-white">15%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                            <span className="font-medium text-gray-900 dark:text-white">3-5 business days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {pendingBalance > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Ready to Withdraw</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{formatCurrency(pendingBalance)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available for immediate payout</p>
                          </div>
                          <button
                            className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 dark:hover:from-yellow-500 dark:hover:to-orange-500 transition-all"
                            onClick={handleRequestPayout}
                          >
                            Request Payout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {currentTab === "history" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment History</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Export CSV
                    </button>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm">
                      <option>All Time</option>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>2024</option>
                    </select>
                  </div>
                </div>
                
                {payments.filter(p => p.type !== "payout").length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {payments
                          .filter(p => p.type !== "payout")
                          .map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {formatDate(payment.date)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                {payment.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                  {payment.type}
                                </span>
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
                    <p className="text-gray-600 dark:text-gray-400">Your earnings will appear here once you start making sales.</p>
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {currentTab === "requests" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payout Requests</h2>
                  {pendingBalance > 0 && (
                    <button
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
                      onClick={handleRequestPayout}
                    >
                      New Payout Request
                    </button>
                  )}
                </div>
                
                {payments.filter(p => p.type === "payout").length > 0 ? (
                  <div className="grid gap-4">
                    {payments
                      .filter(p => p.type === "payout")
                      .map((request) => (
                        <div key={request.id} className="bg-white dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-sm dark:hover:shadow-gray-800 transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                request.status === "completed" ? "bg-green-100 dark:bg-green-900/30" :
                                request.status === "pending" ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-100 dark:bg-gray-700"
                              }`}>
                                <svg className={`w-6 h-6 ${
                                  request.status === "completed" ? "text-green-600 dark:text-green-400" :
                                  request.status === "pending" ? "text-yellow-600 dark:text-yellow-400" : "text-gray-600 dark:text-gray-400"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{request.description}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Requested on {formatDate(request.date)}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(request.amount)}</p>
                              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                                request.status === "completed"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                  : request.status === "pending"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {request.status === "pending" && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated processing time: 3-5 business days</p>
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                  View Details
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Payout Requests</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't made any payout requests yet.</p>
                    {pendingBalance > 0 && (
                      <button
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
                        onClick={handleRequestPayout}
                      >
                        Request Your First Payout
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
                          <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">PayPal</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tax Information</p>
                    <p className="font-medium text-gray-900 dark:text-white mt-2">W-9 Form Submitted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tax rate: 10%</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payout Threshold</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$50.00</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Minimum balance required for payout</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Payout</p>
                    <p className="font-medium text-gray-900 dark:text-white mt-2">{formatDate(payments.find(p => p.type === "payout" && p.status === "completed")?.date) || "N/A"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View all payouts in History</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {pendingBalance > 0 && (
                  <button
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
                    onClick={handleRequestPayout}
                  >
                    Request Payout
                  </button>
                )}
                <button
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => navigate("/InstructorLayout/PaymentSettings")}
                >
                  Update Payment Method
                </button>
                <button
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => window.print()}
                >
                  Download Statements
                </button>
                <button
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => navigate("/InstructorLayout/TaxDocuments")}
                >
                  Tax Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}