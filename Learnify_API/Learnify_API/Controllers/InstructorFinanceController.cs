using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Learnify_API.Controllers
{
    [Route("api/instructors/me")]
    [ApiController]
    [Authorize] // لازم يكون متأكد من الـ JWT
    public class InstructorFinanceController : ControllerBase
    {
        private readonly InstructorFinanceService _financeService;

        public InstructorFinanceController(InstructorFinanceService financeService)
        {
            _financeService = financeService;
        }

        // دالة لجلب InstructorId من الـ JWT
        private int GetInstructorId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == "userId");
            if (claim == null) throw new Exception("Instructor ID not found in token");
            return int.Parse(claim.Value);
        }

        // -------------------------------
        // 1️⃣ Payments
        // -------------------------------
        [HttpGet("payments")]
        public async Task<IActionResult> GetPayments()
        {
            int instructorId = GetInstructorId();
            var payments = await _financeService.GetPaymentsAsync(instructorId);
            return Ok(payments);
        }

        [HttpGet("payments/history")]
        public async Task<IActionResult> GetPaymentHistory()
        {
            int instructorId = GetInstructorId();
            var history = await _financeService.GetPaymentHistoryAsync(instructorId);
            return Ok(history);
        }

        // -------------------------------
        // 2️⃣ Payout Requests
        // -------------------------------
        [HttpGet("payouts")]
        public async Task<IActionResult> GetPayouts()
        {
            int instructorId = GetInstructorId();
            var payouts = await _financeService.GetPayoutRequestsAsync(instructorId);
            return Ok(payouts);
        }

        [HttpPost("payouts/request")]
        public async Task<IActionResult> RequestPayout([FromBody] PayoutRequestVM vm)
        {
            int instructorId = GetInstructorId();
            var notes = string.IsNullOrEmpty(vm.Notes) ? "" : vm.Notes;

            var payout = await _financeService.RequestPayoutAsync(instructorId, vm.Amount, vm.Method, notes);
            return Ok(payout);
        }

        // -------------------------------
        // 3️⃣ Payment Settings
        // -------------------------------
        [HttpGet("payment-settings")]
        public async Task<IActionResult> GetPaymentSettings()
        {
            int instructorId = GetInstructorId();
            var settings = await _financeService.GetPaymentSettingsAsync(instructorId);
            return Ok(settings);
        }

        [HttpPost("payment-settings")]
        public async Task<IActionResult> UpdatePaymentSettings([FromBody] PaymentSettingVM vm)
        {
            int instructorId = GetInstructorId();
            await _financeService.UpdatePaymentSettingsAsync(instructorId, vm);
            return Ok(vm);
        }

        // -------------------------------
        // 4️⃣ Tax Documents
        // -------------------------------
        [HttpGet("tax-documents")]
        public async Task<IActionResult> GetTaxDocuments()
        {
            int instructorId = GetInstructorId();
            var docs = await _financeService.GetTaxDocumentsAsync(instructorId);
            return Ok(docs);
        }

        [HttpPost("tax-documents/upload")]
        public async Task<IActionResult> UploadTaxDocument([FromBody] TaxDocumentVM vm)
        {
            int instructorId = GetInstructorId();
            var doc = await _financeService.UploadTaxDocumentAsync(instructorId, vm.Type, vm.FilePath);
            return Ok(doc);
        }

        // -------------------------------
        // 5️⃣ Earnings Overview
        // -------------------------------
        [HttpGet("earnings/overview")]
        public async Task<IActionResult> GetEarningsOverview()
        {
            int instructorId = GetInstructorId();
            var overview = await _financeService.GetEarningsOverviewAsync(instructorId);
            return Ok(overview);
        }
    }
}
