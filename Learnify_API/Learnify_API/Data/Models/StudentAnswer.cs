using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Learnify_API.Data.Models
{
    public class StudentAnswer
    {
        [Key]
        public int Id { get; set; }

        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        public int QuizId { get; set; }
        [ForeignKey("QuizId")]
        public Quiz Quiz { get; set; } = null!;

        public string AnswersJson { get; set; } = "{}"; // {"2":"b","3":"a"}

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Duration { get; set; } = "";
        public DateTime SubmittedAt { get; set; }

        public int Score { get; set; } = 0; // percentage or total marks
    }
}
