using Learnify_API.Data;
using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace Learnify_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly QuizService _quizService;
        private readonly AppDbContext _context;

        public QuizController(QuizService quizService, AppDbContext context)
        {
            _quizService = quizService;
            _context = context;
        }
        // ================== get-all ==================

        [HttpGet("get-all")]
        public async Task<ActionResult<List<QuizVM>>> GetAll()
        {
            // جلب userId من الـ token
            var userIdClaim =
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ??
            User.FindFirst("userId") ??
            User.FindFirst("id") ??
            User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int userId = int.Parse(userIdClaim.Value);

            // جلب instructorId
            var instructorId = await _quizService.GetInstructorIdByUserId(userId);
            if (instructorId == null) return Unauthorized("Instructor profile not found.");

            // جلب الكويزات الخاصة بالانستركتور
            var quizzes = await _quizService.GetQuizzesByInstructorAsync(instructorId.Value);
            if (!quizzes.Any()) return NotFound("No quizzes found for this instructor.");

            return Ok(quizzes);
        }

        // ================== get-by-id ==================
        [Authorize(Roles = "instructor , student")]
        [HttpGet("get-by-id/{id}")]
        //[Authorize] // أي مستخدم مسجل يقدر يشوف كويز واحد

        public async Task<ActionResult<QuizVM>> GetById(int id)
        {
            var userIdClaim =
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ??
            User.FindFirst("userId") ??
            User.FindFirst("id") ??
            User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int userId = int.Parse(userIdClaim.Value);

            var instructorId = await _quizService.GetInstructorIdByUserId(userId);
            if (instructorId == null) return Unauthorized("Instructor profile not found.");

            // جلب الكويز
            var quiz = await _quizService.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();

            // تأكد إن الكويز يخص الانستركتور
            var course = await _quizService.GetCourseByIdAsync(quiz.CourseId);
            if (course == null || course.InstructorId != instructorId.Value)
                return Unauthorized("This quiz does not belong to the instructor.");

            return Ok(quiz);
        }


        // ================== POST ==================

        [HttpPost("add")]
        [Authorize(Roles = "instructor")] // بس الإنستركتور يقدر يضيف كويز

        public async Task<ActionResult<QuizVM>> Create([FromBody] QuizVM quizVM)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier) ??
                User.FindFirst("userId") ??
                User.FindFirst("id") ??
                User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int userId = int.Parse(userIdClaim.Value);

            var instructorId = await _quizService.GetInstructorIdByUserId(userId);
            if (instructorId == null) return Unauthorized("Instructor profile not found.");

            try
            {
                var createdQuiz = await _quizService.CreateQuizAsync(quizVM, instructorId.Value);
                return CreatedAtAction(nameof(GetById), new { id = createdQuiz.Id }, createdQuiz);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ================== UPDATE ==================

        [HttpPut("update/{id}")]
        [Authorize(Roles = "instructor")]
        public async Task<ActionResult<QuizVM>> Update(int id, [FromBody] QuizVM quizVM)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier) ??
                User.FindFirst("userId") ??
                User.FindFirst("id") ??
                User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int userId = int.Parse(userIdClaim.Value);

            var instructorId = await _quizService.GetInstructorIdByUserId(userId);
            if (instructorId == null) return Unauthorized("Instructor profile not found.");

            // Verify course ownership
            var course = await _quizService.GetCourseByIdAsync(quizVM.CourseId);
            if (course == null || course.InstructorId != instructorId.Value)
                return BadRequest("This course does not belong to the instructor.");

            var updatedQuiz = await _quizService.UpdateQuizAsync(id, quizVM);
            if (updatedQuiz == null) return NotFound();

            return Ok(updatedQuiz);
        }


        // ================== DELETE ==================

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "instructor")] // بس الإنستركتور يقدر يحذف الكويز
        public async Task<ActionResult> Delete(int id)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier) ??
                User.FindFirst("userId") ??
                User.FindFirst("id") ??
                User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int userId = int.Parse(userIdClaim.Value);

            var instructorId = await _quizService.GetInstructorIdByUserId(userId);
            if (instructorId == null) return Unauthorized("Instructor profile not found.");

            // تحقق من ملكية الكويز قبل الحذف
            var quiz = await _quizService.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();
            var course = await _quizService.GetCourseByIdAsync(quiz.CourseId);
            if (course == null || course.InstructorId != instructorId.Value)
                return BadRequest("This quiz does not belong to the instructor.");

            var deleted = await _quizService.DeleteQuizAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // ================== GET BY INSTRUCTOR ==================
        [Authorize(Roles = "instructor")]
        [HttpGet("by-instructor")]
        public async Task<ActionResult<IEnumerable<QuizVM>>> GetByInstructor()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier) ??
                User.FindFirst("userId") ??
                User.FindFirst("id") ??
                User.FindFirst("sub");

            if (userIdClaim == null)
                return Unauthorized("User not found.");

            int userId = int.Parse(userIdClaim.Value);

            var instructorId = await _quizService.GetInstructorIdByUserId(userId);
            if (instructorId == null)
                return Unauthorized("Instructor profile not found.");

            var quizzes = await _quizService.GetQuizzesByInstructorAsync(instructorId.Value);
            if (!quizzes.Any()) return NotFound("No quizzes found for this instructor.");

            return Ok(quizzes);
        }


        // Get all quizzes for a course for the logged-in student
        [HttpGet("by-courseid-for-student/{courseId}")]
        public async Task<ActionResult<IEnumerable<QuizVM>>> GetQuizzesforstudentByCourse(int courseId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ??
                              User.FindFirst("userId") ??
                              User.FindFirst("id") ??
                              User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int studentId = int.Parse(userIdClaim.Value);

            // Check if student is enrolled
            var course = await _quizService.GetCourseByIdAsync(courseId);
            if (course == null) return NotFound("Course not found.");

            bool isEnrolled = await _quizService.IsStudentEnrolled(studentId, courseId);
            if (!isEnrolled) return Unauthorized("You are not enrolled in this course.");

            // Return all quizzes for this course
            var quizzes = course.Quizzes ?? new List<QuizVM>();
            return Ok(quizzes);
        }

        // Get single quiz for student
        [HttpGet("by-quizid-for-student/{quizId}")]
        public async Task<ActionResult<QuizVM>> GetQuizforstudentById(int quizId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ??
                              User.FindFirst("userId") ??
                              User.FindFirst("id") ??
                              User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int studentId = int.Parse(userIdClaim.Value);

            // Get quiz
            var quiz = await _quizService.GetQuizByIdAsync(quizId);
            if (quiz == null) return NotFound("Quiz not found.");

            // Check enrollment
            bool isEnrolled = await _quizService.IsStudentEnrolled(studentId, quiz.CourseId);
            if (!isEnrolled) return Unauthorized("You are not enrolled in this course.");

            return Ok(quiz);
        }

        [HttpPost("submit/{quizId}")]
        [Authorize(Roles = "student")]
        public async Task<ActionResult> SubmitQuiz(int quizId, [FromBody] Dictionary<string, string> answers)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ??
                              User.FindFirst("userId") ??
                              User.FindFirst("id") ??
                              User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int studentId = int.Parse(userIdClaim.Value);

            // Example start/end time, can be passed from frontend
            var startTime = DateTime.Now.AddMinutes(-10);
            var endTime = DateTime.Now;

            try
            {
                var studentAnswer = await _quizService.SubmitQuizAsync(studentId, quizId, answers, startTime, endTime);

                var enrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == studentAnswer.Quiz.CourseId);

                return Ok(new
                {
                    score = studentAnswer.Score,
                    duration = studentAnswer.Duration,
                    progress = enrollment?.Progress ?? 0,
                    completed = enrollment?.IsCompleted ?? false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "student")]
        [HttpGet("reult-by-quizId/{quizId}")]
        public async Task<ActionResult> GetResultByQuizId(int quizId)
        {
            // Get student ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ??
                              User.FindFirst("userId") ??
                              User.FindFirst("id") ??
                              User.FindFirst("sub");

            if (userIdClaim == null) return Unauthorized("User not found.");
            int studentId = int.Parse(userIdClaim.Value);

            // Get StudentAnswer for the given quiz
            var studentAnswer = await _context.StudentAnswers
                .Include(sa => sa.Quiz)
                .ThenInclude(q => q.Course)
                .Include(sa => sa.Quiz)
                .ThenInclude(q => q.Questions) // make sure Questions are included
                .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.QuizId == quizId);

            if (studentAnswer == null) return NotFound("Quiz result not found.");

            // Parse answers JSON
            var parsedAnswers = JsonConvert.DeserializeObject<Dictionary<string, string>>(studentAnswer.AnswersJson) ?? new Dictionary<string, string>();

            // Calculate correct/wrong answers
            int correct = 0;
            int wrong = 0;

            foreach (var ans in parsedAnswers)
            {
                var question = studentAnswer.Quiz.Questions.FirstOrDefault(q => q.QuestionId.ToString() == ans.Key);
                if (question != null)
                {
                    if (question.CorrectOption.ToString() == ans.Value)
                        correct++;
                    else
                        wrong++;
                }
            }

            return Ok(new
            {
                quizId = studentAnswer.QuizId,
                quizTitle = studentAnswer.Quiz.Title,
                courseName = studentAnswer.Quiz.Course.Title,
                totalQuestions = studentAnswer.Quiz.Questions.Count,
                correctAnswers = correct,
                wrongAnswers = wrong,
                score = studentAnswer.Score,
                passed = studentAnswer.Score >= studentAnswer.Quiz.PassingScore,
                submittedAt = studentAnswer.SubmittedAt,
                duration = studentAnswer.Duration,
                answers = parsedAnswers
            });
        }
        [HttpGet("check/{quizId}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> CheckQuizStatus(int quizId)
        {
            // =============== Validate Student ===============
            // Get student ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ??
                              User.FindFirst("userId") ??
                              User.FindFirst("id") ??
                              User.FindFirst("sub");

            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("Invalid token or student not found.");

            int studentId = int.Parse(userIdClaim.Value);

            // =============== Validate Quiz Exists ===============
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.QuizId == quizId);
            if (quiz == null)
                return NotFound($"Quiz with ID {quizId} does not exist.");

            // =============== Check student submission ===============
            var quizResult = await _context.StudentAnswers
                .FirstOrDefaultAsync(r => r.QuizId == quizId && r.StudentId == studentId);

            if (quizResult == null)
            {
                return Ok(new
                {
                    quizId = quizId,
                    status = "not_attempted"
                });
            }

            return Ok(new
            {
                quizId = quizId,
                status = "submitted",
                score = quizResult.Score,
                //isPassed = quizResult.IsPassed
            });
        }

    }
}