/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import DefaultImage from "../../../public/images/default-avatar.png";

/* ============================================================================
    API HOOKS
============================================================================ */
function usePayments() {
  const queryClient = useQueryClient();

  const fetchPayments = () =>
    api.get(Urls.getPayments).then((res) => res.data.payments || []);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      api.put(`${Urls.updatePaymentStatus}/${id}`, { status }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries(["payments"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`${Urls.deletePayment}/${id}`),
    onSuccess: () => {
      toast.success("Payment deleted");
      queryClient.invalidateQueries(["payments"]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  return { payments, isLoading, updateStatusMutation, deleteMutation };
}

/* ============================================================================
    FILTERING LOGIC
============================================================================ */
function useFilteredPayments(payments, filter, search, dateRange) {
  return useMemo(() => {
    const text = search.toLowerCase().trim();

    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    return payments.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;

      const created = new Date(p.createdAt || p.date);

      if (startDate && created < startDate) return false;
      if (endDate && created > endDate) return false;

      if (text) {
        return (
          p.user?.name?.toLowerCase().includes(text) ||
          p.user?.email?.toLowerCase().includes(text) ||
          p.course?.title?.toLowerCase().includes(text) ||
          p.transactionId?.toLowerCase().includes(text)
        );
      }

      return true;
    });
  }, [payments, filter, search, dateRange]);
}

/* ============================================================================
    STATS LOGIC
============================================================================ */
function usePaymentStats(payments) {
  return useMemo(() => {
    const stats = {
      totalPayments: payments.length,
      totalRevenue: 0,
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
    };

    payments.forEach((p) => {
      const amount = parseFloat(p.amount) || 0;

      stats.totalRevenue += amount;
      if (p.status) stats[p.status] = (stats[p.status] || 0) + 1;
    });

    return stats;
  }, [payments]);
}

/* ============================================================================
    UI COMPONENTS
============================================================================ */

const StatusBadge = ({ status }) => {
  const colors = {
    completed: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    failed: "bg-red-100 text-red-600",
    refunded: "bg-blue-100 text-blue-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors[status] || ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentTable = ({ payments, onUpdate, onDelete }) => (
  <div className="overflow-x-auto border rounded-lg bg-white shadow">
    <table className="min-w-full text-left">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="p-3">User</th>
          <th className="p-3">Course</th>
          <th className="p-3">Amount</th>
          <th className="p-3">Status</th>
          <th className="p-3">Date</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-b hover:bg-gray-50 transition">
            <td className="p-3 flex items-center gap-2">
              <img
                src={p.user?.imageUrl || DefaultImage}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{p.user?.name}</span>
            </td>

            <td className="p-3">{p.course?.title}</td>
            <td className="p-3 font-semibold">${p.amount}</td>

            <td className="p-3">
              <StatusBadge status={p.status} />
            </td>

            <td className="p-3">
              {new Date(p.createdAt).toLocaleDateString("en-US")}
            </td>

            <td className="p-3 text-right space-x-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={() =>
                  ConfirmToast({
                    message: "Mark as Completed?",
                    onConfirm: () => onUpdate({ id: p.id, status: "completed" }),
                  })
                }
              >
                Complete
              </button>

              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() =>
                  ConfirmToast({
                    message: "Refund this payment?",
                    onConfirm: () => onUpdate({ id: p.id, status: "refunded" }),
                  })
                }
              >
                Refund
              </button>

              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() =>
                  ConfirmToast({
                    message: "Delete this payment?",
                    onConfirm: () => onDelete(p.id),
                  })
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PaymentStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
    {[
      { label: "Total Payments", value: stats.totalPayments, color: "bg-gray-100" },
      { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, color: "bg-green-100" },
      { label: "Completed", value: stats.completed, color: "bg-blue-100" },
      { label: "Pending", value: stats.pending, color: "bg-yellow-100" },
    ].map((s, i) => (
      <div key={i} className={`p-4 rounded shadow ${s.color}`}>
        <h3 className="text-xl font-bold">{s.value}</h3>
        <p className="text-gray-700">{s.label}</p>
      </div>
    ))}
  </div>
);

/* ============================================================================
    MAIN COMPONENT
============================================================================ */
export default function AdminPayments() {
  const { payments, isLoading, updateStatusMutation, deleteMutation } = usePayments();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useFilteredPayments(payments, filter, search, dateRange);
  const stats = usePaymentStats(filtered);

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6">
      <LandingHeading title="Payments Management" />

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4 my-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>

      {/* Stats */}
      <PaymentStats stats={stats} />

      {/* Table */}
      {isLoading ? (
        <p className="text-center py-6">Loading payments...</p>
      ) : (
        <PaymentTable
          payments={paginated}
          onUpdate={updateStatusMutation.mutate}
          onDelete={deleteMutation.mutate}
        />
      )}

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          total={filtered.length}
          perPage={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
