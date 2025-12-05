using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class CourseService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CourseService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        //  Add Course
        public async Task<bool> AddCourseAsync(CourseVM model)
        {
            string imagePath = "/images/course/default-course.webp"; // default image

            if (model.ImageFormFile != null && model.ImageFormFile.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{model.ImageFormFile.FileName}";
                var fullPath = Path.Combine(_env.WebRootPath, "images/course", fileName);

                var dir = Path.GetDirectoryName(fullPath);
                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await model.ImageFormFile.CopyToAsync(stream);

                imagePath = $"/images/course/{fileName}";
            }

            var instructor = await _context.Instructors.FindAsync(model.InstructorId);
            if (instructor == null) return false;

            var course = new Course
            {
                Title = model.Title,
                Description = model.Description,
                Category = model.Category,
                Price = model.Price ?? 0,
                InstructorId = model.InstructorId,
                Views = model.Views ?? "0 views",
                Rating = model.Rating,
                Hours = model.Hours ?? "0 hours",
                Tag = model.Tag,
                Image = imagePath,
                StudentsEnrolled = model.StudentsEnrolled,
                CertificateIncluded = model.CertificateIncluded,
                Duration = model.Duration ?? "0 hours",
                Posted = model.Posted ?? "Just now",
                IsApproved = false,
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get All Pending Courses (for Admin)
        public async Task<IEnumerable<CourseVM>> GetAllPendingCoursesAsync()
        {
            return await _context.Courses
                .Include(c => c.Instructor)
                    .ThenInclude(i => i.User)
                .Where(c => !c.IsApproved)
                .Select(c => new CourseVM
                {
                    Id = c.CourseId,
                    Title = c.Title,
                    Category = c.Category ?? "",
                    Description = c.Description ?? "",
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
                    IsApproved = c.IsApproved
                })
                .ToListAsync();
        }

        // Get All Approved Courses
        public async Task<IEnumerable<CourseVM>> GetAllApprovedCoursesAsync()
        {
            return await _context.Courses
                .Include(c => c.Instructor)
                .ThenInclude(i => i.User)
                .Where(c => c.IsApproved)
                .Select(c => new CourseVM
                {
                    Id = c.CourseId,
                    Title = c.Title,
                    Category = c.Category ?? "",
                    Description = c.Description ?? "",
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
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        // Get Course By Id
        public async Task<CourseVM?> GetCourseByIdAsync(int id)
        {
            var c = await _context.Courses
                 .Include(x => x.Instructor)
                     .ThenInclude(i => i.User)
                 .Include(x => x.Lessons)
                 .Include(x => x.Quizzes)
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
                CreatedAt = c.CreatedAt,
                Lessons = c.Lessons?
                  .OrderBy(l => l.Order)
                  .Select(l => new LessonVM
                  {
                      LessonId = l.LessonId,
                      Title = l.Title,
                      Order = l.Order,
                      Duration = l.Duration,
                  }).ToList(),
                Quizzes = c.Quizzes?
                  .Select(q => new QuizVM
                  {
                      Id = q.QuizId,
                      CourseId = q.CourseId,
                      LessonId = q.LessonId,
                      Title = q.Title,
                      Duration = q.Duration,
                      PassingScore = q.PassingScore,
                      TotalMarks = q.TotalMarks,
                      TotalQuestions = q.TotalQuestions,
                      QuestionsEndpoint = $"/api/quizzes/{q.QuizId}/questions",
                  }).ToList()
            };
        }

        // Approve Course (Admin)
        public async Task<bool> ApproveCourseAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            course.IsApproved = true;
            await _context.SaveChangesAsync();
            return true;
        }

        // Update Course
        public async Task<bool> UpdateCourseAsync(int id, CourseVM model, int userId, bool isAdmin = false)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            if (!isAdmin && course.InstructorId != userId) return false;

            course.Title = model.Title;
            course.Description = model.Description;
            course.Category = model.Category;
            course.Price = model.Price ?? 0;
            course.Hours = model.Hours ?? course.Hours;
            course.Tag = model.Tag;
            course.CertificateIncluded = model.CertificateIncluded;
            course.Duration = model.Duration ?? course.Duration;
            course.IsApproved = false;

            if (model.ImageFormFile != null && model.ImageFormFile.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{model.ImageFormFile.FileName}";
                var fullPath = Path.Combine(_env.WebRootPath, "images/course", fileName);

                var dir = Path.GetDirectoryName(fullPath);
                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await model.ImageFormFile.CopyToAsync(stream);

                course.Image = $"/images/course/{fileName}";
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // Delete Course
        public async Task<bool> DeleteCourseAsync(int id, int instructorId, bool isAdmin = false)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            if (!isAdmin && course.InstructorId != instructorId)
                return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        // Enroll Student
        public async Task EnrollStudentAsync(int courseId, int studentId)
        {
            var enrollment = new Enrollment
            {
                CourseId = courseId,
                StudentId = studentId,
                EnrollmentDate = DateTime.Now
            };
            _context.Enrollments.Add(enrollment);

            var course = await _context.Courses.FindAsync(courseId);
            if (course != null)
                course.StudentsEnrolled += 1;

            await _context.SaveChangesAsync();
        }
    }
}
