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

       
    }
}
