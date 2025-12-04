using Learnify_API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class CheckoutService
    {
        private readonly AppDbContext _context;

        public CheckoutService(AppDbContext context)
        {
            _context = context;
        }

        // Add a new checkout for a student
        public async Task<Checkout> AddCheckoutAsync(int studentId, string paymentMethod)
        {
            // Get the student's cart
            var cartItems = await _context.CartItems
                .Include(c => c.Course)
                .Where(c => c.StudentId == studentId)
                .ToListAsync();

            if (!cartItems.Any())
                return null;

            var totalPrice = cartItems.Sum(c => c.Course.Price);

            var checkout = new Checkout
            {
                StudentId = studentId,
                TotalPrice = totalPrice,
                PaymentMethod = paymentMethod,
                PaymentStatus = "completed", // or pending based on your payment flow
                CheckoutItems = cartItems.Select(c => new CheckoutItem
                {
                    CourseId = c.CourseId,
                    Price = c.Course.Price
                }).ToList()
            };

            _context.Checkouts.Add(checkout);

            // Clear student's cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return checkout;
        }

        // Get all checkouts for a student
        public async Task<IEnumerable<Checkout>> GetStudentCheckoutsAsync(int studentId)
        {
            return await _context.Checkouts
                .Include(c => c.CheckoutItems)
                .ThenInclude(ci => ci.Course)
                .Where(c => c.StudentId == studentId)
                .OrderByDescending(c => c.CheckoutDate)
                .ToListAsync();
        }

        // Get a single checkout by ID
        public async Task<Checkout> GetCheckoutByIdAsync(int checkoutId)
        {
            return await _context.Checkouts
                .Include(c => c.CheckoutItems)
                .ThenInclude(ci => ci.Course)
                .FirstOrDefaultAsync(c => c.CheckoutId == checkoutId);
        }
    }
}
