using Learnify_API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class InstructorService
    {
        private readonly AppDbContext _context;

        public InstructorService(AppDbContext context)
        {
            _context = context;
        }

        // -------- Get instructor payouts --------
        public async Task<List<InstructorPayout>> GetPayoutsByInstructorAsync(int instructorId)
        {
            return await _context.InstructorPayouts
                .Where(p => p.InstructorId == instructorId)
                .ToListAsync();
        }
    }
}

        // -------- Optional: Instructor Dashboard --------
