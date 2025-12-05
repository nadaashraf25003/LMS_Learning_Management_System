using Learnify_API.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Lesson
{
    [Key]
    public int LessonId { get; set; }

    public int CourseId { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; } = null!;

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    //[MaxLength(255)]
    public string? VideoUrl { get; set; }

    //[MaxLength(500)]
    public string? Description { get; set; }

    // Duration in minutes
    public int Duration { get; set; }

    // To determine lesson content type (Video, PDF, Quiz, etc.)
    //[MaxLength(50)]
    public string ContentType { get; set; } = "Video";

    // If there is document / material
    public string? AttachmentUrl { get; set; }

    // Allow users to preview first lesson without enrollment
    public bool IsFreePreview { get; set; } = false;

    public int Order { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation Property
    public ICollection<LessonProgress>? LessonProgresses { get; set; }

}
