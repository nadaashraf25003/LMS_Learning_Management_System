import { useState } from "react";
import { Toaster } from "react-hot-toast";
import LandingHeading from "./LandingHeading"; // عدلي المسار حسب مشروعك
import Pagination from "./Pagination"; // عدلي المسار حسب مشروعك

function AdminPayments() {
  // -----------------------
  // State variables
  // -----------------------
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending");
  const [pagePayments, setPagePayments] = useState([
    // مثال بيانات وهمية
    {
      id: 1,
      transactionId: "TX12345678",
      instructorName: "John Doe",
      instructorEmail: "john@example.com",
      courseTitle: "React Basics",
      amount: 50,
      date: "2025-11-30T12:00:00Z",
      status: "pending",
      notes: "Urgent payment",
    },
    {
      id: 2,
      transactionId: "TX87654321",
      instructorName: "Jane Smith",
      instructorEmail: "jane@example.com",
      courseTitle: "Advanced JS",
      amount: 75,
      date: "2025-11-28T10:00:00Z",
      status: "approved",
    },
  ]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  // -----------------------
  // Helper functions
  // -----------------------
  const handleApprove = (payment) => {
    alert(`Approved payment: ${payment.transactionId}`);
    setPagePayments((prev) =>
      prev.map((p) =>
        p.id === payment.id ? { ...p, status: "approved" } : p
      )
    );
  };

  const handleReject = (payment) => {
    alert(`Rejected payment: ${payment.transactionId}`);
    setPagePayments((prev) =>
      prev.map((p) =>
        p.id === payment.id ? { ...p, status: "rejected" } : p
      )
    );
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // -----------------------
  // JSX Return
  // -----------------------
  return (
    <div className="p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <LandingHeading header="Payments Management" />

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by instructor, transaction ID, or course..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
        />

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Show:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="pending">Pending Payments</option>
            <option value="processed">Processed Payments</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Transaction ID</th>
              <th className="px-4 py-2 text-left">Instructor</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagePayments.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No payments found.
                </td>
              </tr>
            ) : (
              pagePayments.map((payment, idx) => (
                <tr
                  key={payment.id ?? idx}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {payment.transactionId?.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{payment.instructorName}</div>
                      <div className="text-xs text-gray-500">
                        {payment.instructorEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate">
                    {payment.courseTitle}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3">{formatDate(payment.date)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      className="px-2 py-1 text-xs bg-primary text-white rounded-md hover:bg-blue-600"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      View
                    </button>
                    {payment.status === "pending" && (
                      <>
                        <button
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
                          onClick={() => handleApprove(payment)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 text-xs bg-secondary text-white rounded-md hover:bg-red-600"
                          onClick={() => handleReject(payment)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="sm:hidden space-y-4">
        {pagePayments.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            No payments found.
          </div>
        ) : (
          pagePayments.map((payment, idx) => (
            <div
              key={payment.id ?? idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{payment.instructorName}</h3>
                  <p className="text-xs text-gray-500">{payment.instructorEmail}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : payment.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium truncate max-w-[150px]">{payment.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDate(payment.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs">{payment.transactionId?.slice(0, 8)}...</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-blue-600"
                  onClick={() => setSelectedPayment(payment)}
                >
                  View
                </button>
                {payment.status === "pending" && (
                  <>
                    <button
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
                      onClick={() => handleApprove(payment)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 text-xs bg-secondary text-white rounded-md hover:bg-red-600"
                      onClick={() => handleReject(payment)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Payment Modal */}
      {selectedPayment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="bg-surface dark:bg-card rounded-lg shadow-lg w-[400px] max-w-[90vw] p-6 relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-muted-foreground hover:text-destructive transition-colors duration-200 p-1 rounded-full hover:bg-muted/50"
              onClick={() => setSelectedPayment(null)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                Payment Details
              </h2>
              <p className="text-primary text-sm">{selectedPayment.transactionId}</p>
            </div>

            {/* Payment Details */}
            <div className="mt-4 space-y-3 text-sm text-text-secondary">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Instructor:</span>
                <span>{selectedPayment.instructorName}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Email:</span>
                <span>{selectedPayment.instructorEmail}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Course:</span>
                <span className="text-right max-w-[200px] truncate">
                  {selectedPayment.courseTitle}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Amount:</span>
                <span className="text-text-primary font-semibold">
                  {formatCurrency(selectedPayment.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Date:</span>
                <span>{formatDate(selectedPayment.date)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    selectedPayment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedPayment.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedPayment.status}
                </span>
              </div>

              {selectedPayment.notes && (
                <div className="py-2">
                  <span className="font-medium block mb-2">Notes:</span>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedPayment.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 border border-border"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>

              {selectedPayment.status === "pending" && (
                <>
                  <button
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                    onClick={() => {
                      handleApprove(selectedPayment);
                      setSelectedPayment(null);
                    }}
                  >
                    Approve Payment
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-secondary text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    onClick={() => {
                      handleReject(selectedPayment);
                      setSelectedPayment(null);
                    }}
                  >
                    Reject Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default AdminPayments;

