namespace Learnify_API.Data.ViewModels
{
    public class FeedBackVM
    {
        public string? Email { get; set; }
        public string? Massage { get; set; }
        public string? feedbackimage { get; set; }

        public IFormFile? imagefile { get; set; }
    }
}
