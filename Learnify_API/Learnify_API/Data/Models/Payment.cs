namespace Learnify_API.Data.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int InstructorId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; } // Pending, Completed, Failed
        public DateTime PaymentDate { get; set; }
        public string Method { get; set; } // PayPal, Bank, etc.
        public string Details { get; set; }

        // Navigation property
        public Instructor Instructor { get; set; }
    }

}
