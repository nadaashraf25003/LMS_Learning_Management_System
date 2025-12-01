using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class StudentService
    {
        private readonly AppDbContext _context;

        public StudentService(AppDbContext context)
        {
            _context = context;
        }

        // -------- Add Student with optional course --------
        public async Task<StudentVM> AddStudentAsync(StudentVM model, List<int>? courseIds = null)
        {
            // 1. Add User
            var user = new User
            {
                FullName = model.Name,
                Email = model.Email,
                Role = "Student",
                ProfileImage = model.Image
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 2. Add Student
            var student = new Student
            {
                StudentId = user.UserId,
                EnrollmentNo = $"ENR-{Guid.NewGuid().ToString().Substring(0, 6)}",
                Department = model.University,
                User = user
            };
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            // 3. Add Enrollments
            if (courseIds != null)
            {
                foreach (var courseId in courseIds)
                {
                    var enrollment = new Enrollment
                    {
                        StudentId = student.StudentId,
                        CourseId = courseId,
                        EnrollmentDate = DateTime.Now
                    };
                    _context.Enrollments.Add(enrollment);
                }
                await _context.SaveChangesAsync();
            }

            // 4. Return StudentVM
            var enrolledCourses = courseIds != null
                ? await _context.Courses.Where(c => courseIds.Contains(c.CourseId)).Select(c => c.Title).ToListAsync()
                : new List<string>();

            model.Id = student.StudentId.ToString();
            model.Courses = enrolledCourses;
            return model;
        }

        // -------- Get all students (admin) --------
        public async Task<IEnumerable<StudentVM>> GetAllStudentsAsync()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .ToListAsync();

            return students.Select(s => new StudentVM
            {
                Id = s.StudentId.ToString(),
                Name = s.User.FullName,
                Email = s.User.Email,
                Image = s.User.ProfileImage ?? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                University = s.University ?? "Unknown",
                Country = s.Country ?? "Unknown",
                Title = "Full Stack Web Student",
                Courses = s.Enrollments != null
                    ? s.Enrollments.Select(e => e.Course.Title).ToList()
                    : new List<string>()
            });
        }

        // -------- Get students by instructor --------
        public async Task<IEnumerable<StudentVM>> GetStudentsByInstructorAsync(int instructorId)
        {
            var enrollments = await _context.Enrollments
                .Include(e => e.Student).ThenInclude(s => s.User)
                .Include(e => e.Course)
                .Where(e => e.Course.InstructorId == instructorId)
                .ToListAsync();

            var students = enrollments
                .GroupBy(e => e.Student)
                .Select(g => new StudentVM
                {
                    Id = g.Key.StudentId.ToString(),
                    Name = g.Key.User.FullName,
                    Email = g.Key.User.Email,
                    Image = g.Key.Image ?? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                    University = g.Key.University ?? "Unknown",
                    Country = g.Key.Country ?? "Unknown",
                    Title = "Full Stack Web Student",
                    Courses = g.Select(e => e.Course.Title).Distinct().ToList()
                })
                .ToList();

            return students;
        }

        // Save a course
        public async Task<bool> SaveCourseAsync(int studentId, int courseId)
        {
            var exists = await _context.SavedCourses
                .AnyAsync(s => s.StudentId == studentId && s.CourseId == courseId);

            if (exists) return false;

            var saved = new SavedCourse
            {
                StudentId = studentId,
                CourseId = courseId
            };

            _context.SavedCourses.Add(saved);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get saved courses list
        public async Task<IEnumerable<CourseVM>> GetSavedCoursesAsync(int studentId)
        {
            return await _context.SavedCourses
                .Include(c => c.Course)
                .Where(c => c.StudentId == studentId)
                .Select(c => new CourseVM
                {
                    Id = c.Course.CourseId,
                    Title = c.Course.Title,
                    Category = c.Course.Category ?? "",
                    Description = c.Course.Description ?? "",  // ← ADD THIS
                    Author = c.Course.Instructor.User.FullName ?? "Unknown",
                    AuthorId = c.Course.InstructorId,
                    Views = c.Course.Views,
                    Posted = c.Course.Posted,
                    Rating = c.Course.Rating,
                    Hours = c.Course.Hours,
                    Price = c.Course.Price,
                    Tag = c.Course.Tag,
                    Image = c.Course.Image,
                    CertificateIncluded = c.Course.CertificateIncluded,
                    Duration = c.Course.Duration,
                    InstructorId = c.Course.InstructorId,
                    IsApproved = c.Course.IsApproved
                }).ToListAsync();
        }

        public async Task<bool> RemoveSavedCourseAsync(int studentId, int courseId)
        {
            var saved = await _context.SavedCourses
                .FirstOrDefaultAsync(s => s.StudentId == studentId && s.CourseId == courseId);

            if (saved == null) return false;

            _context.SavedCourses.Remove(saved);
            await _context.SaveChangesAsync();
            return true;
        }


        // -------- Get student's enrollments --------
        public async Task<IEnumerable<CourseVM>> GetEnrollmentsAsync(int studentId)
        {
            return await _context.Enrollments
                .Include(c => c.Course)
                .Where(c => c.StudentId == studentId)
                .Select(c => new CourseVM
                {

                    Id = c.Course.CourseId,
                    Title = c.Course.Title,
                    Category = c.Course.Category ?? "",
                    Description = c.Course.Description ?? "",  // ← ADD THIS
                    Author = c.Course.Instructor.User.FullName ?? "Unknown",
                    AuthorId = c.Course.InstructorId,
                    Views = c.Course.Views,
                    Posted = c.Course.Posted,
                    Rating = c.Course.Rating,
                    Hours = c.Course.Hours,
                    Price = c.Course.Price,
                    Tag = c.Course.Tag,
                    Image = c.Course.Image,
                    CertificateIncluded = c.Course.CertificateIncluded,
                    Duration = c.Course.Duration,
                    InstructorId = c.Course.InstructorId,
                    IsApproved = c.Course.IsApproved
                }).ToListAsync();
        }

        // -------- Enroll student in a course --------
        public async Task<bool> EnrollCourseAsync(int studentId, int courseId)
        {
            // التأكد من أن الطالب مش مسجل قبل كده
            var exists = await _context.Enrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (exists) return false;

            // إنشاء Enrollment
            var enrollment = new Enrollment
            {
                StudentId = studentId,
                CourseId = courseId,
                EnrollmentDate = DateTime.Now
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            // معالجة فلوس المدرس
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course != null)
            {
                decimal price = course.Price;
                decimal platformCut = price * 0.05m; // 5% للموقع
                decimal instructorAmount = price - platformCut;

                // إنشاء سجل Payout
                var payout = new InstructorPayout
                {
                    InstructorId = course.InstructorId,
                    Amount = instructorAmount,
                    Status = "Pending",
                    PaymentId = enrollment.EnrollmentId
                };
                var cours = await _context.Courses.FindAsync(courseId);
                if (cours != null)
                {
                    cours.StudentsEnrolled += 1;
                }
                _context.InstructorPayouts.Add(payout);
                await _context.SaveChangesAsync();
            }

            return true;
        }


        // Optional: Remove enrollment
        public async Task<bool> RemoveEnrollmentAsync(int studentId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (enrollment == null) return false;

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }


        // Add to cart
        public async Task<bool> AddToCartAsync(int studentId, int courseId)
        {
            var exists = await _context.CartItems.AnyAsync(c => c.StudentId == studentId && c.CourseId == courseId);
            if (exists) return false;

            var cartItem = new CartItem
            {
                StudentId = studentId,
                CourseId = courseId,
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get cart
        public async Task<IEnumerable<CourseVM>> GetCartAsync(int studentId)
        {
            return await _context.CartItems
                .Include(c => c.Course)
                .Where(c => c.StudentId == studentId)
                .Select(c => new CourseVM
                {
                    Id = c.Course.CourseId,
                    Title = c.Course.Title,
                    Category = c.Course.Category ?? "",
                    Description = c.Course.Description ?? "",
                    Price = c.Course.Price,
                    Author = c.Course.Instructor.User.FullName,
                    Image = c.Course.Image,
                    Tag = c.Course.Tag,
                    Rating = c.Course.Rating,
                    Hours = c.Course.Hours,
                }).ToListAsync();
        }

        // Remove from cart
        public async Task<bool> RemoveFromCartAsync(int studentId, int courseId)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.StudentId == studentId && c.CourseId == courseId);

            if (item == null) return false;

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
