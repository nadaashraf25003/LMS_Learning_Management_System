
using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{

    public class InstructorFinanceService
    {
        private readonly AppDbContext _context;

        public InstructorFinanceService(AppDbContext context)
        {
            _context = context;
        }

        // -------------------------------
        // 1️⃣ Payments
        // -------------------------------
        public async Task<List<PaymentVM>> GetPaymentsAsync(int instructorId)
        {
            return await _context.Payments
                .Where(p => p.InstructorId == instructorId)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentVM
                {
                    Amount = p.Amount,
                    Currency = p.Currency,
                    Status = p.Status,
                    PaymentDate = p.PaymentDate,
                    Method = p.Method,
                    Details = p.Details
                }).ToListAsync();
        }

        public async Task<List<PaymentVM>> GetPaymentHistoryAsync(int instructorId)
        {
            return await GetPaymentsAsync(instructorId); // نفس الدالة ممكن تستخدم كـ history
        }

        // -------------------------------
        // 2️⃣ PayoutRequests
        // -------------------------------
        public async Task<List<PayoutRequestVM>> GetPayoutRequestsAsync(int instructorId)
        {
            return await _context.PayoutRequests
                .Where(p => p.InstructorId == instructorId)
                .OrderByDescending(p => p.RequestDate)
                .Select(p => new PayoutRequestVM
                {
                    Amount = p.Amount,
                    Status = p.Status,
                    RequestDate = p.RequestDate,
                    PayoutDate = p.PayoutDate,
                    Method = p.Method,
                    Notes = p.Notes
                }).ToListAsync();
        }

        public async Task<PayoutRequestVM> RequestPayoutAsync(int instructorId, decimal amount, string method, string notes)
        {
            var payout = new PayoutRequest
            {
                InstructorId = instructorId,
                Amount = amount,
                Status = "Pending",
                RequestDate = DateTime.Now,
                Method = method,
                Notes = notes // مهم، عشان العمود مش بيسمح بـ NULL
            };

            _context.PayoutRequests.Add(payout);
            await _context.SaveChangesAsync();

            return new PayoutRequestVM
            {
                Amount = payout.Amount,
                Status = payout.Status,
                RequestDate = payout.RequestDate,
                PayoutDate = payout.PayoutDate,
                Method = payout.Method,
                Notes = payout.Notes
            };
        }



        // -------------------------------
        // 3️⃣ PaymentSettings
        // -------------------------------
        public async Task<PaymentSettingVM> GetPaymentSettingsAsync(int instructorId)
        {
            var setting = await _context.PaymentSettings
                .FirstOrDefaultAsync(p => p.InstructorId == instructorId);

            if (setting == null) return null;

            return new PaymentSettingVM
            {
                PreferredMethod = setting.PreferredMethod,
                BankAccount = setting.BankAccount,
                PayPalEmail = setting.PayPalEmail,
                TaxId = setting.TaxId
            };
        }

        public async Task UpdatePaymentSettingsAsync(int instructorId, PaymentSettingVM vm)
        {
            var setting = await _context.PaymentSettings
                .FirstOrDefaultAsync(p => p.InstructorId == instructorId);

            if (setting == null)
            {
                setting = new PaymentSetting
                {
                    InstructorId = instructorId,
                    PreferredMethod = vm.PreferredMethod,
                    BankAccount = vm.BankAccount,
                    PayPalEmail = vm.PayPalEmail,
                    TaxId = vm.TaxId
                };
                _context.PaymentSettings.Add(setting);
            }
            else
            {
                setting.PreferredMethod = vm.PreferredMethod;
                setting.BankAccount = vm.BankAccount;
                setting.PayPalEmail = vm.PayPalEmail;
                setting.TaxId = vm.TaxId;
            }

            await _context.SaveChangesAsync();
        }

        // -------------------------------
        // 4️⃣ TaxDocuments
        // -------------------------------
        public async Task<List<TaxDocumentVM>> GetTaxDocumentsAsync(int instructorId)
        {
            return await _context.TaxDocuments
                .Where(t => t.InstructorId == instructorId)
                .OrderByDescending(t => t.UploadDate)
                .Select(t => new TaxDocumentVM
                {
                    Type = t.Type,
                    FilePath = t.FilePath,
                    UploadDate = t.UploadDate,
                    Status = t.Status
                }).ToListAsync();
        }

        public async Task<TaxDocumentVM> UploadTaxDocumentAsync(int instructorId, string type, string filePath)
        {
            var doc = new TaxDocument
            {
                InstructorId = instructorId,
                Type = type,
                FilePath = filePath,
                Status = "Pending",
                UploadDate = DateTime.Now
            };

            _context.TaxDocuments.Add(doc);
            await _context.SaveChangesAsync();

            return new TaxDocumentVM
            {
                Type = doc.Type,
                FilePath = doc.FilePath,
                UploadDate = doc.UploadDate,
                Status = doc.Status
            };
        }

        // -------------------------------
        // 5️⃣ Earnings Overview
        // -------------------------------
        public async Task<EarningsOverviewVM> GetEarningsOverviewAsync(int instructorId)
        {
            var totalEarned = await _context.Payments
                .Where(p => p.InstructorId == instructorId && p.Status == "Completed")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            var totalPaid = await _context.PayoutRequests
                .Where(p => p.InstructorId == instructorId && p.Status == "Paid")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            var pendingPayouts = await _context.PayoutRequests
                .Where(p => p.InstructorId == instructorId && p.Status == "Pending")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            var lastPayment = await _context.Payments
                .Where(p => p.InstructorId == instructorId && p.Status == "Completed")
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => (DateTime?)p.PaymentDate)
                .FirstOrDefaultAsync();

            return new EarningsOverviewVM
            {
                TotalEarned = totalEarned,
                TotalPaid = totalPaid,
                PendingPayouts = pendingPayouts,
                LastPaymentDate = lastPayment
            };
        }
    }

    // -------------------------------
    // VM for Earnings Overview
    // -------------------------------
    public class EarningsOverviewVM
    {
        public decimal TotalEarned { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal PendingPayouts { get; set; }
        public DateTime? LastPaymentDate { get; set; }
    }

}
