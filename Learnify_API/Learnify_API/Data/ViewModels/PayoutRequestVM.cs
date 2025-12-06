namespace Learnify_API.Data.ViewModels
{
    public class PayoutRequestVM
    {
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? PayoutDate { get; set; }
        public string Method { get; set; }
        public string Notes { get; set; } = "";

        public int InstructorId { get; set; }
    }

}
