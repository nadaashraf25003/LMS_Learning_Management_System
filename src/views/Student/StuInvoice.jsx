import React, { useState } from "react";
import { Search, Filter, Download, Eye, Calendar, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import useStudent from "@/hooks/useStudent";

export default function InvoicePage() {
  const { getCheckouts } = useStudent();
  const checkouts = getCheckouts?.data || [];
  const loading = getCheckouts?.isLoading;
  const error = getCheckouts?.error;

  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Filter checkouts
  const filteredCheckouts = checkouts
    .filter(c => filterStatus === "all" ? true : c.paymentStatus.toLowerCase() === filterStatus)
    .filter(c => search ? c.checkoutId.toString().includes(search) : true);

  // Total amount
  const totalAmount = filteredCheckouts.reduce((sum, c) => sum + Number(c.totalPrice), 0);

  const errorMsg = error ? error?.message || JSON.stringify(error) : null;

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      failed: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle download invoice
  const handleDownloadInvoice = (checkout) => {
    console.log("Downloading invoice for:", checkout.checkoutId);
    // Implement download logic here
  };

  // Handle view details
  const handleViewDetails = (checkout) => {
    console.log("Viewing details for:", checkout.checkoutId);
    // Implement view details logic here
  };

  return (
    <div className="min-h-screen bg-background text-text-primary animate-fade-in-up mt-16">
      <div className="custom-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Invoices</h1>
          <p className="text-text-secondary">View and manage your course purchase history</p>
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
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={filterStatus} 
                      onChange={e => setFilterStatus(e.target.value)}
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
                  <span className="hidden sm:block">Total: ${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-4">
              {filteredCheckouts.length > 0 ? (
                filteredCheckouts.map((checkout) => (
                  <div key={checkout.checkoutId} className="card border border-border rounded-xl p-6 bg-surface shadow-sm hover:shadow-md transition-shadow card-hover">
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
                            <span>{new Date(checkout.checkoutDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-text-secondary">
                            <CreditCard className="w-4 h-4" />
                            <span className="capitalize">{checkout.paymentMethod}</span>
                          </div>
                          
                          <div className="text-text-primary font-semibold">
                            ${Number(checkout.totalPrice).toFixed(2)}
                          </div>
                        </div>

                        {/* Courses List */}
                        <div className="mt-3">
                          <p className="text-sm text-text-secondary mb-2">Courses:</p>
                          <div className="flex flex-wrap gap-1">
                            {checkout.items?.map((item, index) => (
                              <span 
                                key={index}
                                className="inline-block px-2 py-1 bg-accent text-text-primary rounded text-xs border border-border"
                              >
                                {item.title}
                              </span>
                            )) || "-"}
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
                      <h3 className="text-xl font-semibold text-text-primary mb-2">No invoices found</h3>
                      <p className="text-text-secondary mb-6">
                        {search || filterStatus !== "all" 
                          ? "Try adjusting your search or filter criteria" 
                          : "You haven't made any purchases yet"
                        }
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

            {/* Total Summary */}
            {filteredCheckouts.length > 0 && (
              <div className="card border border-border rounded-xl p-6 mt-6 bg-surface">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Summary</h3>
                    <p className="text-text-secondary text-sm">
                      {filteredCheckouts.length} invoice(s) displayed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-secondary text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-text-primary">${totalAmount.toFixed(2)}</p>
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