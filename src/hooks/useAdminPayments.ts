/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URL";

export interface PayoutRequest {
  id: number;
  instructorId: number;
  amount: number;
  status: string;
  method: string;
  requestDate: string;
  payoutDate?: string;
  notes?: string;
}

export interface FinanceStats {
  totalPayments: number;
  pendingPayouts: number;
  completedPayouts: number;
}

const useAdminPayments = (id?: string) => {
  const queryClient = useQueryClient();

  /* ===========================
   *     ADMIN QUERIES
   * =========================== */

  // 1️⃣ Get all payout requests
  const getAllPayouts = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => {
      const res = await api.get("/admin/transactions");
      return res.data;
    },
  });

  // 2️⃣ Get stats
  const getFinanceStats = useQuery({
    queryKey: ["admin-finance-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/transactions/stats");
      return res.data;
    },
  });

  // 3️⃣ Get single payout request
  const getPayoutById = (payoutId: string) =>
    useQuery({
      queryKey: ["admin-payout", payoutId],
      queryFn: async () => {
        const res = await api.get(`/admin/transactions/${payoutId}`);
        return res.data;
      },
      enabled: !!payoutId,
    });

  /* ===========================
   *     MUTATIONS
   * =========================== */

  // 4️⃣ Update payout status
  const updatePayoutStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.put(`/admin/transactions/${id}/status`, status, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-finance-stats"] });
    },
  });

  // 5️⃣ Export CSV
  const exportPayoutCSV = async () => {
    const res = await api.get("/admin/transactions/export", {
      responseType: "blob",
    });

    // Trigger browser download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payouts.csv");
    document.body.appendChild(link);
    link.click();
  };

  return {
    getAllPayouts,
    getFinanceStats,
    getPayoutById,
    updatePayoutStatus,
    exportPayoutCSV,
  };
};

export default useAdminPayments;
