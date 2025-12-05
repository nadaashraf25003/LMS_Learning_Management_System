namespace Learnify_API.Services.Interfaces
{
    public interface ICertificateService
    {
        Task<bool> CheckStudentCompletedCourseAsync(int studentId, int courseId);
        Task<CertificateVM?> CreateCertificateAsync(int studentId, int instructorId, int courseId);
        Task<List<CertificateVM>> GetStudentCertificatesAsync(int studentId);
    }
}
