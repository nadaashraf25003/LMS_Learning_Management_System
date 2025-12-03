using Learnify_API.Data.DTO;
using Learnify_API.Data.Models;
using Learnify_API.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(AuthService authService, UserManager<AppUser> userManager, IConfiguration config, EmailService emailService)
        {
            _authService = authService;
            _userManager = userManager;
            _config = config;
            _emailService = emailService;
        }
        [HttpPost("instructor-register")]
        public async Task<IActionResult> InstructorRegister(InstructorRegisterRequest req)
        {
            var result = await _authService.InstructorRegisterAsync(req);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = result.Data });
        }
        [HttpPost("student-register")]
        public async Task<IActionResult> StudentRegister(StudentRegisterRequest req)
        {
            var result = await _authService.StudentRegisterAsync(req);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = result.Data });
        }

        [HttpPost("admin-register")]
        public async Task<IActionResult> AdminRegister(AdminRegisterRequest req)
        {
            var result = await _authService.AdminRegisterAsync(req); // make sure you have this service method

            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = result.Data });
        }
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailRequest req)
        {
            var result = await _authService.VerifyEmailAsync(req);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = result.Data });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest req)
        {
            var result = await _authService.LoginAsync(req);

            if (!result.Success) // check for errors
                return BadRequest(new { message = result.ErrorMessage });

            // قراءة القيمة بشكل آمن
            var refreshTokenValidityString = _config["Jwt:RefreshTokenValidityMins"];
            if (!double.TryParse(refreshTokenValidityString, out var refreshTokenExpiryMinutes))
            {
                refreshTokenExpiryMinutes = 1440; // القيمة الافتراضية: 24 ساعة
            }

            // Clear old cookie first
            Response.Cookies.Delete("refreshToken");

            // Add new refresh token cookie
            Response.Cookies.Append("refreshToken", result.Data?.RefreshToken ?? "", new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(refreshTokenExpiryMinutes)
            });

            return Ok(result.Data);
        }


        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerificationCode([FromBody] ResendVerificationRequest req)
        {
            var response = await _authService.ResendVerificationCodeAsync(req.Email);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest req)
        {
            var message = await _authService.ForgotPasswordAsync(req);
            return Ok(new { message });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest req)
        {
            var message = await _authService.ResetPasswordAsync(req);
            return Ok(new { message });
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            // 1️⃣ Get refresh token from cookie
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("No refresh token found");
            }


            // 2️⃣ Use your service to refresh the token
            var result = await _authService.RefreshAccessTokenAsync(refreshToken);
            if (result == null)
                return Unauthorized("Invalid or expired refresh token");

            var refreshTokenExpiryMinutes = double.Parse(_config["Jwt:RefreshTokenValidityMins"] ?? "1440"); // 1440 دقيقة = 1 يوم
                                                                                                             // 3️⃣ Update cookie with new refresh token (rotating)
            if (!string.IsNullOrEmpty(result.RefreshToken))
            {
                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, // فقط للـ localhost
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(refreshTokenExpiryMinutes)
                });
            }


            //4️⃣ Return new access token
            return Ok(new
            {
                Token = result.Token,
                ExpiresIn = result.ExpiresIn,
                //RefreshToken = result.RefreshToken
            });
        }


        // Get current logged-in user info from JWT 
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var result = await _authService.GetUserProfileAsync(User);

            if (result == null)
                return NotFound("User not found");

            return Ok(result);
        }


        [HttpGet("send")]
        public async Task<IActionResult> SendTestEmail()
        {
            try
            {
                await _emailService.SendEmailAsync(
                    "nadanadaashraf25@gmail.com", // <-- Replace with your email
                    "Test Email from Learnify",
                    "<h1>Hello!</h1><p>This is a test email from Learnify API.</p>"
                );

                return Ok("Test email sent successfully! Check inbox/spam.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Failed to send email: {ex.Message}" });
            }
        }

    }
}

