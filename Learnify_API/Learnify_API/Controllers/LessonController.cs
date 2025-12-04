using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Learnify_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LessonController : ControllerBase
    {
        //mk
        private readonly LessonService _lessonService;

        public LessonController(LessonService lessonService)
        {
            _lessonService = lessonService;
        }

        private int GetStudentId()
        {
            var claim = User.FindFirst("userId");
            return int.Parse(claim.Value);
        }
        // Add Lesson
        [Authorize(Roles = "instructor")]

        [HttpPost("add")]
        public async Task<IActionResult> AddLesson([FromBody] CreateLessonRequest model)
        {
            var success = await _lessonService.AddLessonAsync(model);
            if (!success) return BadRequest(new { message = "Invalid course ID or data" });
            return Ok(new { message = "Lesson added successfully!" });
        }

        //  Update Lesson
        [Authorize(Roles = "instructor")]

        [HttpPut("update/{lessonId}")]
        public async Task<IActionResult> UpdateLesson(int lessonId, [FromBody] UpdateLessonRequest model)
        {
            var success = await _lessonService.UpdateLessonAsync(lessonId, model);
            if (!success) return NotFound(new { message = "Lesson not found" });
            return Ok(new { message = "Lesson updated successfully!" });
        }

        //  Delete Lesson
        [Authorize(Roles = "instructor")]

        [HttpDelete("delete/{lessonId}")]
        public async Task<IActionResult> DeleteLesson(int lessonId)
        {
            var success = await _lessonService.DeleteLessonAsync(lessonId);
            if (!success) return NotFound(new { message = "Lesson not found" });
            return Ok(new { message = "Lesson deleted successfully!" });
        }

        //  Get Lesson by Id
        [Authorize(Roles = "instructor")]

        [HttpGet("{lessonId}")]
        public async Task<IActionResult> GetLessonforinstructorById(int lessonId)
        {
            var lesson = await _lessonService.GetLessonByIdAsync(lessonId);
            if (lesson == null) return NotFound(new { message = "Lesson not found" });
            return Ok(lesson);
        }

        //  Get Lessons by Course

        [Authorize(Roles = "instructor")]

        [HttpGet("by-course/{courseId}")]
        public async Task<IActionResult> GetLessonsforinstructorByCourse(int courseId)
        {
            var lessons = await _lessonService.GetLessonsByCourseAsync(courseId);
            return Ok(lessons);
        }



        [Authorize(Roles = "instructor")]
        [HttpGet("all-by-instructor")]
        public async Task<ActionResult<IEnumerable<LessonVM>>> GetAllLessonsByInstructor()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier) ??
                User.FindFirst("userId") ??
                User.FindFirst("UserId") ??
                User.FindFirst("id") ??
                User.FindFirst("sub") ??
                User.FindFirst("uid");

            if (userIdClaim == null)
                return Unauthorized("User not found.");

            int userId = int.Parse(userIdClaim.Value);

            var instructorId = await _lessonService.GetInstructorIdByUserId(userId);

            if (instructorId == null)
                return Unauthorized("Instructor profile not found.");

            var lessons = await _lessonService.GetLessonsByInstructorAsync(instructorId.Value);

            if (!lessons.Any())
                return NotFound("No lessons found for this instructor.");

            return Ok(lessons);
        }

        // For Student

        [Authorize(Roles = "student")]
        [HttpGet("by-courseid-for-student/{courseId}")]
        public async Task<IActionResult> GetLessonsforstudnetByCourse(int courseId)
        {
            var studentId = GetStudentId();
            var lessons = await _lessonService.GetLessonsForStudentAsync(courseId, studentId);

            if (lessons == null) return Unauthorized(new { message = "Not enrolled in course" });

            return Ok(lessons);
        }

        [Authorize(Roles = "student")]
        [HttpGet("by-lessonid-for-student/{lessonId}")]
        public async Task<IActionResult> GetLessonforstudnet(int lessonId)
        {
            var studentId = GetStudentId();
            var lesson = await _lessonService.GetLessonForStudentAsync(lessonId, studentId);

            if (lesson == null) return Unauthorized(new { message = "Access denied" });

            return Ok(lesson);
        }

        [Authorize(Roles = "student")]
        [HttpPost("complete/{lessonId}")]
        public async Task<IActionResult> CompleteLesson(int lessonId)
        {
            var studentId = GetStudentId();
            var success = await _lessonService.MarkLessonCompletedAsync(lessonId, studentId);

            if (!success) return Unauthorized("Not enrolled");

            return Ok(new { message = "Lesson completed successfully!" });
        }

        [Authorize(Roles = "student")]
        [HttpGet("course-progress/{courseId}")]
        public async Task<IActionResult> GetProgress(int courseId)
        {
            var studentId = GetStudentId();
            var progress = await _lessonService.GetProgressAsync(courseId, studentId);

            if (progress == null) return Unauthorized("Not enrolled");

            return Ok(new { progressPercent = progress });
        }
    }
}


