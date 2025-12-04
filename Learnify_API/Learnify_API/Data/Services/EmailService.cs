using System.Net;
using System.Net.Mail;

namespace Learnify_API.Data.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // تحقق من أن القيم ليست null أو فارغة، واستخدم قيم افتراضية إذا لزم
            var smtpServer = _config["Email:SmtpServer"] ?? throw new InvalidOperationException("SMTP server not configured");
            var portString = _config["Email:Port"] ?? "587"; // قيمة افتراضية
            var username = _config["Email:Username"] ?? throw new InvalidOperationException("Email username not configured");
            var password = _config["Email:Password"] ?? throw new InvalidOperationException("Email password not configured");
            var fromEmail = _config["Email:From"] ?? username; // استخدم username كافتراضي إذا From null

            if (!int.TryParse(portString, out int port))
                port = 587; // الافتراضي إذا التحويل فشل

            var smtp = new SmtpClient(smtpServer, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);
            await smtp.SendMailAsync(mail);
        }

    }
}
