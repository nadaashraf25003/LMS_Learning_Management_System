using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Learnify_API.Data.Models
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }

        // Foreign key to Userdd
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserEntity { get; set; } = null!; // Navigation property

        public string? Role { get; set; }
        public UserInfo User { get; set; } = new UserInfo();
        public string? CoverImage { get; set; }
        public SocialLinks SocialLinks { get; set; } = new SocialLinks();

        [NotMapped]
        public List<Stat> Stats { get; set; } = new List<Stat>();

        public string About { get; set; } = "";

        [NotMapped]
        public InstructorTabContent InstructorTabContent { get; set; } = new InstructorTabContent();

        [NotMapped]
        public AdminTabContent AdminTabContent { get; set; } = new AdminTabContent();
        [NotMapped]
        public StudentTabContent StudentTabContent { get; set; } = new StudentTabContent();

        [NotMapped]
        public List<ActionButton> Actions { get; set; } = new List<ActionButton>();
    }

    public class UserInfo
    {
        public string? Name { get; set; } = "";
        public string? Avatar { get; set; }
        public string? RoleTitle { get; set; } = "";
    }

    public class SocialLinks
    {
        public string Facebook { get; set; } = "";
        public string Twitter { get; set; } = "";
        public string LinkedIn { get; set; } = "";
        public string Github { get; set; } = "";
    }

    public class Stat
    {
        public string Label { get; set; } = "";
        public int Value { get; set; }
    }

    public class ActionButton
    {
        public int? Id { get; set; }
        public string? Label { get; set; } = "";
        public string? Url { get; set; } = "";
    }




    // Instructor-specific tabs

    public class InstructorTabContent
    {
        public string AboutMe { get; set; } = "";
        public List<CourseTab> Courses { get; set; } = new List<CourseTab>();
        //public List<ProjectTab> Projects { get; set; } = new List<ProjectTab>();
        public List<EarningTab> Earnings { get; set; } = new List<EarningTab>();
        public List<StudentTab> Students { get; set; } = new List<StudentTab>();
        public string Certificates { get; set; } = "";
    }
    public class CourseTab
    {
        public string CourseName { get; set; } = "";
        public string Progress { get; set; } = "";
    }

    public class ProjectTab
    {
        public string ProjectName { get; set; } = "";
        public string Status { get; set; } = "";
    }
    public class EarningTab
    {
        public decimal monthly { get; set; } = 0;
        public decimal total { get; set; } = 0;

    }
    public class StudentTab
    {
        public string name { get; set; } = "";
        public decimal progress { get; set; } = 0;

    }
    // Student-specific tabs

    public class StudentTabContent
    {
        public string? AboutMe { get; set; }
        public List<CourseTab> Courses { get; set; } = new List<CourseTab>();
        public List<EnrollmentTab>? Enrollments { get; set; }
        public List<ProgressTab>? Progress { get; set; }
        public List<AchievementTab>? Achievements { get; set; }
        public string Certificates { get; set; } = "";
        public List<ProjectTab> Projects { get; set; } = new List<ProjectTab>();

    }


    public class EnrollmentTab
    {
        public int CourseCount { get; set; }
        public string? LastCourseJoined { get; set; }
    }

    public class ProgressTab
    {
        public int CompletedCourses { get; set; }
        public int OngoingCourses { get; set; }
    }

    public class AchievementTab
    {
        public string? Title { get; set; }
        public string? Date { get; set; }
    }

    // Admin-specific tabs


    public class AdminTabContent
    {
        public string AboutMe { get; set; } = "";

        public List<UserManagementTab> UserManagement { get; set; } = new List<UserManagementTab>();

        public List<ReportTab> Reports { get; set; } = new List<ReportTab>();

        public List<SystemLogTab> SystemLogs { get; set; } = new List<SystemLogTab>();
    }
    public class UserManagementTab
    {
        public int TotalStudents { get; set; }
        public int TotalInstructors { get; set; }
    }

    public class ReportTab
    {
        public string Type { get; set; } = "";
        public string Generated { get; set; } = "";
    }

    public class SystemLogTab
    {
        public string Event { get; set; } = "";
        public string Time { get; set; } = "";
    }
}
