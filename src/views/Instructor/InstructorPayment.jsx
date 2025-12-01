import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import usePayments from "@/hooks/usePayments"; // Assuming a custom hook similar to useLesson
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";

export default function InstructorPayments() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");

  const { getPayments, requestPayoutMutation } = usePayments();
  const { data: paymentsData, isLoading } = getPayments();

  const payments = paymentsData?.payments || [];
  const totalEarnings = useMemo(() => {
    return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }, [payments]);
  const pendingBalance = useMemo(() => {
    return payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);
  const completedEarnings = useMemo(() => {
    return payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card prose">Loading payments...</div>
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
        message={`Request payout for $${pendingBalance.toFixed(2)}? This action cannot be undone.`}
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
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster position="top-center" />
      <div className="custom-container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Earnings & Payments</h1>
          <div className="flex flex-wrap gap-3">
            {pendingBalance > 0 && (
              <button
                className="btn btn-primary btn-hover"
                onClick={handleRequestPayout}
              >
                Request Payout (${pendingBalance.toFixed(2)})
              </button>
            )}
            <button
              className="btn btn-secondary btn-hover"
              onClick={() => navigate("/InstructorLayout/PaymentSettings")}
            >
              Payment Settings
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Total Earnings</h3>
            <p className="text-3xl font-bold text-secondary mt-2">{formatCurrency(totalEarnings)}</p>
          </div>
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Pending Balance</h3>
            <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(pendingBalance)}</p>
          </div>
          <div className="card p-6 text-center border border-border">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">Completed Payouts</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(completedEarnings)}</p>
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
                currentTab === "history"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("history")}
            >
              Payment History
            </button>
            <button
              className={`pb-2 font-semibold transition-colors duration-200 ${
                currentTab === "requests"
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setCurrentTab("requests")}
            >
              Payout Requests
            </button>
          </div>

          {currentTab === "overview" && (
            <div className="prose mt-4 text-text-secondary">
              <p className="text-lg font-medium text-text-primary mb-4">Payment Summary</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Earnings Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lessons Sold</span>
                      <span>{formatCurrency(totalEarnings * 0.7)}</span> {/* Assuming 70% instructor share */}
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes Completed</span>
                      <span>{formatCurrency(totalEarnings * 0.3)}</span> {/* Placeholder */}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Next Payout</h4>
                  <p className="text-sm">Payouts processed on the 1st and 15th of each month.</p>
                  <p className="text-sm text-primary mt-1">Next: January 1, 2026</p>
                </div>
              </div>
              {pendingBalance > 0 && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-text-primary font-medium">Ready to withdraw: {formatCurrency(pendingBalance)}</p>
                  <button
                    className="btn btn-primary btn-hover mt-2"
                    onClick={handleRequestPayout}
                  >
                    Request Payout Now
                  </button>
                </div>
              )}
            </div>
          )}

          {currentTab === "history" && (
            <div className="space-y-3 mt-4">
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border dark:bg-card">
                      {payments.map((payment, index) => (
                        <tr key={index} className="hover:bg-muted">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                            {formatDate(payment.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                            {payment.description || "Lesson sale"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                              }`}
                            >
                              {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">No payment history available.</p>
                </div>
              )}
            </div>
          )}

          {currentTab === "requests" && (
            <div className="space-y-3 mt-4">
              {payments.filter((p) => p.type === "payout").length > 0 ? (
                <ul className="space-y-2">
                  {payments
                    .filter((p) => p.type === "payout")
                    .map((request, index) => (
                      <li
                        key={index}
                        className="card p-4 border border-border hover:bg-muted transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-text-primary">Payout #{index + 1}</h3>
                            <p className="text-sm text-text-secondary">{formatDate(request.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-text-primary">{formatCurrency(request.amount)}</p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 block ${
                                request.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                              }`}
                            >
                              {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">No payout requests yet.</p>
                  {pendingBalance > 0 && (
                    <button
                      className="btn btn-primary btn-hover"
                      onClick={handleRequestPayout}
                    >
                      Request First Payout
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 space-y-4 border border-border lg:col-span-2">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Payment Method</p>
                <p className="font-medium text-text-primary">PayPal (ending in ****1234)</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Threshold</p>
                <p className="font-medium text-text-primary">$50.00</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Tax Rate</p>
                <p className="font-medium text-text-primary">10%</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Last Payout</p>
                <p className="font-medium text-text-primary">{formatDate(payments[0]?.date) || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 space-y-4 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {pendingBalance > 0 && (
                <button
                  className="w-full btn btn-primary btn-hover"
                  onClick={handleRequestPayout}
                >
                  Request Payout
                </button>
              )}
              <button
                className="w-full btn btn-secondary btn-hover"
                onClick={() => navigate("/InstructorLayout/PaymentSettings")}
              >
                Update Payment Info
              </button>
              <button
                className="w-full btn bg-transparent border border-input text-text-primary btn-hover"
                onClick={() => window.print()}
              >
                Export History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}