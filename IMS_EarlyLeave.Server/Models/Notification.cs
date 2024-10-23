namespace IMS_EarlyLeave.Server.Models
{
    public class Notification
    {
        public int Notifi_ID { get; set; }       // Notification ID
        public DateTime Timestamp { get; set; }  // The time the notification was created
        public string? Description { get; set; }  // The description of the notification
        public int Expire { get; set; }          // Expiration status or duration (int, you can adjust based on its purpose)
        public int Trainee_id { get; set; }      // Trainee ID associated with the notification
        public int Unread { get; set; }         // Whether the notification is unread (boolean)
    }
}
