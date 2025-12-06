namespace Learnify_API.Data.Models
{
    public class PayoutRequest
    {
        public int Id { get; set; }
        public int InstructorId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // Pending, Approved, Rejected, Paid
        public DateTime RequestDate { get; set; }
        public DateTime? PayoutDate { get; set; }
        public string Method { get; set; }
        public string Notes { get; set; }

        public Instructor Instructor { get; set; }
    }

}
