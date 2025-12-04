using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class ProfileService
    {
        public ProfileService(AppDbContext context)
        {

            _context = context;
        }
        private readonly AppDbContext _context;


        public async Task<bool> EditStudentProfileAsync(int studentId, EditStudentProfileVM model)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null) return false;

            // --- Update User ---
            var user = student.User;
            user.FullName = model.Name ?? "User";

            // --- Update Avatar (User Image) إذا رفع صورة جديدة ---
            // EditStudentProfileAsync
            if (model.Avatar != null && model.Avatar.Length > 0)
            {
                using var ms = new MemoryStream();
                await model.Avatar.CopyToAsync(ms);
                student.User.ProfileImage = Convert.ToBase64String(ms.ToArray());
            }


            // لو مفيش Avatar → سيب الصورة القديمة زي ما هي

            // --- Update Student fields ---
            student.Phone = model.Phone;
            student.Address = model.Address;
            student.Gender = model.Gender;
            student.University = model.University;
            student.Country = model.Country;
            student.LinkedIn = model.LinkedIn;
            student.GitHub = model.GitHub;
            student.Facebook = model.Facebook;
            student.Twitter = model.Twitter;
            student.EducationLevel = model.EducationLevel;
            student.Major = model.Major;
            student.GPA = model.GPA;
            student.Department = model.Department;

            // --- Update Student.Image (لو عايزة الصورة تتحفظ هنا بدل User.ProfileImage)
            // لو عايزة تحطيها هنا بدل فوق سيبيني أعدّلك مكانها

            // --- Update Profile ---
            var profile = await _context.profiles.FirstOrDefaultAsync(p => p.UserId == studentId);
            if (profile != null)
            {
                profile.About = model.About ?? "About";
                profile.User.Name = model.Name;
                profile.User.RoleTitle = model.RoleTitle;

                profile.SocialLinks.Facebook = model.Facebook ?? "";
                profile.SocialLinks.Twitter = model.Twitter ?? "";
                profile.SocialLinks.LinkedIn = model.LinkedIn ?? "";
                profile.SocialLinks.Github = model.GitHub ?? "";
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> EditInstructorProfileAsync(int instructorId, EditInstructorProfileVM model)
        {
            var instructor = await _context.Instructors
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InstructorId == instructorId);

            if (instructor == null) return false;

            // --- Update User info ---
            var user = instructor.User;
            user.FullName = model.Name ?? "User";

            // --- Update Avatar (User Image) إذا رفع صورة جديدة ---
            if (model.Avatar != null && model.Avatar.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await model.Avatar.CopyToAsync(ms);
                    user.ProfileImage = Convert.ToBase64String(ms.ToArray());
                }
            }

            instructor.Phone = model.Phone;
            instructor.Address = model.Address;
            instructor.Gender = model.Gender;
            instructor.Country = model.Country;
            instructor.Specialization = model.Specialization;

            // --- Update Profile ---
            var profile = await _context.profiles.FirstOrDefaultAsync(p => p.UserId == instructorId);
            if (profile != null)
            {
                profile.About = model.About ?? "About";
                profile.User.Name = model.Name;
                profile.User.RoleTitle = model.RoleTitle;

                profile.SocialLinks.Facebook = model.Facebook ?? "";
                profile.SocialLinks.Twitter = model.Twitter ?? "";
                profile.SocialLinks.LinkedIn = model.LinkedIn ?? "";
                profile.SocialLinks.Github = model.GitHub ?? "";
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<ProfileVM?> GetInstructorProfileAsync(int instructorId)
        {
            // Argument cannot be used for parameter due to differences in the nullability of reference types.
            var instructor = await _context.Instructors
                .Include(i => i.User)
                .Include(i => i.Courses)
                 .ThenInclude(c => c.Enrollments)
                 .ThenInclude(e => e.Student)
                            .ThenInclude(s => s.User)
                .FirstOrDefaultAsync(i => i.InstructorId == instructorId);
            // Argument cannot be used for parameter due to differences in the nullability of reference types.

            if (instructor == null) return null;

            var profile = await _context.profiles.FirstOrDefaultAsync(p => p.UserId == instructorId);
            if (profile == null) return null;

            // User info
            var userInfo = new UserInformationVM
            {
                Name = instructor.User.FullName,
                RoleTitle = "Course Author & Trainer",
                Avatar = string.IsNullOrEmpty(instructor.User.ProfileImage) ? null : instructor.User.ProfileImage
            };

            // Social links
            var socialLinks = new SocialLinks
            {
                Facebook = profile.SocialLinks.Facebook,
                Twitter = profile.SocialLinks.Twitter,
                LinkedIn = profile.SocialLinks.LinkedIn,
                Github = profile.SocialLinks.Github
            };

            // Stats
            var stats = new List<Stat>
    {
        new Stat { Label = "Courses", Value = instructor.Courses?.Count ?? 0 },
        new Stat { Label = "Students", Value = instructor.Courses?.Sum(c => c.Enrollments?.Count ?? 0) ?? 0 },
        // Earnings can be calculated if needed
    };

            // TabContent
            var tabContent = new InstructorTabContent
            {
                Courses = instructor.Courses?.Select(c => new CourseTab
                {
                    CourseName = c.Title,
                    Progress = $"{c.Enrollments?.Count ?? 0}"
                }).ToList() ?? new List<CourseTab>(),

                Earnings = new List<EarningTab>
        {
            new EarningTab
            {
                monthly = 2500, // replace with real calculation if you have monthly data
                total = stats.FirstOrDefault(s => s.Label == "Earnings")?.Value ?? 0
            }
        },

                Students = instructor.Courses?.SelectMany(c => c.Enrollments ?? new List<Enrollment>())
                .Select(e => new StudentTab
                {
                    name = e.Student.User.FullName,
                    progress = e.Progress
                }).ToList() ?? new List<StudentTab>()
            };

            return new ProfileVM
            {
                Role = "instructor",
                User = userInfo,
                SocialLinks = socialLinks,
                Department = instructor.Specialization,
                Stats = stats,
                About = profile.About,
                InstructorTabContent = tabContent,
                //StudentTabContent = null,
                //AdminTabContent = null,
                Actions = new List<ActionButton>
        {
            new ActionButton { Label = "Edit Profile", Url = "/UserLayout/EditProfile" },
            new ActionButton { Label = "Settings", Url = "/UserLayout/SettingPage" }
        }
            };
        }


        public async Task<ProfileVM?> GetStudentProfileAsync(int studentId)
        {
            // Argument cannot be used for parameter due to differences in the nullability of reference types.
            var student = await _context.Students
                .Include(s => s.User)
                .Include(s => s.Enrollments)
                .ThenInclude(e => e.Course)
                .Include(s => s.Certificates)
                .ThenInclude(c => c.Course)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);
            // Argument cannot be used for parameter due to differences in the nullability of reference types.

            if (student == null) return null;

            // --- User info ---
            var userInfo = new UserInformationVM
            {
                Name = student.User.FullName,
                RoleTitle = student.User.Role,
                Avatar = string.IsNullOrEmpty(student.User.ProfileImage) ? null : student.User.ProfileImage
            };


            // --- Social links ---
            var socialLinks = new SocialLinks
            {
                Facebook = student.Facebook ?? "",
                Twitter = student.Twitter ?? "",
                LinkedIn = student.LinkedIn ?? "",
                Github = student.GitHub ?? ""
            };

            // --- Stats ---
            var stats = new List<Stat>
    {
        new Stat { Label = "Purchased", Value = student.Enrollments?.Count ?? 0 },
        new Stat { Label = "Certificates", Value = student.Certificates?.Count ?? 0 }
    };

            // --- Tabs and tab content ---
            var tabContent = new StudentTabContent
            {
                Courses = student.Enrollments?.Select(e => new CourseTab
                {
                    CourseName = e.Course?.Title ?? "Unknown",
                    Progress = $"{e.Progress}%"
                }).ToList() ?? new List<CourseTab>(),

                Certificates = string.Join(", ", student.Certificates?.Select(c => c.Course?.Title ?? "Unknown") ?? new List<string>()),
                Projects = new List<ProjectTab>() // optional if you add project info
            };

            // --- Actions ---
            var actions = new List<ActionButton>
    {
        new ActionButton { Id = 1, Label = "Edit Profile", Url = "/UserLayout/EditProfile" },
        new ActionButton { Id = 2, Label = "Settings", Url = "/UserLayout/SettingPage" }
    };

            // --- Profile ---
            var profile = await _context.profiles.FirstOrDefaultAsync(p => p.UserId == studentId);
            if (profile == null) return null;

            // --- Return ProfileVM ---
            return new ProfileVM
            {
                Role = "student",
                User = userInfo,
                SocialLinks = socialLinks,
                Stats = stats,
                About = profile.About,
                StudentTabContent = tabContent,
                Actions = actions,
                Department = student.Department,
                //InstructorTabContent = null,
                //AdminTabContent = null,
            };
        }


        public async Task<bool> EditAdminProfileAsync(int adminId, EditAdminProfileVM model)
        {
            var admin = await _context.Admins
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AdminId == adminId);

            if (admin == null) return false;

            // --- Update User ---
            var user = admin.User;
            user.FullName = model.Name;

            // --- Update Avatar (User Image) إذا رفع صورة جديدة ---
            if (model.Avatar != null && model.Avatar.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await model.Avatar.CopyToAsync(ms);
                    user.ProfileImage = Convert.ToBase64String(ms.ToArray());
                }
            }
            // لو مفيش Avatar → سيب الصورة القديمة زي ما هي

            // --- Update Admin fields ---
            admin.Department = model.Department;
            admin.RoleLevel = model.RoleLevel ?? admin.RoleLevel;

            // --- Update Profile ---
            var profile = await _context.profiles.FirstOrDefaultAsync(p => p.UserId == adminId);
            if (profile != null)
            {
                profile.About = model.About;
                profile.User.Name = model.Name;
                profile.User.RoleTitle = model.RoleTitle;

                profile.SocialLinks.Facebook = model.Facebook ?? "";
                profile.SocialLinks.Twitter = model.Twitter ?? "";
                profile.SocialLinks.LinkedIn = model.LinkedIn ?? "";
                profile.SocialLinks.Github = model.YouTube ?? ""; // لو عايزة YouTube يتحط بدل Github
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<ProfileVM?> GetAdminProfileAsync(int adminId)
        {
            var admin = await _context.Admins
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AdminId == adminId);

            if (admin == null) return null;

            var profile = await _context.profiles.FirstOrDefaultAsync(p => p.UserId == adminId);
            if (profile == null) return null;

            // --- User info ---
            var userInfo = new UserInformationVM
            {
                Name = admin.User.FullName,
                RoleTitle = "Platform Administrator",
                Avatar = string.IsNullOrEmpty(admin.User.ProfileImage) ? null : admin.User.ProfileImage
            };

            // --- Social links ---
            var socialLinks = new SocialLinks
            {
                Facebook = profile.SocialLinks.Facebook,
                Twitter = profile.SocialLinks.Twitter,
                LinkedIn = profile.SocialLinks.LinkedIn,
                Github = profile.SocialLinks.Github // لو تحبي ممكن تحطي YouTube بدل Github
            };

            // --- Stats ---
            var stats = new List<Stat>
            {
                new Stat { Label = "Users", Value = _context.Users.Count() },
                new Stat { Label = "Courses", Value = _context.Courses.Count() },
                // new Stat { Label = "Reports", Value = _context.Reports.Count() } // مثال
            };

            // --- Admin TabContent ---
            var admintabContent = new AdminTabContent
            {
                UserManagement = new List<UserManagementTab>(),
                Reports = new List<ReportTab>(),
                SystemLogs = new List<SystemLogTab>(),
            };

            // --- Return ProfileVM ---
            return new ProfileVM
            {
                Role = "admin",
                User = userInfo,
                SocialLinks = socialLinks,
                Stats = stats,
                About = profile.About,
                AdminTabContent = admintabContent,
                Actions = new List<ActionButton>
                {
                    new ActionButton { Label = "Edit Profile", Url = "/UserLayout/EditProfile" },
                    new ActionButton { Label = "Settings", Url = "/UserLayout/SettingPage" }
                },
                //Department = null,
                //InstructorTabContent = null,
                //StudentTabContent = null
            };
        }



    }

}