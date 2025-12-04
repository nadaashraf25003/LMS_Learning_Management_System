using System.ComponentModel.DataAnnotations;

namespace Learnify_API.Data.ViewModels.Auth
{
    public class RegisterVM
    {
        [Required(ErrorMessage = "FullName is Required")]
        public string? FullName { get; set; }
        // -------------------------------
        [Required(ErrorMessage = "UserName is Required")]
        public string? UserName { get; set; }
        // -------------------------------
        [Required(ErrorMessage = "Email is Required")]
        [EmailAddress]
        public string? Email { get; set; }
        // -------------------------------
        [Required(ErrorMessage = "Password is Required")]
        [StringLength(40, MinimumLength = 8)]
        [DataType(DataType.Password)]
        [Compare("ConfirmPassword", ErrorMessage = "Password and ConfirmPassword not matched")]
        public string? Password { get; set; }
        // -------------------------------  
        [Required(ErrorMessage = "ConfirmPassword is Required")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm Password")]
        public string? ConfirmPassword { get; set; }
    }
}
