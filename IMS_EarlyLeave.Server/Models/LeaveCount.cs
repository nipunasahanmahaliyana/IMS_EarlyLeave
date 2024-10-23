namespace IMS_EarlyLeave.Server.Models
{
    public class LeaveMonthCount
    {
        public int TraineeID { get; set; }
        public int LeaveBalance { get; set; }
        public string? Month { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
