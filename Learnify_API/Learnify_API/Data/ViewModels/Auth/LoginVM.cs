using System.ComponentModel.DataAnnotations;

namespace Learnify_API.Data.ViewModels.Auth
{
    public class LoginVM
    {
        [Required(ErrorMessage = "Email is Required")]
        [EmailAddress]
        public string? Email { get; set; }
        // -------------------------------
        [Required(ErrorMessage = "Password is Required")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
        // -------------------------------
        [Display(Name = "Remember Me")]
        public bool RememberMe { get; set; }
    }
}
