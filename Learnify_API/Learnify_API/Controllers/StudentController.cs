using Learnify_API.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _studentService;
        private readonly CheckoutService _checkoutService;


        public StudentController(StudentService studentService, CheckoutService checkoutService)
        {
            _studentService = studentService;
            _checkoutService = checkoutService;
        }


        // -------- Get all students (admin + instructor) --------
        [Authorize(Roles = "admin, instructor")]
        [HttpGet("get-students")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(students);
        }

        // -------- Get students for logged-in instructor only --------
        [Authorize(Roles = "instructor")]
        [HttpGet("get-my-students")]
        public async Task<IActionResult> GetMyStudents()
        {
            var instructorIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (instructorIdClaim == null)
                return Unauthorized("Instructor ID not found in token.");

            int instructorId = int.Parse(instructorIdClaim);

            var students = await _studentService.GetStudentsByInstructorAsync(instructorId);
            return Ok(students);
        }

        // Save course
        [Authorize(Roles = "student")]
        [HttpPost("save-course")]
        public async Task<IActionResult> SaveCourse([FromQuery] int courseId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);

            var result = await _studentService.SaveCourseAsync(studentId, courseId);

            return result ? Ok("Course saved successfully") : BadRequest("Course already saved");
        }

        // Get saved courses
        [Authorize(Roles = "student")]
        [HttpGet("saved-courses")]
        public async Task<IActionResult> GetSavedCourses()
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var courses = await _studentService.GetSavedCoursesAsync(studentId);

            return Ok(courses);
        }


        [Authorize(Roles = "student")]
        [HttpDelete("remove-saved-course")]
        public async Task<IActionResult> RemoveSavedCourse([FromQuery] int courseId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);

            var result = await _studentService.RemoveSavedCourseAsync(studentId, courseId);

            return result ? Ok("Course removed from saved list") : NotFound("Course not found in saved list");
        }


        // -------- Get logged-in student's enrollments --------
        [Authorize(Roles = "student")]
        [HttpGet("my-enrollments")]
        public async Task<IActionResult> GetMyEnrollments()
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var courses = await _studentService.GetEnrollmentsAsync(studentId);
            return Ok(courses);
        }

        // -------- Enroll in a course --------
        [Authorize(Roles = "student")]
        [HttpPost("enroll")]
        public async Task<IActionResult> Enroll([FromQuery] int courseId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var success = await _studentService.EnrollCourseAsync(studentId, courseId);

            if (!success) return BadRequest("Already enrolled in this course");

            return Ok("Enrolled successfully");
        }

        // Optional: Remove enrollment
        [Authorize(Roles = "student")]
        [HttpDelete("remove-enrollment")]
        public async Task<IActionResult> RemoveEnrollment([FromQuery] int courseId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var success = await _studentService.RemoveEnrollmentAsync(studentId, courseId);

            if (!success) return NotFound("Enrollment not found");

            return Ok("Enrollment removed successfully");
        }


        [Authorize(Roles = "student")]
        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromQuery] int courseId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var success = await _studentService.AddToCartAsync(studentId, courseId);

            return success ? Ok("Course added to cart") : BadRequest("Course already in cart");
        }

        [Authorize(Roles = "student")]
        [HttpGet("cart")]
        public async Task<IActionResult> GetCart()
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var cart = await _studentService.GetCartAsync(studentId);
            return Ok(cart);
        }

        [Authorize(Roles = "student")]
        [HttpDelete("remove-cart-item")]
        public async Task<IActionResult> RemoveCartItem([FromQuery] int courseId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var success = await _studentService.RemoveFromCartAsync(studentId, courseId);

            return success ? Ok("Removed from cart") : NotFound("Not found in cart");
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromQuery] string paymentMethod = "card")
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var checkout = await _checkoutService.AddCheckoutAsync(studentId, paymentMethod);

            if (checkout == null)
                return BadRequest("Cart is empty");

            return Ok(new
            {
                Message = "Checkout successful",
                CheckoutId = checkout.CheckoutId,
                TotalPrice = checkout.TotalPrice,
                Courses = checkout.CheckoutItems?.Select(ci => ci.Course?.Title ?? "Unknown").ToList()
                 ?? new List<string>()
            });
        }

        [Authorize(Roles = "student")]
        [HttpGet("my-checkouts")]
        public async Task<IActionResult> GetMyCheckouts()
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var checkouts = await _checkoutService.GetStudentCheckoutsAsync(studentId);

            var result = checkouts.Select(c => new
            {
                c.CheckoutId,
                c.CheckoutDate,
                c.TotalPrice,
                c.PaymentMethod,
                c.PaymentStatus,
                Courses = c.CheckoutItems?.Select(ci => ci.Course?.Title ?? "Unknown").ToList()
                          ?? new List<string>()
            });

            return Ok(result);
        }

        [Authorize(Roles = "student")]
        [HttpGet("checkout/{checkoutId}")]
        public async Task<IActionResult> GetCheckoutById([FromRoute] int checkoutId)
        {
            var studentId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var checkout = await _checkoutService.GetCheckoutByIdAsync(checkoutId);

            if (checkout == null || checkout.StudentId != studentId)
                return NotFound("Checkout not found");

            return Ok(new
            {
                checkout.CheckoutId,
                checkout.CheckoutDate,
                checkout.TotalPrice,
                checkout.PaymentMethod,
                checkout.PaymentStatus,
                Courses = checkout?.CheckoutItems?.Select(ci => new
                {
                    ci.CourseId,
                    ci.Course?.Title,
                    ci.Price
                })
            });
        }


    }
}
