using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class LessonService
    {
        private readonly AppDbContext _context;

        public LessonService(AppDbContext context)
        {
            _context = context;
        }

        // Add Lesson
        public async Task<bool> AddLessonAsync(CreateLessonRequest model)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.CourseId == model.CourseId);

            if (course == null)
                return false;

            int nextOrder = model.Order ?? await _context.Lessons
                .Where(l => l.CourseId == model.CourseId)
                .CountAsync() + 1;

            var lesson = new Lesson
            {
                CourseId = model.CourseId,
                Title = model.Title,
                VideoUrl = model.VideoUrl,
                Description = model.Description,
                Duration = model.Duration ?? 0,
                ContentType = model.ContentType ?? "Video",
                AttachmentUrl = model.AttachmentUrl,
                IsFreePreview = model.IsFreePreview,
                Order = nextOrder,
                CreatedAt = DateTime.Now
            };

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();
            return true;
        }


        // Update Lesson
        public async Task<bool> UpdateLessonAsync(int lessonId, UpdateLessonRequest model)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return false;

            lesson.Title = model.Title ?? lesson.Title;
            lesson.Description = model.Description ?? lesson.Description;
            lesson.VideoUrl = model.VideoUrl ?? lesson.VideoUrl;
            lesson.Duration = model.Duration ?? lesson.Duration;
            lesson.ContentType = model.ContentType ?? lesson.ContentType;
            lesson.AttachmentUrl = model.AttachmentUrl ?? lesson.AttachmentUrl;
            lesson.IsFreePreview = model.IsFreePreview ?? lesson.IsFreePreview;
            lesson.Order = model.Order ?? lesson.Order;

            await _context.SaveChangesAsync();
            return true;
        }


        // Delete Lesson
        public async Task<bool> DeleteLessonAsync(int lessonId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return false;

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
            return true;
        }


        // Get Lesson by Id
        public async Task<LessonVM?> GetLessonByIdAsync(int lessonId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return null;
            var quizzes = await _context.Quizzes
               .Where(q => q.LessonId == lessonId)
               .Select(q => new QuizVM
               {
                   Id = q.QuizId,
                   LessonId = q.LessonId,
                   Title = q.Title,
                   Duration = q.Duration,
                   PassingScore = q.PassingScore,
                   TotalQuestions = q.TotalQuestions,
                   QuestionsEndpoint = $"/api/quizzes/{q.QuizId}/questions",

               })
       .ToListAsync();

            return new LessonVM
            {
                LessonId = lesson.LessonId,
                CourseId = lesson.CourseId,
                Title = lesson.Title,
                VideoUrl = lesson.VideoUrl,
                Description = lesson.Description,
                Duration = lesson.Duration,
                ContentType = lesson.ContentType,
                AttachmentUrl = lesson.AttachmentUrl,
                IsFreePreview = lesson.IsFreePreview,
                Order = lesson.Order,
                CreatedAt = lesson.CreatedAt,
                Quizzes = quizzes


            };
        }


        // Get Lessons by Course
        public async Task<IEnumerable<LessonVM>> GetLessonsByCourseAsync(int courseId)
        {
            return await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.Order)
                .Select(l => new LessonVM
                {
                    LessonId = l.LessonId,
                    CourseId = l.CourseId,
                    Title = l.Title,
                    VideoUrl = l.VideoUrl,
                    Description = l.Description,
                    Duration = l.Duration,
                    ContentType = l.ContentType,
                    AttachmentUrl = l.AttachmentUrl,
                    IsFreePreview = l.IsFreePreview,
                    Order = l.Order,
                    CreatedAt = l.CreatedAt,


                })
                .ToListAsync();

        }

        // Get Progress By Course
        public async Task<IEnumerable<LessonProgressVM>> GetProgressByCourseAsync(int courseId, int studentId)
        {
            return await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .Select(l => new LessonProgressVM
                {
                    LessonId = l.LessonId,
                    StudentId = studentId,
                    IsCompleted = _context.LessonProgresses
                        .Any(p => p.LessonId == l.LessonId && p.StudentId == studentId && p.IsCompleted),
                    CompletedAt = _context.LessonProgresses
                        .Where(p => p.LessonId == l.LessonId && p.StudentId == studentId)
                        .Select(p => p.CompletedAt)
                        .FirstOrDefault()
                })
                .ToListAsync();
        }


        // Get Lessons By Instructor
        public async Task<IEnumerable<LessonVM>> GetLessonsByInstructorAsync(int instructorId)
        {
            // 👌 أولاً: تأكيد إن الـ Instructor موجود
            var instructorExists = await _context.Instructors
                .AnyAsync(i => i.InstructorId == instructorId);

            if (!instructorExists)
                return new List<LessonVM>(); // أو ترجعي null حسب المتفق عليه


            // 👌 ثانياً: جلب الدروس مع Include للـ Course
            return await _context.Lessons
                .Include(l => l.Course)
                .Where(l => l.Course.InstructorId == instructorId)
                .OrderBy(l => l.Order)
                .Select(l => new LessonVM
                {
                    LessonId = l.LessonId,
                    CourseId = l.CourseId,
                    Title = l.Title,
                    VideoUrl = l.VideoUrl,
                    Description = l.Description,
                    Duration = l.Duration,
                    ContentType = l.ContentType,
                    AttachmentUrl = l.AttachmentUrl,
                    IsFreePreview = l.IsFreePreview,
                    Order = l.Order,
                    CreatedAt = l.CreatedAt,

                    Quizzes = _context.Quizzes
                        .Where(q => q.LessonId == l.LessonId)
                        .Select(q => new QuizVM
                        {
                            Id = q.QuizId,
                            LessonId = q.LessonId,
                            Title = q.Title,
                            Duration = q.Duration,
                            PassingScore = q.PassingScore,
                            TotalQuestions = q.TotalQuestions,
                            QuestionsEndpoint = $"/api/quizzes/{q.QuizId}/questions",
                        })
                        .ToList()

                })
                .ToListAsync();
        }
        public async Task<int?> GetInstructorIdByUserId(int userId)
        {
            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.User.UserId == userId); // ← التصحيح هنا

            return instructor?.InstructorId;
        }



        // Check Enrollment
        private async Task<bool> IsStudentEnrolled(int studentId, int courseId)
        {
            return await _context.Enrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
        }

        // Get Lessons By Course - Student
        public async Task<IEnumerable<LessonVM>?> GetLessonsForStudentAsync(int courseId, int studentId)
        {
            if (!await IsStudentEnrolled(studentId, courseId)) return null;

            return await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.Order)
                .Select(l => new LessonVM
                {
                    LessonId = l.LessonId,
                    CourseId = l.CourseId,
                    Title = l.Title,
                    VideoUrl = l.VideoUrl,
                    Description = l.Description,
                    Duration = l.Duration,
                    ContentType = l.ContentType,
                    AttachmentUrl = l.AttachmentUrl,
                    IsFreePreview = l.IsFreePreview,
                    Order = l.Order,
                    CreatedAt = l.CreatedAt,
                })
                .ToListAsync();
        }

        // Get single lesson for student
        public async Task<LessonVM?> GetLessonForStudentAsync(int lessonId, int studentId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return null;

            if (!await IsStudentEnrolled(studentId, lesson.CourseId)) return null;
            var quizzes = await _context.Quizzes
              .Where(q => q.LessonId == lessonId)
              .Select(q => new QuizVM
              {
                  Id = q.QuizId,
                  LessonId = q.LessonId,
                  Title = q.Title,
                  Duration = q.Duration,
                  PassingScore = q.PassingScore,
                  TotalQuestions = q.TotalQuestions,
                  QuestionsEndpoint = $"/api/quizzes/{q.QuizId}/questions",

              })
      .ToListAsync();
            return new LessonVM
            {
                LessonId = lesson.LessonId,
                CourseId = lesson.CourseId,
                Title = lesson.Title,
                VideoUrl = lesson.VideoUrl,
                Description = lesson.Description,
                Duration = lesson.Duration,
                ContentType = lesson.ContentType,
                AttachmentUrl = lesson.AttachmentUrl,
                IsFreePreview = lesson.IsFreePreview,
                Order = lesson.Order,
                CreatedAt = lesson.CreatedAt,
                Quizzes = quizzes,
                IsCompleted = await _context.LessonProgresses
                    .AnyAsync(p => p.LessonId == lessonId && p.StudentId == studentId && p.IsCompleted)
            };
        }

        // Mark lesson completed by student
        public async Task<bool> MarkLessonCompletedAsync(int lessonId, int studentId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return false;

            if (!await IsStudentEnrolled(studentId, lesson.CourseId)) return false;

            var progress = await _context.LessonProgresses
                .FirstOrDefaultAsync(p => p.LessonId == lessonId && p.StudentId == studentId);

            if (progress == null)
            {
                progress = new LessonProgress
                {
                    LessonId = lessonId,
                    StudentId = studentId,
                    IsCompleted = true,
                    CompletedAt = DateTime.Now
                };
                _context.LessonProgresses.Add(progress);
            }
            else
            {
                progress.IsCompleted = true;
                progress.CompletedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // Course Progress
        public async Task<double?> GetProgressAsync(int courseId, int studentId)
        {
            if (!await IsStudentEnrolled(studentId, courseId))
                return null;

            // ===== Lessons =====
            var totalLessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .CountAsync();

            var completedLessons = await _context.LessonProgresses
                .Where(p => p.StudentId == studentId &&
                            p.IsCompleted &&
                            p.Lesson.CourseId == courseId)
                .CountAsync();

            // ===== Quizzes =====
            var totalQuizzes = await _context.Quizzes
                .Where(q => q.CourseId == courseId)
                .CountAsync();

            var completedQuizzes = await _context.StudentAnswers
                .Where(sa => sa.StudentId == studentId &&
                             sa.Quiz.CourseId == courseId)
                .Select(sa => sa.QuizId)
                .Distinct()
                .CountAsync();

            // ===== Total Items =====
            int totalItems = totalLessons + totalQuizzes;
            int completedItems = completedLessons + completedQuizzes;

            if (totalItems == 0) return 0;

            return (completedItems / (double)totalItems) * 100;
        }

    }
}
