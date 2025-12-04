using Learnify_API.Data.Models;

namespace Learnify_API.Data.ViewModels
{
    public class AdminDashboardVM
    {
        public string Role { get; set; } = "admin";
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
        // Stats
        public int TotalStudents { get; set; }
        public int TotalInstructors { get; set; }
        public int TotalCourses { get; set; }
        public int CertificatesIssued { get; set; }

        public List<Notification>? Notifications { get; set; }
    }

}
