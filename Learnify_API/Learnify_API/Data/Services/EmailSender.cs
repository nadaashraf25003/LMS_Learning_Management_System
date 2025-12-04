using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net.Mail;

namespace Learnify_API.Data.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var from = _configuration["Email:From"];
            var password = _configuration["Email:Password"];
            var smtpServer = _configuration["Email:SmtpServer"];
            var port = int.TryParse(_configuration["Email:Port"], out var p) ? p : 587;
            var senderName = _configuration["Email:Username"];

            var message = new MailMessage(from!, email, subject, htmlMessage);
            message.IsBodyHtml = true;
            using var client = new SmtpClient(smtpServer, port)
            {
                Credentials = new System.Net.NetworkCredential(from, password),
                EnableSsl = true,
            };
            return client.SendMailAsync(message);
        }
    }
}