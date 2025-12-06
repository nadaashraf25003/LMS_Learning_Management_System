using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [Route("api/admin/finance")]
    [ApiController]
    [Authorize(Roles = "admin")] // بس الادمن يقدر يدخل
    public class AdminFinanceController : ControllerBase
    {
        private readonly AdminFinanceService _financeService;

        public AdminFinanceController(AdminFinanceService financeService)
        {
            _financeService = financeService;
        }

        // -------------------------------
        // 1️⃣ كل طلبات السحب
        // -------------------------------
        [HttpGet("payouts")]
        public async Task<IActionResult> GetAllPayoutRequests()
        {
            var payouts = await _financeService.GetAllPayoutRequestsAsync();
            return Ok(payouts);
        }

        // -------------------------------
        // 2️⃣ الموافقة على طلب سحب
        // -------------------------------
        [HttpPost("payouts/{payoutId}/approve")]
        public async Task<IActionResult> ApprovePayout(int payoutId)
        {
            var result = await _financeService.ApprovePayoutAsync(payoutId);
            if (!result) return BadRequest("Cannot approve this payout.");
            return Ok("Payout approved successfully.");
        }

        // -------------------------------
        // 3️⃣ رفض طلب سحب
        // -------------------------------
        [HttpPost("payouts/{payoutId}/reject")]
        public async Task<IActionResult> RejectPayout(int payoutId)
        {
            var result = await _financeService.RejectPayoutAsync(payoutId);
            if (!result) return BadRequest("Cannot reject this payout.");
            return Ok("Payout rejected successfully.");
        }

        // -------------------------------
        // 4️⃣ كل الـ Payments (اختياري)
        // -------------------------------
        [HttpGet("payments")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _financeService.GetAllPaymentsAsync();
            return Ok(payments);
        }

    }
}
