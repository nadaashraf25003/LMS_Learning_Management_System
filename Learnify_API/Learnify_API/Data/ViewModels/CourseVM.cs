namespace Learnify_API.Data.ViewModels
{
    public class CourseVM
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int AuthorId { get; set; }

        public string? Views { get; set; }
        public string? Posted { get; set; }
        public double Rating { get; set; }
        public string? Hours { get; set; }
        public decimal? Price { get; set; }
        public string? Tag { get; set; }
        public string? Image { get; set; }
        public IFormFile? ImageFormFile { get; set; }
        public int StudentsEnrolled { get; set; }
        public bool CertificateIncluded { get; set; }
        public string? Duration { get; set; }

        public int InstructorId { get; set; }
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; }  // ← تم الإضافة هنا
        public List<LessonVM>? Lessons { get; set; }
        public List<QuizVM>? Quizzes { get; set; }
    }
}
