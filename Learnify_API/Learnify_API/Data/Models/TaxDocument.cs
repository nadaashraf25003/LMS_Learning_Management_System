namespace Learnify_API.Data.Models
{
    public class TaxDocument
    {
        public int Id { get; set; }
        public int InstructorId { get; set; }
        public string Type { get; set; } // VAT, W9, ...
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
        public string Status { get; set; } // Pending, Approved, Rejected

        public Instructor Instructor { get; set; }
    }

}
