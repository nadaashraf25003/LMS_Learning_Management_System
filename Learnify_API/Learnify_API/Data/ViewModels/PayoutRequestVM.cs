public class PayoutRequestVM
{
    public int Id { get; set; }
    public int InstructorId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; }
    public string Status { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime? PayoutDate { get; set; }
    public string Notes { get; set; }
}
