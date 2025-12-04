using Learnify_API.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }
        public readonly AdminService _adminService;

        // GET: api/user
        //[Authorize(Roles = "admin")]
        [HttpGet("get-all-user")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(new { Users = users });
        }

        //  GET: api/user/5
        [Authorize(Roles = "admin")]
        [HttpGet("get-user-by/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _adminService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(user);
        }


        // DELETE: api/user/5
        [Authorize(Roles = "admin")]
        [HttpDelete("delete-user-by/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _adminService.DeleteUserAsync(id);
            if (!success)
                return NotFound(new { Message = "User not found" });

            return Ok(new { Message = "User deleted successfully" });
        }

        //[Authorize(Roles = "admin")]
        [HttpPut("approve-user-by/{id}")]
        public async Task<IActionResult> ApproveUserById(int id)
        {
            var success = await _adminService.ApproveUserAsync(id);
            if (!success)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User approved successfully" });
        }
        [Authorize(Roles = "admin")]
        [HttpPost("pay-instructor/{payoutId}")]
        public async Task<IActionResult> PayInstructor(int payoutId)
        {
            var payout = await _adminService.GetInstructorPayoutByIdAsync(payoutId);


            if (payout == null)
                return NotFound(new { message = "Payout not found." });

            if (payout.Status == "Paid")
                return BadRequest(new { message = "This payout is already paid." });

            payout.Status = "Paid";
            payout.PaidAt = DateTime.Now;

            await _adminService.SaveChangesAsync();


            return Ok(new { message = "Instructor has been paid successfully." });
        }
        // GET: admin/instructors-report
        [Authorize(Roles = "admin")]
        [HttpGet("instructors-report")]
        public async Task<IActionResult> GetInstructorsReport()
        {
            var report = await _adminService.GetInstructorsSalesAsync();
            if (!report.Any())
                return NotFound(new { message = "No instructors found." });

            return Ok(report);
        }


    }
}
