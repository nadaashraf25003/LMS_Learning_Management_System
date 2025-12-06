using Learnify_API.Data;
using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Text;

public class AdminFinanceService
{
    private readonly AppDbContext _context;

    public AdminFinanceService(AppDbContext context)
    {
        _context = context;
    }

    // 1) Get all payout requests
    public async Task<List<PayoutRequestVM>> GetAllPayoutRequestsAsync()
    {
        return await _context.PayoutRequests
            .OrderByDescending(p => p.RequestDate)
            .Select(p => new PayoutRequestVM
            {
                Id = p.Id,
                InstructorId = p.InstructorId,
                Amount = p.Amount,
                Status = p.Status,
                Method = p.Method,
                RequestDate = p.RequestDate,
                PayoutDate = p.PayoutDate,
                Notes = p.Notes
            })
            .ToListAsync();
    }

    // 2) Stats
    public async Task<FinanceStatsVM> GetFinanceStatsAsync()
    {
        var stats = new FinanceStatsVM
        {
            TotalPayments = await _context.Payments.SumAsync(p => p.Amount),
            PendingPayouts = await _context.PayoutRequests
                .Where(p => p.Status == "Pending")
                .SumAsync(p => p.Amount),
            CompletedPayouts = await _context.PayoutRequests
                .Where(p => p.Status == "Paid")
                .SumAsync(p => p.Amount)
        };

        return stats;
    }

    // 3) Get single payout
    public async Task<PayoutRequest?> GetPayoutRequestByIdAsync(int id)
    {
        return await _context.PayoutRequests.FindAsync(id);
    }

    // 4) Update payout + create payment if approved
    public async Task<bool> UpdatePayoutStatusAsync(int id, string status)
    {
        var payout = await _context.PayoutRequests.FindAsync(id);
        if (payout == null) return false;

        payout.Status = status;

        if (status == "Paid")
        {
            payout.PayoutDate = DateTime.Now;

            var payment = new Payment
            {
                InstructorId = payout.InstructorId,
                Amount = payout.Amount,
                Currency = "USD",
                Status = "Completed",
                PaymentDate = DateTime.Now,
                Method = payout.Method,
                Details = "Payout approved by admin"
            };

            _context.Payments.Add(payment);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    // 5) Export CSV
    public async Task<byte[]> ExportPayoutsToCsvAsync()
    {
        var payouts = await _context.PayoutRequests.ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("Id,InstructorId,Amount,Status,RequestDate,PayoutDate,Method");

        foreach (var p in payouts)
        {
            sb.AppendLine($"{p.Id},{p.InstructorId},{p.Amount},{p.Status},{p.RequestDate},{p.PayoutDate},{p.Method}");
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }
}
