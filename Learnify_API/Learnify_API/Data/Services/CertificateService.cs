using Learnify_API.Data;
using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Learnify_API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly AppDbContext _context;

        public CertificateService(AppDbContext context)
        {
            _context = context;
        }

        // تحقق إذا الطالب أكمل كل دروس الكورس (بدون كويز)
        public async Task<bool> CheckStudentCompletedCourseAsync(int studentId, int courseId)
        {
            var lessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .ToListAsync();

            if (!lessons.Any()) return false;

            var lessonIds = lessons.Select(l => l.LessonId).ToList();

            var completedLessonsCount = await _context.LessonProgresses
                .Where(lp => lp.StudentId == studentId && lp.IsCompleted && lessonIds.Contains(lp.LessonId))
                .CountAsync();

            return completedLessonsCount == lessons.Count;
        }

        // إنشاء الشهادة إذا غير موجودة والكورس مكتمل
        public async Task<CertificateVM?> CreateCertificateAsync(int studentId, int instructorId, int courseId)
        {
            var isCompleted = await CheckStudentCompletedCourseAsync(studentId, courseId);
            if (!isCompleted) return null;

            // تحقق إذا الشهادة موجودة مسبقًا
            var existing = await _context.Certificates
                .Include(c => c.Course)
                .Include(c => c.Student).ThenInclude(s => s.User)
                .FirstOrDefaultAsync(c => c.StudentId == studentId && c.CourseId == courseId);

            if (existing != null)
            {
                return new CertificateVM
                {
                    CertificateId = existing.CertificateId,
                    CourseName = existing.Course.Title,
                    StudentName = existing.Student.User.FullName,
                    CertificateUrl = existing.CertificateUrl,
                    IssuedAt = existing.IssuedAt
                };
            }

            // إنشاء شهادة جديدة
            var certificate = new Certificate
            {
                CertificateId = Guid.NewGuid().ToString(),
                StudentId = studentId,
                InstructorId = instructorId,
                CourseId = courseId,
                CertificateUrl = $"certificates/{Guid.NewGuid()}.pdf",
                IssuedAt = DateTime.Now
            };

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            // إعادة تحميل الشهادة مع العلاقات
            certificate = await _context.Certificates
                .Include(c => c.Course)
                .Include(c => c.Student).ThenInclude(s => s.User)
                .FirstAsync(c => c.CertificateId == certificate.CertificateId);

            return new CertificateVM
            {
                CertificateId = certificate.CertificateId,
                CourseName = certificate.Course.Title,
                StudentName = certificate.Student.User.FullName,
                CertificateUrl = certificate.CertificateUrl,
                IssuedAt = certificate.IssuedAt
            };
        }

        // جلب كل الشهادات للطالب (ينشئها تلقائيًا إذا الكورس مكتمل)
        public async Task<List<CertificateVM>> GetStudentCertificatesAsync(int studentId)
        {
            var enrollments = await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.StudentId == studentId)
                .ToListAsync();

            var result = new List<CertificateVM>();

            foreach (var enrollment in enrollments)
            {
                var certificate = await CreateCertificateAsync(
                    studentId,
                    enrollment.Course.InstructorId,
                    enrollment.CourseId
                );

                if (certificate != null)
                    result.Add(certificate);
            }

            return result;
        }
    }
}
