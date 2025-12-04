using System.ComponentModel.DataAnnotations;

public class Dashboard
{
    [Key]
    public int Id { get; set; }
    public string? Role { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Department { get; set; }
    //student
    public int TotalCourses { get; set; }
    public int CompletedCourses { get; set; }
    public int CertificatesEarned { get; set; }
    //ins
    public int TotalStudentsforinst { get; set; }
    public int CoursesCreated { get; set; }
    public int ProjectsSupervised { get; set; }
    public int CertificatesIssued { get; set; }
    //admin
    public int TotalStudentsforAdmin { get; set; }
    public int TotalInstructors { get; set; }
    public int TotalCoursesforAdmin { get; set; }
    public int CertificatesIssuedAdmin { get; set; }


}