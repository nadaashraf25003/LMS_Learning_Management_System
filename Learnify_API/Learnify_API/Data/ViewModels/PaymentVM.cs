namespace Learnify_API.Data.ViewModels
{
    public class PaymentVM
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Method { get; set; }
        public string Details { get; set; }

        public int InstructorId { get; set; }
    }

}
