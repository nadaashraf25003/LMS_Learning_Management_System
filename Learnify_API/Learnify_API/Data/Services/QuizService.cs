using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Learnify_API.Data.Services
{
    public class QuizService
    {
        private readonly AppDbContext _context;

        public QuizService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> IsStudentEnrolled(int studentId, int courseId)
        {
            return await _context.Enrollments.AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
        }

        // ================== GET ALL ==================
        public async Task<List<QuizVM>> GetAllQuizzesAsync()
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .ToListAsync();

            return quizzes.Select(q => new QuizVM
            {
                Id = q.QuizId,
                LessonId = q.LessonId,
                CourseId = q.CourseId,
                Title = q.Title,
                Duration = q.Duration,           // دلوقتي بيجي من DB
                PassingScore = q.PassingScore,   // دلوقتي بيجي من DB
                TotalQuestions = q.TotalQuestions,
                QuestionsEndpoint = "questions",
                Posted = $"{(DateTime.Now - q.CreatedAt).Days} days ago"
            }).ToList();
        }

        // ================== GET BY ID  ==================
        public async Task<QuizVM?> GetQuizByIdAsync(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.QuizId == id);

            if (quiz == null) return null;

            return new QuizVM
            {
                Id = quiz.QuizId,
                LessonId = quiz.LessonId,
                CourseId = quiz.CourseId,
                Title = quiz.Title,
                Duration = quiz.Duration,
                PassingScore = quiz.PassingScore,
                TotalMarks = quiz.TotalMarks,
                TotalQuestions = quiz.TotalQuestions,
                QuestionsEndpoint = "questions",
                Posted = $"{(DateTime.Now - quiz.CreatedAt).Days} days ago",
                Questions = quiz.Questions?.Select(q => new QuestionVM
                {
                    Id = q.QuestionId.ToString(),
                    Text = q.QuestionText,
                    Answer = q.CorrectOption.ToString().ToLower(),   // 'A' → "a"

                    Options = new List<QuestionOptionVM>
                    {
                        new QuestionOptionVM { Id = "a", Text = q.OptionA ?? "" },
                        new QuestionOptionVM { Id = "b", Text = q.OptionB ?? "" },
                        new QuestionOptionVM { Id = "c", Text = q.OptionC ?? "" },
                        new QuestionOptionVM { Id = "d", Text = q.OptionD ?? "" }
                    }
                }).ToList()
            };
        }

        // ================== CREATE ==================
        public async Task<QuizVM> CreateQuizAsync(QuizVM quizVM, int instructorId)
        {
            // تأكد إن الكورس موجود وبيخص الـ Instructor ده
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == quizVM.CourseId && c.InstructorId == instructorId);

            if (course == null)
                throw new Exception("Course not found or doesn't belong to you.");

            var quiz = new Quiz
            {
                LessonId = quizVM.LessonId,
                CourseId = quizVM.CourseId,
                Title = quizVM.Title,
                Duration = quizVM.Duration,
                PassingScore = quizVM.PassingScore,
                TotalMarks = quizVM.TotalMarks,
                TotalQuestions = quizVM.TotalQuestions,
                CreatedAt = DateTime.Now
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            //// تحديث الـ VM بعد الإنشاء
            //quizVM.Id = quiz.QuizId;
            //quizVM.TotalQuestions = 0;
            //quizVM.Posted = "0 days ago";
            //quizVM.QuestionsEndpoint = "questions";

            return quizVM;
        }


        // ================== UPDATE ==================
        public async Task<QuizVM?> UpdateQuizAsync(int id, QuizVM quizVM)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return null;

            quiz.Title = quizVM.Title;
            quiz.CourseId = quizVM.CourseId;
            quiz.LessonId = quizVM.LessonId;
            quiz.Duration = quizVM.Duration;
            quiz.PassingScore = quizVM.PassingScore;
            quiz.TotalMarks = quizVM.TotalMarks;
            quiz.TotalQuestions = quizVM.TotalQuestions;

            //quiz.TotalQuestions = quizVM.TotalQuestions; // <-- added

            await _context.SaveChangesAsync();

            quizVM.Id = quiz.QuizId;
            return quizVM;
        }

        // ================== DELETE ==================
        public async Task<bool> DeleteQuizAsync(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return false;

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get Quizzes by Instructor
        public async Task<IEnumerable<QuizVM>> GetQuizzesByInstructorAsync(int instructorId)
        {
            // تأكيد إن الـ Instructor موجود
            var instructorExists = await _context.Instructors.AnyAsync(i => i.InstructorId == instructorId);
            if (!instructorExists)
                return new List<QuizVM>();

            // جلب الكويزات الخاصة بالكورسات بتاعة الـ Instructor
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .Include(q => q.Course) // لازم Course عشان نعرف InstructorId
                .Where(q => q.Course.InstructorId == instructorId)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return quizzes.Select(q => new QuizVM
            {
                Id = q.QuizId,
                CourseId = q.CourseId,
                Title = q.Title,
                Duration = q.Duration,
                PassingScore = q.PassingScore,
                TotalQuestions = q.Questions?.Count ?? 0,
                QuestionsEndpoint = "questions",
                Posted = $"{(DateTime.Now - q.CreatedAt).Days} days ago"
            }).ToList();
        }

        public async Task<int?> GetInstructorIdByUserId(int userId)
        {
            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.User.UserId == userId); // أو i.UserId حسب الـ Model عندك

            return instructor?.InstructorId;
        }

        public async Task<CourseVM?> GetCourseByIdAsync(int id)
        {
            var c = await _context.Courses
                 .Include(x => x.Instructor)
                     .ThenInclude(i => i.User)
                 .Include(x => x.Lessons)       // ← Add lessons
                 .Include(x => x.Quizzes)       // ← Add quizzes
                 .FirstOrDefaultAsync(x => x.CourseId == id);
            if (c == null) return null;

            return new CourseVM
            {
                Id = c.CourseId,
                Title = c.Title,
                Description = c.Description ?? "",
                Category = c.Category ?? "",
                Author = c.Instructor.User.FullName ?? "Unknown",
                AuthorId = c.InstructorId,
                Views = c.Views,
                Posted = c.Posted,
                Rating = c.Rating,
                Hours = c.Hours,
                Price = c.Price,
                Tag = c.Tag,
                Image = c.Image,
                StudentsEnrolled = c.StudentsEnrolled,
                CertificateIncluded = c.CertificateIncluded,
                Duration = c.Duration,
                InstructorId = c.InstructorId,
                IsApproved = c.IsApproved,

                Lessons = c.Lessons != null
                    ? c.Lessons.Select(l => new LessonVM
                    {
                        LessonId = l.LessonId,
                        Title = l.Title,
                        Duration = l.Duration,
                        ContentType = l.ContentType
                    }).ToList()
                    : new List<LessonVM>(),

                Quizzes = c.Quizzes != null
                    ? c.Quizzes.Select(q => new QuizVM
                    {
                        Id = q.QuizId,
                        Title = q.Title,
                        Duration = q.Duration,
                        PassingScore = q.PassingScore,
                        TotalQuestions = q.Questions?.Count ?? 0
                    }).ToList()
                    : new List<QuizVM>()


            };

        }

        public async Task<StudentAnswer> SubmitQuizAsync(int studentId, int quizId, Dictionary<string, string> answers, DateTime startTime, DateTime endTime)
        {
            // Load the quiz entity including its Course and Questions
            var quizEntity = await _context.Quizzes
                .Include(q => q.Course)
                    .ThenInclude(c => c.Quizzes)
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.QuizId == quizId);

            if (quizEntity == null) throw new Exception("Quiz not found");

            // Calculate score
            int score = 0;
            foreach (var q in quizEntity.Questions)
            {
                if (answers.TryGetValue(q.QuestionId.ToString(), out string ans))
                {
                    if (q.CorrectOption.ToString().ToLower() == ans.ToLower()) score++;
                }
            }

            int totalQuestions = quizEntity.Questions.Count;
            int percentage = (int)((score / (double)totalQuestions) * 100);

            var duration = $"{(endTime - startTime).Minutes}m {(endTime - startTime).Seconds}s";

            // Save StudentAnswer
            var studentAnswer = new StudentAnswer
            {
                StudentId = studentId,
                QuizId = quizId,
                AnswersJson = JsonSerializer.Serialize(answers),
                StartTime = startTime,
                EndTime = endTime,
                Duration = duration,
                SubmittedAt = DateTime.Now,
                Score = percentage
            };

            _context.StudentAnswers.Add(studentAnswer);
            await _context.SaveChangesAsync();

            // Update enrollment progress
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == quizEntity.CourseId);

            if (enrollment != null)
            {
                var completedQuizzes = await _context.StudentAnswers
                    .CountAsync(sa => sa.StudentId == studentId && sa.Quiz.CourseId == quizEntity.CourseId);

                var totalQuizzes = quizEntity.Course.Quizzes?.Count ?? 0;
                enrollment.Progress = ((decimal)completedQuizzes / totalQuizzes) * 100;
                enrollment.IsCompleted = enrollment.Progress >= 100;
                await _context.SaveChangesAsync();
            }

            return studentAnswer;
        }

        public async Task<bool> HasStudentSubmittedQuizAsync(int studentId, int quizId)
        {
            return await _context.StudentAnswers
                .AnyAsync(sa => sa.StudentId == studentId && sa.QuizId == quizId);
        }

    }
}
