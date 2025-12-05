using Learnify_API.Data;
using Learnify_API.Data.Models;
using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

public class DashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    // -------------------------
    // STUDENT DASHBOARD
    // -------------------------
    public async Task<StudentDashboardVM?> GetStudentDashboard(int studentId)
    {
        // Get the user with the related student entity
        var student = await _context.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.UserId == studentId);

        if (student == null) return null;

        // Total Courses & Completed Courses
        var enrollments = await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .ToListAsync();

        var totalCourses = enrollments.Count;
        var completedCourses = enrollments.Count(e => e.IsCompleted);

        // Certificates earned
        var certificatesEarned = await _context.Certificates
            .Where(c => c.StudentId == studentId)
            .CountAsync();

        // Quizzes passed & total
        var quizzesTotal = await _context.Quizzes
            .Include(q => q.Course)
            .Where(q => q.Course.Enrollments.Any(e => e.StudentId == studentId))
            .CountAsync();

        var quizzesPassed = await _context.Quizzes
            .Include(q => q.Course)
            .Where(q => q.Course.Enrollments.Any(e => e.StudentId == studentId) && q.TotalMarks >= q.PassingScore)
            .CountAsync();

        // Notifications
        var notifications = await _context.Notifications
            .Where(n => n.ReceiverEmail == student.Email)
            .ToListAsync();

        //// LiveSessions (if you have LiveSessions entity)
        //var liveSessions = await _context.LiveSessions
        //    .Where(ls => ls.StudentId == studentId)
        //    .ToListAsync();

        //// FinalProjects
        //var finalProjects = await _context.FinalProjects
        //    .Where(fp => fp.StudentId == studentId)
        //    .ToListAsync();

        // Construct view model
        var vm = new StudentDashboardVM
        {
            FullName = student.FullName,
            Email = student.Email,
            Department = student.Student?.Department,
            Avatar = string.IsNullOrEmpty(student.ProfileImage) ? null : student.ProfileImage,

            TotalCourses = totalCourses,
            CompletedCourses = completedCourses,
            CertificatesEarned = certificatesEarned,

            QuizzesPassed = quizzesPassed,
            QuizzesTotal = quizzesTotal,
            SuccessRate = quizzesTotal == 0 ? 0 : (quizzesPassed * 100 / quizzesTotal),

            // Uncomment these if you want to send them to frontend
            // LiveSessions = liveSessions,
            // FinalProjects = finalProjects,
            Notifications = notifications
        };

        return vm;
    }

    // -------------------------
    // INSTRUCTOR DASHBOARD
    // -------------------------
    public async Task<InstructorDashboardVM?> GetInstructorDashboard(int instructorId, StudentService stu)
    {
        var instructor = await _context.Users
            .Include(u => u.Instructor)
            .FirstOrDefaultAsync(u => u.UserId == instructorId);

        if (instructor == null) return null;

        // Courses created by instructor
        var coursesCreatedList = await _context.Courses
            .Include(c => c.Quizzes) // جلب الكويزات
            .Include(c => c.Enrollments) // جلب الطلاب المسجلين
            .Where(c => c.InstructorId == instructorId)
            .ToListAsync();

        var coursesCreated = coursesCreatedList.Count;

        // Total students (students enrolled in instructor's courses)
        var totalStudents = coursesCreatedList
            .SelectMany(c => c.Enrollments ?? new List<Enrollment>())
            .Select(e => e.StudentId)
            .Distinct()
            .Count();

        // Certificates issued for instructor's courses
        var certificatesIssued = await _context.Certificates
            .Where(c => coursesCreatedList.Select(course => course.CourseId).Contains(c.CourseId))
            .CountAsync();

        // Total quizzes for instructor
        var quizzesCreated = coursesCreatedList
            .SelectMany(c => c.Quizzes ?? new List<Quiz>())
            .ToList();
        var totalQuizzes = quizzesCreated.Count;

        // Total students passed any quiz
        var quizIds = quizzesCreated.Select(q => q.QuizId).ToList();
        var studentsPassedQuizzes = await _context.StudentAnswers
            .Where(sa => quizIds.Contains(sa.QuizId) && sa.Score >= sa.Quiz.PassingScore)
            .Select(sa => sa.StudentId)
            .Distinct()
            .CountAsync();

        // Notifications for instructor
        var notifications = await _context.Notifications
            .Where(n => n.ReceiverEmail == instructor.Email)
            .ToListAsync();

        return new InstructorDashboardVM
        {
            FullName = instructor.FullName,
            Email = instructor.Email,
            Department = instructor.Instructor?.Specialization ?? "",
            Role = "instructor",
            Avatar = string.IsNullOrEmpty(instructor.ProfileImage) ? null : instructor.ProfileImage,

            TotalStudents = totalStudents,
            CoursesCreated = coursesCreated,
            TotalQuizzes = totalQuizzes, // عدد الكويزات
            StudentsPassedQuizzes = studentsPassedQuizzes, // عدد الطلاب اللي نجحوا
            CertificatesIssued = certificatesIssued,

            Notifications = notifications
        };
    }



    // -------------------------
    // ADMIN DASHBOARD
    // -------------------------
    public async Task<AdminDashboardVM?> GetAdminDashboard(int adminId)
    {
        var admin = await _context.Users
            .Include(u => u.Admin)
            .FirstOrDefaultAsync(u => u.UserId == adminId);

        if (admin == null) return null;

        // Total counts
        var totalStudents = await _context.Students.CountAsync();
        var totalInstructors = await _context.Instructors.CountAsync();
        var totalCourses = await _context.Courses.CountAsync();
        var certificatesIssued = await _context.Certificates.CountAsync();

        // Notifications for admin
        var notifications = await _context.Notifications
            .Where(n => n.ReceiverEmail == admin.Email)
            .ToListAsync();

        return new AdminDashboardVM
        {
            FullName = admin.FullName,
            Email = admin.Email,
            Avatar = string.IsNullOrEmpty(admin.ProfileImage) ? null : admin.ProfileImage,

            TotalStudents = totalStudents,
            TotalInstructors = totalInstructors,
            TotalCourses = totalCourses,
            CertificatesIssued = certificatesIssued,

            // Uncomment if needed
            Notifications = notifications
        };
    }

}
