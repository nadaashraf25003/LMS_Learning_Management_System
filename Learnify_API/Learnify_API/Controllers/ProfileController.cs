using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        public ProfileController(ProfileService service)
        {

            _service = service;
        }
        private readonly ProfileService _service;


        [Authorize(Roles = "student")]
        [HttpPut("edit-student")]
        public async Task<IActionResult> EditStudentProfile([FromForm] EditStudentProfileVM model)
        {
            var userId = User.FindFirst("userId")?.Value;

            if (userId == null)
                return Unauthorized("Invalid token");

            var result = await _service.EditStudentProfileAsync(int.Parse(userId), model);

            if (!result)
                return NotFound("Student or profile not found.");

            return Ok(new { message = "Profile updated successfully!" });
        }



        [Authorize(Roles = "instructor")]
        [HttpPut("edit-instructor")]
        public async Task<IActionResult> EditInstructorProfile([FromForm] EditInstructorProfileVM model)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();

            var result = await _service.EditInstructorProfileAsync(int.Parse(userId), model);

            if (!result) return NotFound("Instructor or profile not found.");

            return Ok(new { message = "Profile updated successfully!" });
        }


        [Authorize(Roles = "admin")]
        [HttpPut("edit-admin")]
        public async Task<IActionResult> EditAdminProfile([FromForm] EditAdminProfileVM model)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();

            var result = await _service.EditAdminProfileAsync(int.Parse(userId), model);

            if (!result) return NotFound("Admin or profile not found.");

            return Ok(new { message = "Profile updated successfully!" });
        }

        [Authorize(Roles = "instructor")]
        [HttpGet("instructor")]
        public async Task<IActionResult> GetInstructorProfile()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });

            var profile = await _service.GetInstructorProfileAsync(int.Parse(userId));

            if (profile == null)
                return NotFound(new { message = "Instructor not found" });

            return Ok(profile);
        }

        [Authorize(Roles = "student")]
        [HttpGet("student")]
        public async Task<IActionResult> GetStudentProfile()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();

            var profile = await _service.GetStudentProfileAsync(int.Parse(userId));

            if (profile == null)
                return NotFound(new { message = "Student not found" });

            return Ok(profile);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminProfile()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });

            var profile = await _service.GetAdminProfileAsync(int.Parse(userId));

            if (profile == null)
                return NotFound(new { message = "Admin not found" });

            return Ok(profile);
        }

        // 1️⃣ Get About
        [HttpGet("about-ins")]
        public async Task<IActionResult> GetAbout()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });
            var about = await _service.GetAboutAsync(int.Parse(userId));
            return Ok(new { About = about });
        }

        [HttpGet("courses-ins")]
        public async Task<IActionResult> GetCourses()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });

            var courses = await _service.GetCoursesAsync(int.Parse(userId));
            return Ok(courses);
        }

        [HttpGet("earnings")]
        public async Task<IActionResult> GetEarnings()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });

            var earnings = await _service.GetEarningsAsync(int.Parse(userId));
            return Ok(earnings);
        }

        [HttpGet("all-students")]
        public async Task<IActionResult> GetStudents()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });

            var students = await _service.GetStudentsAsync(int.Parse(userId));
            return Ok(students);
        }

        [HttpGet("certificates-ins")]
        public async Task<IActionResult> GetCertificates()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized(new { message = "Invalid token" });

            var certificates = await _service.GetCertificatesAsync(int.Parse(userId));
            return Ok(certificates);
        }





        // 1. About
        [HttpGet("about-Stu")]
        public async Task<IActionResult> GetAboutStu()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var about = await _service.GetAboutStuAsync(int.Parse(userId));
            return Ok(new { About = about });
        }

        // 2. Courses
        [HttpGet("courses-Stu")]
        public async Task<IActionResult> GetCoursesStu()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var courses = await _service.GetCoursesStuAsync(int.Parse(userId));
            return Ok(courses);
        }

        // 3. Enrollments
        [HttpGet("enrollments")]
        public async Task<IActionResult> GetEnrollments()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var enrollments = await _service.GetEnrollmentsAsync(int.Parse(userId));
            return Ok(enrollments);
        }

        // 4. Progress
        [HttpGet("progress")]
        public async Task<IActionResult> GetProgress()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var progress = await _service.GetProgressAsync(int.Parse(userId));
            return Ok(progress);
        }

        // 5. Certificates
        [HttpGet("certificates-Stu")]
        public async Task<IActionResult> GetCertificatesStu()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var certificates = await _service.GetCertificatesStuAsync(int.Parse(userId));
            return Ok(certificates);
        }





        // 1. About Me
        [HttpGet("about-admin")]
        public async Task<IActionResult> GetAboutAdmin()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var about = await _service.GetAboutAdminAsync(int.Parse(userId));
            return Ok(new { About = about });
        }

        // 2. User Management
        [HttpGet("usermanagement")]
        public async Task<IActionResult> GetUserManagement()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var userManagement = await _service.GetUserManagementAsync(int.Parse(userId));
            return Ok(userManagement);
        }


    }
}
