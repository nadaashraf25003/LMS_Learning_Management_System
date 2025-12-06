using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class CourseService
    {
        private readonly AppDbContext _context;
        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        //  Add Course
        public async Task<bool> AddCourseAsync(CourseVM model)
        {

            var stream = new MemoryStream();
            model.ImageFormFile?.CopyTo(stream);
            var base64 = Convert.ToBase64String(stream.ToArray());
            base64 = "data:" + model.ImageFormFile?.ContentType + ";base64," + base64;

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
                Image = base64 ?? "/images/default-course.webp",
                StudentsEnrolled = model.StudentsEnrolled,
                CertificateIncluded = model.CertificateIncluded,
                Duration = model.Duration ?? "0 hours",
                Posted = model.Posted ?? $"{(DateTime.Now - DateTime.Now).Days} days ago",
                CreatedAt = DateTime.Now,
                IsApproved = false
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return true;
        }
        // Get All Pending (Unapproved) Courses — for Admin
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
                    Description = c.Description ?? "",  // ← ADD THIS
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


        //  Get All Approved Courses
        public async Task<IEnumerable<CourseVM>> GetAllApprovedCoursesAsync()
        {
            return await _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsApproved)
                .Select(c => new CourseVM
                {
                    Id = c.CourseId,
                    Title = c.Title,
                    Category = c.Category ?? "",
                    Description = c.Description ?? "",  // ← ADD THIS
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

        // Get Course by ID
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
                      CourseId = q.CourseId, // or q.LessonId if needed
                      LessonId = q.LessonId,
                      Title = q.Title,
                      Duration = q.Duration,
                      PassingScore = q.PassingScore,
                      TotalQuestions = q.TotalQuestions,
                      QuestionsEndpoint = $"/api/quizzes/{q.QuizId}/questions",
                      //Posted = q.Posted ?? ""
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


        // Update course (Instructor or Admin)
        public async Task<bool> UpdateCourseAsync(int id, CourseVM model, int userId, bool isAdmin = false)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            // Authorization: only instructor who owns the course or admin can update
            if (!isAdmin && course.InstructorId != userId) return false;

            // Update fields
            course.Title = model.Title;
            course.Description = model.Description;
            course.Category = model.Category;
            course.Price = model.Price ?? 0;
            course.Hours = model.Hours ?? course.Hours;
            course.Tag = model.Tag;
            course.CertificateIncluded = model.CertificateIncluded;
            course.Duration = model.Duration ?? course.Duration;

            // Handle image upload if a new file was provided
            if (model.ImageFormFile != null && model.ImageFormFile.Length > 0)
            {
                using var ms = new MemoryStream();
                await model.ImageFormFile.CopyToAsync(ms);
                var base64 = Convert.ToBase64String(ms.ToArray());
                course.Image = $"data:{model.ImageFormFile.ContentType};base64,{base64}";
            }
            // else keep the existing course.Image

            course.IsApproved = false; // mark as unapproved after edit

            await _context.SaveChangesAsync();
            return true;
        }


        // Delete Course (Instructor or Admin) 
        public async Task<bool> DeleteCourseAsync(int id, int instructorId, bool isAdmin = false)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return false;

            if (!isAdmin && course.InstructorId != instructorId)
                return false; // not authorized

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task EnrollStudentAsync(int courseId, int studentId)
        {
            // سجل الطالب في جدول Enrollments
            var enrollment = new Enrollment
            {
                CourseId = courseId,
                StudentId = studentId,
                EnrollmentDate = DateTime.Now
            };
            _context.Enrollments.Add(enrollment);

            // زوّد عدد الطلاب في الكورس
            var course = await _context.Courses.FindAsync(courseId);
            if (course != null)
            {
                course.StudentsEnrolled += 1;
            }

            // احفظ كل التغييرات
            await _context.SaveChangesAsync();
        }
    }
}
