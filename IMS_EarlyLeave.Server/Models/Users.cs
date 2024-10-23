namespace IMS_EarlyLeave.Server.Models
{
    public class Users
    {
    
        public string? Username { get; set; }
        public string? Password { get; set; }
        public int Trainee_ID { get; set; }
        public string? NIC { get; set; }
        public string? Trainee_Name { get; set; }
        public int Leave_Count { get; set; }
        public string? Image { get; set; }
        public int Supervisor_ID { get; set; }
    }
}
