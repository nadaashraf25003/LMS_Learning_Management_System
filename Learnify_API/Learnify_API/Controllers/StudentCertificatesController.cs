using Learnify_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [Route("")]
    [ApiController]
    [Authorize(Roles = "student")]
    public class StudentCertificatesController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public StudentCertificatesController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        // GET: api/StudentCertificates
        [HttpGet ("StudentCertificates")]
        public async Task<IActionResult> GetStudentCertificates()
        {
            // لو عايزة تجيب الـ studentId من الـ token
            var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (studentIdClaim == null)
                return Unauthorized("Student ID not found in token.");

            if (!int.TryParse(studentIdClaim, out int studentId))
                return BadRequest("Invalid student ID.");

            var certificates = await _certificateService.GetStudentCertificatesAsync(studentId);

            return Ok(certificates);
        }
    }
}
