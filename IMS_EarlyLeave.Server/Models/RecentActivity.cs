namespace IMS_EarlyLeave.Server.Models
{
    public class RecentActivity
    {
        public int ActivityID { get; set; } // Unique identifier for the activity
        public int? Trainee_ID { get; set; } // ID of the trainee, nullable if it can be null
        public string? Description { get; set; } // Description of the activity
        public string? TimeStamp { get; set; }
        public int Status { get; set; }
    }
}
