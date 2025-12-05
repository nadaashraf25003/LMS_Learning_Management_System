using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Learnify_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly CourseService _courseService;

        public CourseController(CourseService courseService)
        {
            _courseService = courseService;
        }

        //Instructor adds course
        [Authorize(Roles = "instructor")]
        [HttpPost("add")]
        public async Task<IActionResult> AddCourse([FromBody] CourseVM model)
        {
            // Get instructor id from JWT token
            var instructorIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
            if (instructorIdClaim == null)
                return Unauthorized(new { message = "Instructor not found in token" });

            model.InstructorId = int.Parse(instructorIdClaim.Value);

            var success = await _courseService.AddCourseAsync(model);
            if (!success) return BadRequest(new { message = "Instructor not found in DB" });

            return Ok(new { message = "Course added successfully! Waiting for admin approval." });
        }

        // Get all pending (unapproved) courses
        [HttpGet("pending-courses")]
        [Authorize] // both admin and instructor
        public async Task<IActionResult> GetPendingCourses()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null) return Unauthorized("jjj");

            var userId = int.Parse(userIdClaim);
            var role = roleClaim;

            IEnumerable<CourseVM> courses;

            if (role == "admin")
            {
                // Admin sees all pending courses
                courses = await _courseService.GetAllPendingCoursesAsync();
            }
            else if (role == "instructor")
            {
                // Instructor sees only their own pending courses
                courses = (await _courseService.GetAllPendingCoursesAsync())
                          .Where(c => c.InstructorId == userId);
            }
            else
            {
                return Forbid();
            }

            return Ok(courses);
        }

        // Get all approved courses
        [HttpGet("approved")]
        public async Task<IActionResult> GetAllApprovedCourses()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim);
            var role = roleClaim;

            IEnumerable<CourseVM> courses;

            if (role == "admin")
            {
                // Admin sees all approved courses
                courses = await _courseService.GetAllApprovedCoursesAsync();
            }
            else if (role == "instructor")
            {
                // Instructor sees only their own approved courses
                courses = (await _courseService.GetAllApprovedCoursesAsync())
                          .Where(c => c.InstructorId == userId);
            }
            else
            {
                return Forbid();
            }

            return Ok(courses);
        }

        [HttpGet("approved/all")]
        [AllowAnonymous] // for searching courses without login
        public async Task<IActionResult> GetAllApprovedCoursesForAnyUser()
        {
            var courses = await _courseService.GetAllApprovedCoursesAsync();
            return Ok(courses);
        }

        //  Get course by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null) return NotFound(new { message = "Course not found" });

            return Ok(course);
        }

        //  Admin approves a course
        //[Authorize(Roles = "admin")]
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveCourse(int id)
        {
            var success = await _courseService.ApproveCourseAsync(id);
            if (!success) return NotFound(new { message = "Course not found" });

            return Ok(new { message = "Course approved successfully!" });
        }

        // UPDATE course (Instructor or Admin)
        //[Authorize(Roles = "admin,instructor")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromForm] CourseVM model)
        {
            // Extract user info from token
            var userIdClaim = User.FindFirst("userId")?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null || roleClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim);
            var isAdmin = roleClaim.ToLower() == "admin";

            var success = await _courseService.UpdateCourseAsync(id, model, userId, isAdmin);

            if (!success)
                return NotFound(new { message = "Course not found or not authorized to update" });

            return Ok(new { message = "Course updated successfully! Waiting for admin approval." });
        }


        //  DELETE course (Admin or Instructor)
        [Authorize(Roles = "admin,instructor")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            // Extract user info from token
            var userIdClaim = User.FindFirst("userId")?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null || roleClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim);
            var isAdmin = roleClaim.ToLower() == "admin";

            var success = await _courseService.DeleteCourseAsync(id, userId, isAdmin);

            if (!success)
                return NotFound(new { message = "Course not found or not authorized to delete" });

            return Ok(new { message = "Course deleted successfully!" });
        }



    }
}
