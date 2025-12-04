namespace Learnify_API.Data.ViewModels
{
    public class CreateLessonRequest
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public string? Description { get; set; }
        public int? Duration { get; set; }
        public string? ContentType { get; set; }
        public string? AttachmentUrl { get; set; }
        public bool IsFreePreview { get; set; }
        public int? Order { get; set; }
    }


    public class UpdateLessonRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? VideoUrl { get; set; }
        public int? Duration { get; set; }
        public string? ContentType { get; set; }
        public string? AttachmentUrl { get; set; }
        public bool? IsFreePreview { get; set; }
        public int? Order { get; set; }
    }


    public class LessonVM
    {
        public int LessonId { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public string? Description { get; set; }
        public int Duration { get; set; }
        public string ContentType { get; set; } = "Video";
        public string? AttachmentUrl { get; set; }
        public bool IsFreePreview { get; set; }
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<QuizVM>? Quizzes { get; set; }
        public int TotalQuizzes => Quizzes?.Count ?? 0;
        public bool IsCompleted { get; set; } = false;
    }

    // Progress tracking view model
    public class LessonProgressVM
    {
        public int LessonId { get; set; }
        public int StudentId { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
