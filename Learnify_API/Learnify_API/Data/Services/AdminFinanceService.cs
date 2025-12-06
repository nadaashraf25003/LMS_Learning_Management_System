using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class AdminFinanceService
    {
        private readonly AppDbContext _context;

        public AdminFinanceService(AppDbContext context)
        {
            _context = context;
        }

        // -------------------------------
        // 1️⃣ Get all payout requests
        // -------------------------------
        public async Task<List<PayoutRequestVM>> GetAllPayoutRequestsAsync()
        {
            return await _context.PayoutRequests
                .OrderByDescending(p => p.RequestDate)
                .Select(p => new PayoutRequestVM
                {
                    Amount = p.Amount,
                    Status = p.Status,
                    RequestDate = p.RequestDate,
                    PayoutDate = p.PayoutDate,
                    Method = p.Method,
                    Notes = p.Notes,
                    InstructorId = p.InstructorId
                }).ToListAsync();
        }

        // -------------------------------
        // 2️⃣ Approve payout request
        // -------------------------------
        public async Task<bool> ApprovePayoutAsync(int payoutId)
        {
            var payout = await _context.PayoutRequests.FindAsync(payoutId);
            if (payout == null || payout.Status != "Pending") return false;

            // تحويل حالة الـ payout لـ Paid
            payout.Status = "Paid";
            payout.PayoutDate = DateTime.Now;

            // إنشاء Payment للـ instructor
            var payment = new Payment
            {
                InstructorId = payout.InstructorId,
                Amount = payout.Amount,
                Currency = "USD", // ممكن تعدلي حسب الكورس
                Status = "Completed",
                PaymentDate = DateTime.Now,
                Method = payout.Method,
                Details = payout.Notes
            };
            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();
            return true;
        }

        // -------------------------------
        // 3️⃣ Reject payout request
        // -------------------------------
        public async Task<bool> RejectPayoutAsync(int payoutId)
        {
            var payout = await _context.PayoutRequests.FindAsync(payoutId);
            if (payout == null || payout.Status != "Pending") return false;

            payout.Status = "Rejected";
            payout.PayoutDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // -------------------------------
        // 4️⃣ Get all payments
        // -------------------------------
        public async Task<List<PaymentVM>> GetAllPaymentsAsync()
        {
            return await _context.Payments
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentVM
                {
                    Amount = p.Amount,
                    Currency = p.Currency,
                    Status = p.Status,
                    PaymentDate = p.PaymentDate,
                    Method = p.Method,
                    Details = p.Details,
                    InstructorId = p.InstructorId
                }).ToListAsync();
        }
    }
}
