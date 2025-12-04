using Learnify_API.Data.DTO;
using Learnify_API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Learnify_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // Send a notification from one user to another
        //[Authorize]
        [HttpPost("user-send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationCreateDTO dto)
        {
            //  Extract Sender from JWT
            var senderIdStr = User.FindFirst("userId")?.Value;
            if (senderIdStr == null)
                return Unauthorized(new { message = "Invalid token" });

            int senderId = int.Parse(senderIdStr);

            dto.SenderId = senderId;   //  Override any client value

            if (string.IsNullOrWhiteSpace(dto.ReceiverEmail))
                return BadRequest("ReceiverEmail is required.");

            var result = await _notificationService.CreateNotificationAsync(dto);

            return Ok(new
            {
                message = "Notification sent successfully.",
                data = result
            });
        }


        //[Authorize]
        [HttpGet("user-receive")]
        public async Task<IActionResult> GetNotificationsByUser()
        {
            // Extract email from token (stored as "sub")
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (email == null)
                return Unauthorized(new { message = "Invalid token" });

            var (notifications, unreadNotificationCount) = await _notificationService.GetUserNotificationsAsync(email);

            if (notifications == null || !notifications.Any())
            {
                return Ok(new
                {
                    Notifications = Array.Empty<NotificationReadDTO>(),
                    UnreadCount = 0
                });
            }

            return Ok(new
            {
                Notifications = notifications,
                UnreadCount = unreadNotificationCount
            });
        }



        //  Mark a notification as read
        [HttpPut("user-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result = await _notificationService.MarkAsReadAsync(id);
            if (!result)
                return NotFound("Notification not found.");

            return Ok(new { message = "Notification marked as read." });
        }

        // DELETE /Notification/{id}
        [HttpDelete("user-delete/{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var result = await _notificationService.DeleteNotificationAsync(id);
            if (!result)
                return NotFound("Notification not found.");

            return Ok(new { message = "Notification deleted successfully." });
        }

    }
}
