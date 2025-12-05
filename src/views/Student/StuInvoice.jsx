import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import useStudent from "@/hooks/useStudent";

export default function InvoicePage() {
  const { getCheckouts } = useStudent();
  const checkouts = getCheckouts?.data || [];
  console.log(checkouts.courses);
  const loading = getCheckouts?.isLoading;
  const error = getCheckouts?.error;

  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter checkouts
  const filteredCheckouts = checkouts
    .filter((c) =>
      filterStatus === "all"
        ? true
        : c.paymentStatus.toLowerCase() === filterStatus
    )
    .filter((c) => (search ? c.checkoutId.toString().includes(search) : true));

  // Total amount
  const totalAmount = filteredCheckouts.reduce(
    (sum, c) => sum + Number(c.totalPrice),
    0
  );

  const errorMsg = error ? error?.message || JSON.stringify(error) : null;

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      failed: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle download invoice
  const handleDownloadInvoice = (checkout) => {
    const { jsPDF } = require("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Invoice #${checkout.checkoutId}`, 10, 20);
    doc.setFontSize(12);
    doc.text(
      `Date: ${new Date(checkout.checkoutDate).toLocaleDateString()}`,
      10,
      30
    );
    doc.text(`Payment Method: ${checkout.paymentMethod}`, 10, 40);
    doc.text(`Payment Status: ${checkout.paymentStatus}`, 10, 50);

    doc.text("Courses:", 10, 60);
    checkout.courses.forEach((course, index) => {
      doc.text(`- ${course}`, 12, 70 + index * 10);
    });

    doc.text(
      `Total: $${checkout.totalPrice.toFixed(2)}`,
      10,
      70 + checkout.courses.length * 10 + 10
    );

    doc.save(`Invoice_${checkout.checkoutId}.pdf`);
  };

  // Handle view details
  const handleViewDetails = (checkout) => {
    setSelectedCheckout(checkout);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedCheckout(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary animate-fade-in-up mt-16">
      <div className="custom-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            My Invoices
          </h1>
          <p className="text-text-secondary">
            View and manage your course purchase history
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {errorMsg && (
          <div className="card border border-destructive rounded-xl p-6 mb-6 bg-destructive/10">
            <div className="flex items-center gap-3 text-destructive">
              <XCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Error loading invoices</h3>
                <p className="text-sm mt-1">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !errorMsg && (
          <>
            {/* Filters and Search */}
            <div className="card border border-border rounded-xl p-6 mb-6 bg-surface">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by checkout ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border border-input rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>{filteredCheckouts.length} invoice(s)</span>
                  <span className="hidden sm:block">•</span>
                  <span className="hidden sm:block">
                    Total: ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-4">
              {filteredCheckouts.length > 0 ? (
                filteredCheckouts.map((checkout) => (
                  <div
                    key={checkout.checkoutId}
                    className="card border border-border rounded-xl p-6 bg-surface shadow-sm hover:shadow-md transition-shadow card-hover"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section - Basic Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-text-primary">
                            Invoice #{checkout.checkoutId}
                          </h3>
                          <StatusBadge status={checkout.paymentStatus} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-text-secondary">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                checkout.checkoutDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-text-secondary">
                            <CreditCard className="w-4 h-4" />
                            <span className="capitalize">
                              {checkout.paymentMethod}
                            </span>
                          </div>

                          <div className="text-text-primary font-semibold">
                            ${Number(checkout.totalPrice).toFixed(2)}
                          </div>
                        </div>

                        {/* Courses List */}
                        <div className="mt-3">
                          <p className="text-sm text-text-secondary mb-2">
                            Courses:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {checkout.courses && checkout.courses.length > 0
                              ? checkout.courses.map((course, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-1 bg-accent text-text-primary rounded text-xs border border-border"
                                  >
                                    {course}
                                  </span>
                                ))
                              : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-text-primary">
                            ${Number(checkout.totalPrice).toFixed(2)}
                          </p>
                          <p className="text-sm text-text-secondary capitalize">
                            {checkout.paymentMethod}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(checkout)}
                            className="p-2 border border-border text-text-primary rounded-lg hover:bg-accent transition-colors btn-hover"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(checkout)}
                            className="p-2 border border-border text-text-primary rounded-lg hover:bg-accent transition-colors btn-hover"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="card border border-border rounded-xl p-12 text-center bg-surface">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        No invoices found
                      </h3>
                      <p className="text-text-secondary mb-6">
                        {search || filterStatus !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "You haven't made any purchases yet"}
                      </p>
                      {(search || filterStatus !== "all") && (
                        <button
                          onClick={() => {
                            setSearch("");
                            setFilterStatus("all");
                          }}
                          className="btn btn-primary btn-hover px-6 py-3 rounded-lg"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isModalOpen && selectedCheckout && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in-up">
                <div className="bg-card text-card-foreground rounded-xl shadow-2xl w-full max-w-lg mx-4 relative border border-border">
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors duration-200 p-2 hover:bg-accent rounded-full z-10"
                    onClick={handleCloseModal}
                    aria-label="Close modal"
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
                  <div className="p-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-primary">
                          Invoice Details
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Checkout #{selectedCheckout.checkoutId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Invoice Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Date
                        </p>
                        <p className="font-medium text-text-primary">
                          {new Date(
                            selectedCheckout.checkoutDate
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            selectedCheckout.paymentStatus === "completed"
                              ? "bg-green-500/10 text-green-700 dark:text-green-300"
                              : selectedCheckout.paymentStatus === "pending"
                              ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
                              : "bg-red-500/10 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {selectedCheckout.paymentStatus
                            .charAt(0)
                            .toUpperCase() +
                            selectedCheckout.paymentStatus.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Payment Method
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-text-primary font-medium">
                            {selectedCheckout.paymentMethod}
                          </span>
                          {selectedCheckout.paymentMethod
                            .toLowerCase()
                            .includes("card") && (
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Amount
                        </p>
                        <p className="text-xl font-bold text-primary">
                          ${selectedCheckout.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Courses Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary">
                          Courses Purchased
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {selectedCheckout.courses.length} items
                        </span>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {selectedCheckout.courses.map((course, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-lg border border-border bg-surface hover:bg-accent/50 transition-colors duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-text-primary">
                                  {course}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Course Access: Lifetime
                                </p>
                              </div>
                              <div className="text-sm font-medium text-primary">
                                Included
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          ${selectedCheckout.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Tax</span>
                        <span>Included</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-lg font-bold text-text-primary">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ${selectedCheckout.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 pt-4 border-t border-border bg-surface rounded-b-xl">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-text-primary transition-colors duration-200"
                      >
                        Close
                      </button>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors duration-200">
                          Download PDF
                        </button>
                        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity duration-200">
                          Share Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Summary */}
            {filteredCheckouts.length > 0 && (
              <div className="card border border-border rounded-xl p-6 mt-6 bg-surface">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      Summary
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {filteredCheckouts.length} invoice(s) displayed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-secondary text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-text-primary">
                      ${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
