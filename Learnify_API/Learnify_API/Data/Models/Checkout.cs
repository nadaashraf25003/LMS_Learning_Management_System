using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Learnify_API.Data.Models
{
    public class Checkout
    {
        [Key]
        public int CheckoutId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student Student { get; set; }

        [Required]
        public DateTime CheckoutDate { get; set; } = DateTime.Now;

        [Required]
        public decimal TotalPrice { get; set; }

        public string PaymentMethod { get; set; } = "card"; // card, bank, paypal

        public string PaymentStatus { get; set; } = "pending"; // pending, completed, failed

        public ICollection<CheckoutItem> CheckoutItems { get; set; }
    }

    public class CheckoutItem
    {
        [Key]
        public int CheckoutItemId { get; set; }

        [Required]
        public int CheckoutId { get; set; }

        [ForeignKey("CheckoutId")]
        public Checkout Checkout { get; set; }

        [Required]
        public int CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; }

        [Required]
        public decimal Price { get; set; }
    }
}
