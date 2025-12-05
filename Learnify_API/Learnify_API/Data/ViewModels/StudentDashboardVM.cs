using Learnify_API.Data.Models;

namespace Learnify_API.Data.ViewModels
{
    public class StudentDashboardVM
    {
        public string Role { get; set; } = "student";
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Department { get; set; }
        public string? Avatar { get; set; }

        // Stats
        public int TotalCourses { get; set; }
        public int CompletedCourses { get; set; }
        public int CertificatesEarned { get; set; }

        // Quizzes
        public int QuizzesPassed { get; set; }
        public int QuizzesTotal { get; set; }
        public int SuccessRate { get; set; }
        public int QuizzesAttempted { get; set; }

        // Relations from DB
        //public List<LiveSession> LiveSessions { get; set; }
        //public List<FinalProject> FinalProjects { get; set; }
        public List<Notification>? Notifications { get; set; }
    }

}
