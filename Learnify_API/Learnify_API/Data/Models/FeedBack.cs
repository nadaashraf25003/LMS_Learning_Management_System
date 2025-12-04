using System.ComponentModel.DataAnnotations.Schema;

namespace Learnify_API.Data.Models
{
    public class FeedBack
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Massage { get; set; }
        [Column(TypeName = "nvarchar(max)")]
        public string? feedbackimage { get; set; }

    }
}
