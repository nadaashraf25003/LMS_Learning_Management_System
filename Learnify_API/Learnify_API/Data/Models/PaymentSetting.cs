namespace Learnify_API.Data.Models
{
    public class PaymentSetting
    {
        public int Id { get; set; }
        public int InstructorId { get; set; }
        public string PreferredMethod { get; set; }
        public string BankAccount { get; set; }
        public string PayPalEmail { get; set; }
        public string TaxId { get; set; }

        public Instructor Instructor { get; set; }
    }

}
