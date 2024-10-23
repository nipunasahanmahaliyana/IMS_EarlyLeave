namespace IMS_EarlyLeave.Server.DataAdpater
{
    public class Request
    {
     
        public string? Name { get; set; }
        public string? NIC { get; set; }
        public DateTime Date { get; set; }
        public string? Time { get; set; }
        public string? Reason { get; set; }
        public string? Supervisor_ID { get; set; }
        public string? Leave_type { get; set; }
        public int Status { get; set; }
        public DateTime AcceptDateTime { get; set; }
    }
}
