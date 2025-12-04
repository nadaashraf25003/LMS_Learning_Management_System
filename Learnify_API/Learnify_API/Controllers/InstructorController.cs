using Learnify_API.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly InstructorService _instructorService;

        public InstructorController(InstructorService instructorService)
        {
            _instructorService = instructorService;
        }

        // GET: instructor payouts
        [Authorize(Roles = "instructor")]
        [HttpGet("payouts/{instructorId}")]
        public async Task<IActionResult> GetInstructorPayouts(int instructorId)
        {
            var payouts = await _instructorService.GetPayoutsByInstructorAsync(instructorId);

            if (!payouts.Any())
                return NotFound(new { message = "No payouts found for this instructor." });

            return Ok(payouts);
        }


    }
}
