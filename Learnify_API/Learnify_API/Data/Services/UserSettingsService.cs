using Learnify_API.Data.ViewModels;

namespace Learnify_API.Data.Services
{
    public class UserSettingsService
    {
        private readonly AppDbContext _context;

        public UserSettingsService(AppDbContext context)
        {
            _context = context;
        }

        // ========================================
        // 1) Get user settings by userId
        // ========================================
        public async Task<UserSettingsVM?> GetUserSettingsAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            return new UserSettingsVM
            {
                FirstName = ExtractFirstName(user.FullName),
                LastName = ExtractLastName(user.FullName),
                Headline = user.Headline,
                About = user.About,
                Email = user.Email,
                Phone = user.Phone,
                Newsletter = user.Newsletter
            };
        }

        // ========================================
        // 2) Update user settings
        // ========================================
        public async Task<UserSettingsVM?> UpdateUserSettingsAsync(int userId, UserSettingsVM vm)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            // نحافظ على الإيميل الأصلي
            // user.Email = vm.Email; // مش بنعدل الإيميل هنا

            // باقي البيانات تتعدل
            user.FullName = $"{vm.FirstName} {vm.LastName}".Trim();
            user.Headline = vm.Headline ?? "";
            user.About = vm.About ?? "";
            user.Phone = vm.Phone;
            user.Newsletter = vm.Newsletter;

            await _context.SaveChangesAsync();
            return new UserSettingsVM
            {
                FirstName = ExtractFirstName(user.FullName),
                LastName = ExtractLastName(user.FullName),
                Headline = user.Headline,
                About = user.About,
                Email = user.Email, // نرجع الإيميل القديم
                Phone = user.Phone,
                Newsletter = user.Newsletter
            };
        }

        private string ExtractFirstName(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName)) return "";
            var parts = fullName.Split(' ', 2);
            return parts[0];
        }

        private string ExtractLastName(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName)) return "";
            var parts = fullName.Split(' ', 2);
            return parts.Length > 1 ? parts[1] : "";
        }
    }
}
