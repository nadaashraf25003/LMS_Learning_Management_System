using Learnify_API.Data.DTO;
using Learnify_API.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Learnify_API.Data.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;
        private readonly UserManager<AppUser> _userManager;
        //private readonly IEmailSender _emailService;

        public AuthService(AppDbContext context, IConfiguration config, EmailService emailService, UserManager<AppUser> userManager)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _userManager = userManager;
        }


        // 1️⃣ Instructor Register
        public async Task<ServiceResponse<string>> InstructorRegisterAsync(InstructorRegisterRequest req)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

                if (existingUser != null)
                {
                    if (existingUser.IsEmailVerified)
                    {
                        response.Success = false;
                        response.ErrorMessage = "Email already registered and verified.";
                        return response;
                    }
                    else
                    {
                        // User exists but not verified → update verification code
                        existingUser.VerificationCode = new Random().Next(100000, 999999).ToString();
                        existingUser.VerificationExpiresAt = DateTime.UtcNow.AddMinutes(10);
                        await _context.SaveChangesAsync();

                        // Resend verification email
                        await _emailService.SendEmailAsync(
                            req.Email,
                            "Learnify Verification Code",
                            $"<h3>Hello {existingUser.FullName},</h3><p>Your verification code is:</p><h2>{existingUser.VerificationCode}</h2><p>This code will expire in 10 minutes.</p>"
                        );

                        response.Success = true;
                        response.Data = "User already registered but not verified. Verification email resent.";
                        return response;
                    }
                }

                // New user → create record
                var verificationCode = new Random().Next(100000, 999999).ToString();

                var instructorUser = new User
                {
                    FullName = req.FullName,
                    Email = req.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                    Role = "instructor",
                    ProfileImage = req.ProfileImage,
                    VerificationCode = verificationCode,
                    VerificationExpiresAt = DateTime.UtcNow.AddMinutes(10),
                    IsApproved = false,
                    IsEmailVerified = false
                };

                _context.Users.Add(instructorUser);
                await _context.SaveChangesAsync();

                // Create Instructor details
                _context.Instructors.Add(new Instructor
                {
                    InstructorId = instructorUser.UserId,
                    Specialization = req.Specialization,
                    Phone = req.Phone,
                    Address = req.Address,
                    Country = req.Country,
                    Gender = req.Gender,
                    Experience = req.Years_Of_Experience,
                    Bio = req.BIO
                });

                // Create Instructor Tab Content
                var instructorTabContent = new InstructorTabContent
                {
                    AboutMe = req.BIO ?? "Passionate about sharing knowledge and empowering learners.",
                    Courses = new List<CourseTab> { new CourseTab { CourseName = "None yet", Progress = "0%" } },
                    Earnings = new List<EarningTab> { new EarningTab { monthly = 0, total = 0 } },
                    Students = new List<StudentTab> { new StudentTab { name = "None yet", progress = 0 } },
                    Certificates = ""
                };

                // Create Profile
                var profile = new Profile
                {
                    UserId = instructorUser.UserId,
                    Role = "instructor",
                    User = new UserInfo
                    {
                        Name = instructorUser.FullName,
                        RoleTitle = "Instructor",
                        Avatar = req.ProfileImage
                    },
                    SocialLinks = new SocialLinks(),
                    About = req.BIO ?? "Welcome to Learnify! Start teaching and inspiring students.",
                    InstructorTabContent = instructorTabContent
                };

                _context.profiles.Add(profile);
                await _context.SaveChangesAsync();

                // Send verification email
                await _emailService.SendEmailAsync(
                    req.Email,
                    "Learnify Verification Code",
                    $"<h3>Hello {req.FullName},</h3><p>Your verification code is:</p><h2>{verificationCode}</h2><p>This code will expire in 10 minutes.</p>"
                );

                response.Success = true;
                response.Data = "Instructor registered successfully. Please check your email for the verification code and wait for admin approval.";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.ErrorMessage = $"Registration failed: {ex.Message}";
                return response;
            }
        }

        // 2️⃣ Student Register
        public async Task<ServiceResponse<string>> StudentRegisterAsync(StudentRegisterRequest req)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

                if (existingUser != null)
                {
                    if (existingUser.IsEmailVerified)
                    {
                        response.Success = false;
                        response.ErrorMessage = "Email already registered and verified.";
                        return response;
                    }
                    else
                    {
                        // User exists but not verified → update verification code
                        existingUser.VerificationCode = new Random().Next(100000, 999999).ToString();
                        existingUser.VerificationExpiresAt = DateTime.UtcNow.AddMinutes(10);
                        await _context.SaveChangesAsync();

                        // Resend verification email
                        await _emailService.SendEmailAsync(
                            req.Email,
                            "Learnify Verification Code",
                            $"<h3>Hello {existingUser.FullName},</h3><p>Your verification code is:</p><h2>{existingUser.VerificationCode}</h2><p>This code will expire in 10 minutes.</p>"
                        );

                        response.Success = true;
                        response.Data = "User already registered but not verified. Verification email resent.";
                        return response;
                    }
                }

                // New user → create record
                var verificationCode = new Random().Next(100000, 999999).ToString();

                var studentUser = new User
                {
                    FullName = req.FullName,
                    Email = req.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                    Role = "student",
                    ProfileImage = req.ProfileImage,
                    VerificationCode = verificationCode,
                    VerificationExpiresAt = DateTime.UtcNow.AddMinutes(10),
                    IsApproved = true, // students auto-approved
                    IsEmailVerified = false
                };

                _context.Users.Add(studentUser);
                await _context.SaveChangesAsync();

                // Create Student record
                _context.Students.Add(new Student
                {
                    StudentId = studentUser.UserId,
                    EnrollmentNo = "ENR" + new Random().Next(1000, 9999),
                    Phone = req.Phone,
                    Address = req.Address,
                    Country = req.Country,
                    Gender = req.Gender,
                    University = req.University,
                    Major = req.Major,
                    EducationLevel = req.EducationLevel
                });

                // Create Student Tab Content
                var studentTabContent = new StudentTabContent
                {
                    AboutMe = req.About ?? "Passionate student eager to learn and explore new technologies.",
                    Enrollments = new List<EnrollmentTab>
            {
                new EnrollmentTab { CourseCount = 0, LastCourseJoined = "None" }
            },
                    Progress = new List<ProgressTab>
            {
                new ProgressTab { CompletedCourses = 0, OngoingCourses = 0 }
            },
                    Achievements = new List<AchievementTab>
            {
                new AchievementTab { Title = "Account Created", Date = DateTime.UtcNow.ToString("yyyy-MM-dd") }
            }
                };

                // Create Profile
                var profile = new Profile
                {
                    UserId = studentUser.UserId,
                    Role = "student",
                    User = new UserInfo
                    {
                        Name = studentUser.FullName,
                        RoleTitle = "Student",
                        Avatar = req.ProfileImage ?? null
                    },
                    SocialLinks = new SocialLinks(),
                    About = req.About ?? "Welcome to Learnify! Start exploring new courses today.",
                    StudentTabContent = studentTabContent
                };

                _context.profiles.Add(profile);
                await _context.SaveChangesAsync();

                // Send verification email
                await _emailService.SendEmailAsync(
                    req.Email,
                    "Learnify Verification Code",
                    $"<h3>Hello {req.FullName},</h3><p>Your verification code is:</p><h2>{verificationCode}</h2><p>This code will expire in 10 minutes.</p>"
                );

                response.Success = true;
                response.Data = "Student registered successfully. Verification code sent to email.";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }
        // 3 Admi Register
        public async Task<ServiceResponse<string>> AdminRegisterAsync(AdminRegisterRequest req)
        {
            var response = new ServiceResponse<string>();

            try
            {
                // 1️⃣ Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == req.Email))
                {
                    response.Success = false;
                    response.ErrorMessage = "Email already exists.";
                    return response;
                }

                // 2️⃣ Create User
                var user = new User
                {
                    FullName = req.FullName ?? "",
                    Email = req.Email ?? "",
                    Role = "admin", // keep lowercase for consistency
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                    CreatedAt = DateTime.Now,
                    IsApproved = true //  students are auto-approved
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync(); // Save to get UserId

                // 3️⃣ Create Admin record
                var admin = new Admin
                {
                    AdminId = user.UserId, // FK = UserId
                    Department = req.Department,
                    RoleLevel = req.RoleLevel ?? "Moderator",
                    User = user
                };

                await _context.Admins.AddAsync(admin);
                await _context.SaveChangesAsync(); //  Save before creating profile

                // 4️⃣ Create Admin Profile with initial tab data
                var tabContent = new AdminTabContent
                {
                    AboutMe = req.About ?? "Ensuring the platform runs smoothly and securely...",
                    UserManagement = new List<UserManagementTab>
                    {
                        new UserManagementTab { TotalStudents = 0, TotalInstructors = 0 }
                    },
                    Reports = new List<ReportTab>
                    {
                        new ReportTab { Type = "Monthly Analytics", Generated = DateTime.Now.ToString("yyyy-MM-dd") }
                    },
                    SystemLogs = new List<SystemLogTab>
                    {
                        new SystemLogTab { Event = "Account Created", Time = "Just now" }
                    }
                };

                var profile = new Profile
                {
                    UserId = user.UserId,
                    Role = "admin",
                    User = new UserInfo
                    {
                        Name = user.FullName,
                        RoleTitle = "Platform Administrator",
                        //Avatar = req.ProfileImage ?? null
                    },
                    SocialLinks = new SocialLinks
                    {
                        Facebook = req.Facebook ?? "",
                        Twitter = req.Twitter ?? "",
                        LinkedIn = req.LinkedIn ?? "",
                        Github = req.GitHub ?? ""
                    },
                    About = req.About ?? "Admin account created successfully.",
                    AdminTabContent = tabContent // ✅ link admin tab content
                };

                await _context.profiles.AddAsync(profile);
                await _context.SaveChangesAsync();

                // 5️⃣ Success response
                response.Success = true;
                response.Data = "Admin registered successfully!";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.ErrorMessage = ex.Message;
                return response;
            }
        }


        // 2️⃣ VERIFY EMAIL
        public async Task<ServiceResponse<string>> VerifyEmailAsync(VerifyEmailRequest req)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
                if (user == null)
                {
                    response.Success = false;
                    response.ErrorMessage = "User not found.";
                    return response;
                }

                // ✅ Only allow instructors and students to verify email
                if (user.Role != "instructor" && user.Role != "student")
                {
                    response.Success = false;
                    response.ErrorMessage = "Email verification not required for this user role.";
                    return response;
                }

                if (user.VerificationCode != req.Code || user.VerificationExpiresAt < DateTime.UtcNow)
                {
                    response.Success = false;
                    response.ErrorMessage = "Invalid or expired verification code.";
                    return response;
                }

                // ✅ Mark email as verified in the database
                user.IsEmailVerified = true;
                user.VerificationCode = null;
                user.VerificationExpiresAt = null;

                await _context.SaveChangesAsync();

                response.Data = "Email verified successfully!";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.ErrorMessage = ex.Message;
                return response;
            }
        }

        // 3️⃣ LOGIN
        public async Task<ServiceResponse<AuthResponse>> LoginAsync(LoginRequest req)
        {
            var response = new ServiceResponse<AuthResponse>();
            try
            {
                // 1️⃣ Find user by email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
                if (user == null)
                {
                    response.Success = false;
                    response.ErrorMessage = "Email does not found";
                    return response;
                }

                // 2️⃣ Check password
                if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                {
                    response.Success = false;
                    response.ErrorMessage = "Invalid email or password.";
                    return response;
                }

                // ✅ 3️⃣ Prevent login if email not verified (for student & instructor)
                if ((user.Role == "student" || user.Role == "instructor") && !user.IsEmailVerified)
                {
                    // Generate a new verification code if expired or null
                    if (string.IsNullOrEmpty(user.VerificationCode) || user.VerificationExpiresAt < DateTime.UtcNow)
                    {
                        user.VerificationCode = new Random().Next(100000, 999999).ToString();
                        user.VerificationExpiresAt = DateTime.UtcNow.AddMinutes(10);
                        await _context.SaveChangesAsync();

                        // Send verification email
                        try
                        {
                            await _emailService.SendEmailAsync(
                                user.Email,
                                "Learnify Verification Code",
                                $"<h3>Hello {user.FullName},</h3><p>Your new verification code is:</p><h2>{user.VerificationCode}</h2><p>This code will expire in 10 minutes.</p>"
                            );
                        }
                        catch (Exception emailEx)
                        {
                            Console.WriteLine($"Failed to resend verification code: {emailEx.Message}");
                        }
                    }

                    response.Success = false;
                    response.ErrorMessage = "Your email is not verified. A verification code has been sent to your email.";
                    return response;
                }

                // 4️⃣ Check if account is approved
                if (!user.IsApproved)
                {
                    response.Success = false;
                    response.ErrorMessage = "Your account is awaiting admin approval.";
                    return response;
                }

                // 5️⃣ Generate JWT and refresh token
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                var refreshValidity = double.TryParse(_config["Jwt:RefreshTokenValidityMins"], out var v) ? v : 60;
                user.RefreshTokenExpiresAt = DateTime.UtcNow.AddMinutes(refreshValidity);
                await _context.SaveChangesAsync();

                double.TryParse(_config["Jwt:TokenValidityMins"], out var tokenValidity);
                var expiresInMinutes = tokenValidity > 0 ? tokenValidity : 15; // default 15 mins

                response.Data = new AuthResponse
                {
                    Token = token,
                    ExpiresIn = (int)(expiresInMinutes * 60),
                    RefreshToken = refreshToken,
                    User = new
                    {
                        user.UserId,
                        user.FullName,
                        user.Email,
                        user.Role,
                    }
                };

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.ErrorMessage = ex.Message;
                return response;
            }
        }

        public async Task<ServiceResponse<string>> ResendVerificationCodeAsync(string email)
        {
            var response = new ServiceResponse<string>();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                response.Success = false;
                response.ErrorMessage = "No account found with this email.";
                return response;
            }

            if (user.IsEmailVerified)
            {
                response.Success = false;
                response.ErrorMessage = "Email already verified.";
                return response;
            }

            user.VerificationCode = new Random().Next(100000, 999999).ToString();
            user.VerificationExpiresAt = DateTime.UtcNow.AddMinutes(10);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                user.Email,
                "Learnify Verification Code",
                $"<h3>Hello {user.FullName},</h3><p>Your new verification code is:</p><h2>{user.VerificationCode}</h2><p>This code expires in 10 minutes.</p>"
            );

            response.Success = true;
            response.Data = "Verification code resent successfully.";
            return response;
        }



        // 4️⃣ FORGOT PASSWORD
        public async Task<string> ForgotPasswordAsync(ForgotPasswordRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null)
                return "If that email exists, a reset code has been sent.";

            var resetCode = new Random().Next(100000, 999999).ToString();
            user.PasswordResetCode = resetCode;
            user.PasswordResetExpiresAt = DateTime.Now.AddMinutes(15);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(req.Email, "Password Reset Code",
                $"Your Learnify reset code is: <h2>{resetCode}</h2>");

            return "Password reset code sent.";
        }

        // 5️⃣ RESET PASSWORD
        public async Task<string> ResetPasswordAsync(ResetPasswordRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return "Invalid email.";

            if (user.PasswordResetCode != req.Code || user.PasswordResetExpiresAt < DateTime.Now)
                return "Invalid or expired reset code.";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            user.PasswordResetCode = null;
            user.PasswordResetExpiresAt = null;
            await _context.SaveChangesAsync();

            return "Password updated successfully.";
        }


        //  GenerateJwtToken
        private string GenerateJwtToken(User user)
        {
            // 1️⃣ Create the secret key
            var secretKey = _config["Jwt:SecretKey"];

            if (string.IsNullOrWhiteSpace(secretKey))
            {
                throw new Exception("JWT Secret Key is missing in configuration.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            // 2️⃣ Define the signing algorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 3️⃣ Add claims — user data inside token
            var claims = new[]
            {
              new Claim(ClaimTypes.Email, user.Email),
                new Claim("userId", user.UserId.ToString()),
                new Claim("role", user.Role),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // 1️⃣ اقرأ القيمة من الـ config
            var tokenValidityString = _config["Jwt:TokenValidityMins"];

            // 2️⃣ تحقق من القيمة
            if (string.IsNullOrWhiteSpace(tokenValidityString))
            {
                throw new Exception("Jwt:TokenValidityMins is missing in configuration.");
            }

            // 3️⃣ حوّل إلى double
            var tokenValidityMinutes = double.Parse(tokenValidityString);

            // 4️⃣ أنشئ التوكن
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(tokenValidityMinutes), // ✅ use UTC
                signingCredentials: creds
            );

            // 5️⃣ Serialize token to string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        //GenerateRefreshToken
        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            }
        }


        // RefreshAccessTokenAsync  
        public async Task<AuthResponse?> RefreshAccessTokenAsync(string refreshToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
                return null;

            // Generate new access token
            var newToken = GenerateJwtToken(user);

            // Generate new refresh token (rotating)
            var newRefreshToken = GenerateRefreshToken();
            //user.RefreshToken = newRefreshToken;
            //user.RefreshTokenExpiresAt = DateTime.UtcNow.AddMinutes(
            //        double.Parse(_config["Jwt:RefreshTokenValidityMins"])
            //    );
            await _context.SaveChangesAsync();

            var tokenValidityString = _config["Jwt:TokenValidityMins"];
            if (!double.TryParse(tokenValidityString, out var expiresInMinutes))
            {
                expiresInMinutes = 60; // قيمة افتراضية إذا لم تكن موجودة أو صالحة
            }


            return new AuthResponse
            {
                Token = newToken,
                ExpiresIn = (int)(expiresInMinutes * 60),
                RefreshToken = newRefreshToken
            };
        }

        // Get current logged-in user info from JWT
        public async Task<AuthUserInfoDTO?> GetUserProfileAsync(ClaimsPrincipal userClaims)
        {
            var userId = userClaims.FindFirst("userId")?.Value;
            if (userId == null) return null;

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.UserId.ToString() == userId);

            if (user == null) return null;

            var dto = new AuthUserInfoDTO
            {
                Id = user.UserId.ToString(),
                FullName = user.FullName ?? "",
                Email = user.Email,
                Role = user.Role,
                Image = user.ProfileImage ?? ""
            };

            return dto;
        }



    }
}
