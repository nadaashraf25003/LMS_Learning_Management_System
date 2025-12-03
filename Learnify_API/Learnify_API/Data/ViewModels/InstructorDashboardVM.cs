using Learnify_API.Data.Models;

namespace Learnify_API.Data.ViewModels
{
    public class InstructorDashboardVM
    {
        public string Role { get; set; } = "instructor";
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Department { get; set; }
        public string? Avatar { get; set; }
        // Stats
        public int TotalStudents { get; set; }
        public int CoursesCreated { get; set; }
        public int ProjectsSupervised { get; set; }
        public int CertificatesIssued { get; set; }

        // Relations
        //public List<LiveSession> LiveSessions { get; set; }
        public List<Notification>? Notifications { get; set; }
    }

}
