using IMS_EarlyLeave.Server.DataAdpater;
using IMS_EarlyLeave.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using ZXing;
using ZXing.QrCode;
using System.Drawing;
using System.Drawing.Imaging;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Transactions;
using static IMS_EarlyLeave.Server.Controllers.ELSController;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using OfficeOpenXml;
using System.Data;
using Org.BouncyCastle.Pqc.Crypto.Lms;
using Microsoft.AspNetCore.Mvc.Formatters;


namespace IMS_EarlyLeave.Server.Controllers
{

    public class ELSController : ControllerBase
    {
        private readonly string _connectionString;
        public ELSController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Route("/Users")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = new List<Users>();
            string query = "SELECT * FROM Users";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new Users
                            {
                                Username = reader["Username"].ToString(),
                                Password = reader["Password"].ToString(),
                                Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                NIC = reader["NIC"].ToString(),
                                Trainee_Name = reader["Trainee_Name"].ToString(),
                                Leave_Count = reader["Leave_Count"] != DBNull.Value ? (int)reader["Leave_Count"] : 0,
                            });
                        }

                    }

                }
            }
            return Ok(users);
        }

        [Route("/Userlogin")]
        [HttpGet]
        public IActionResult GetUserLog(string username)
        {
           
            string query = "SELECT Log_in FROM Users WHERE Username = @user";
            int login=-1;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@user", username);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {

                        if (reader.Read())
                        {
                            login = reader.GetInt32(0);
                            
                        }
                        return Ok(login);
                    }   
                       
                }
            }
            
        }

        [Route("/Adminlogin")]
        [HttpGet]
        public IActionResult AdminLogin(int username, string password)
        {
            string query = "SELECT Service_ID,Password FROM Supervisor WHERE Service_ID = @Service_id and Password = @Password";
            int service_ID = 0;
            
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {

                    con.Open();

                    using (SqlCommand comm = new SqlCommand(query, con))
                    {

                        comm.Parameters.AddWithValue("@Service_id", username);
                        comm.Parameters.AddWithValue("@Password", password);

                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                service_ID = (int)reader["Service_ID"];
                                
                            }

                        }
                        return Ok(service_ID);
                    }
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }


        }

        [Route("/NumberOfSessions")]
        [HttpGet]
        public IActionResult GetSessions(string username)
        {
            string query = @"
            SELECT COUNT(Log_in)
            FROM Users 
            INNER JOIN Assigned_Supervisor 
                ON Users.Trainee_ID = Assigned_Supervisor.Trainee_ID
            WHERE Assigned_Supervisor.Assigned_Supervisor_ID = @sup_id AND Log_in = 1";

            int countLogin = -1;

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        // Use parameterized queries to avoid SQL injection
                        cmd.Parameters.AddWithValue("@sup_id", username ?? string.Empty);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // Check if the result is NULL before reading
                                countLogin = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                            }
                        }
                    }
                }

                // Return the result
                return Ok(countLogin);
            }
            catch (SqlException sqlEx)
            {
                // Log SQL-related exceptions (e.g., connection issues, query syntax errors)
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                return StatusCode(500, "A database error occurred.");
            }
            catch (Exception ex)
            {
                // Catch other exceptions
                Console.WriteLine($"General Error: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }


        [Route("/Requets")]
        [HttpGet]
        public IActionResult GetRequests()
        {
            string query = "SELECT * FROM Request";
            var requests = new List<Requests>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            requests.Add(new Requests
                            {
                                Id = reader["Id"] != DBNull.Value ? (int)reader["Id"] : 0,
                                Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                NIC = reader["NIC"].ToString(),
                                Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                Time = reader["Time"].ToString(),
                                Reason = reader["Reason"].ToString(),
                                Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                Leave_type = reader["Leave_type"].ToString(),
                                Status = (int)reader["Status"],
                                AcceptDateTime = reader["AcceptDateTime"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,

                            });
                        }
                    }
                }
            }
            return Ok(requests);
        }

        [HttpGet]
        [Route("/ReqById")]
        public IActionResult RequestsByID(int Trainee_ID)
        {
            string query = "SELECT * FROM Request WHERE Trainee_ID = @Trainee_ID ORDER BY Id DESC";
            var requests = new List<Requests>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();

                    using (SqlCommand comm = new SqlCommand(query, conn))
                    {
                        comm.Parameters.AddWithValue("@Trainee_ID", Trainee_ID);

                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                requests.Add(new Requests
                                {
                                    Id = reader["Id"] != DBNull.Value ? (int)reader["Id"] : 0,
                                    Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                    Name = reader["Name"]?.ToString(),
                                    NIC = reader["NIC"]?.ToString(),
                                    Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                    Time = reader["Time"]?.ToString(),
                                    Reason = reader["Reason"]?.ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"]?.ToString(),
                                    Leave_type = reader["Leave_type"]?.ToString(),
                                    Status = (int)(reader["Status"] ?? 0),
                                    AcceptDateTime = reader["AcceptDateTime"] != DBNull.Value ? (DateTime)reader["AcceptDateTime"] : DateTime.MinValue
                                });
                            }
                        }
                    }
                }

                if (requests.Count == 0)
                {
                    return NotFound(new { Message = "No requests found for the provided Trainee ID." });
                }

                return Ok(requests);
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL exception (using a logging framework)
                return StatusCode(500, new { Message = "Database error occurred.", Details = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Log the general exception
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }


        [HttpPost]
        [Route("/AddRequest")]
        public IActionResult AddArequest(int trainee_id, [FromForm] Request req)
        {
            Console.WriteLine(req);
            if (req == null)
            {
                return BadRequest(new { message = "Invalid request data. Request body is missing." });
            }

            // Validate that essential fields are not null or empty
            if (string.IsNullOrEmpty(req.Name) || string.IsNullOrEmpty(req.NIC) || req.Date == DateTime.MinValue ||
                string.IsNullOrEmpty(req.Time) || string.IsNullOrEmpty(req.Reason) || string.IsNullOrEmpty(req.Supervisor_ID) ||
                string.IsNullOrEmpty(req.Leave_type))
            {
                return BadRequest(new { message = "Invalid request data. One or more required fields are missing." });
            }

            // SQL queries
            string insertQuery = "INSERT INTO Request (Trainee_ID, Name, NIC, Date, Time, Reason, Supervisor_ID, Leave_type, Status, AcceptDateTime) " +
                                 "VALUES (@Trainee_ID, @Name, @NIC, @Date, @Time, @Reason, @Supervisor_ID, @Leave_type, 0, NULL)";


            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();

                    // Insert the new leave request
                    using (SqlCommand insertCommand = new SqlCommand(insertQuery, conn))
                    {
                        insertCommand.Parameters.AddWithValue("@Trainee_ID", trainee_id);
                        insertCommand.Parameters.AddWithValue("@Name", req.Name);
                        insertCommand.Parameters.AddWithValue("@NIC", req.NIC);
                        insertCommand.Parameters.AddWithValue("@Date", req.Date); // Ensure the date is in yyyy-MM-dd format
                        insertCommand.Parameters.AddWithValue("@Time", req.Time); // Ensure time is in hh:mm:ss format
                        insertCommand.Parameters.AddWithValue("@Reason", req.Reason);
                        insertCommand.Parameters.AddWithValue("@Supervisor_ID", req.Supervisor_ID);
                        insertCommand.Parameters.AddWithValue("@Leave_type", req.Leave_type);

                        int rowsAffected = insertCommand.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return BadRequest(new { message = "Failed to submit the leave request." });
                        }
                    }
                }

                return Ok(new { message = "Request submitted successfully." });
            }
            catch (SqlException sqlEx)
            {
                // Log SQL-specific error details for debugging (if you have logging implemented)
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                return StatusCode(500, new { message = "Database error: " + sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Log general exceptions
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Server Error: " + ex.Message });
            }
        }



        [HttpGet]
        [Route("/DeleteRequest")]
        public IActionResult deleteRequest(int id)
        {
            string query = "DELETE FROM Request WHERE ID = @id";
            return Ok();
        }

        [HttpGet]
        [Route("/TotalUsers")]
        public IActionResult totalUsers()
        {
            string query = "SELECT COUNT(Trainee_ID) FROM Users";
            int count = -1;
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand comm = new SqlCommand(query, conn))
                    {
                        using (SqlDataReader reader = comm.ExecuteReader())
                        {

                            if (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                           
                        return Ok(count);
                    }
                   
                }
                
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Server error" });
            }

        }

        [HttpPost]
        [Route("/AddUsers")]
        public async Task<IActionResult> AddUsers([FromForm] UserDto user)
        {
            if (user == null)
            {
                return BadRequest(new { message = "Invalid user data." });
            }

            //if (image == null)
            //{
                //return BadRequest(new { message = "Image is required." });
            //}

            string selectQuery = "SELECT * FROM Users WHERE Trainee_ID = @Trainee_ID";
            string insertQuery = @"INSERT INTO Users 
                                   (Username, Password, Trainee_ID, NIC, Trainee_Name, IsActive,Leave_Count) 
                                   VALUES (@Username, @Password, @Trainee_ID, @NIC, @Trainee_Name, @IsActive,@Count)";

            try
            {
                // Convert the uploaded image file into a byte array
                //byte[] avatarData;
                //using (var memoryStream = new MemoryStream())
                //{
                    //await image.CopyToAsync(memoryStream);
                    //avatarData = memoryStream.ToArray();
                //}

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    // Check if the user with the given Trainee_ID already exists
                    using (SqlCommand checkUserCommand = new SqlCommand(selectQuery, conn))
                    {
                        checkUserCommand.Parameters.AddWithValue("@Trainee_ID", user.Trainee_ID);

                        var exists = await checkUserCommand.ExecuteScalarAsync();
                        if (exists != null)
                        {
                            return BadRequest(new { message = "User with the given Trainee ID already exists." });
                        }
                    }

                    // Insert new user
                    using (SqlCommand insertUserCommand = new SqlCommand(insertQuery, conn))
                    {
                        insertUserCommand.Parameters.AddWithValue("@Username", user.Username ?? string.Empty);
                        insertUserCommand.Parameters.AddWithValue("@Password", user.Password ?? string.Empty);
                        insertUserCommand.Parameters.AddWithValue("@Trainee_ID", user.Trainee_ID);
                        insertUserCommand.Parameters.AddWithValue("@NIC", user.NIC ?? string.Empty);
                        insertUserCommand.Parameters.AddWithValue("@Trainee_Name", user.Trainee_Name ?? string.Empty);
                        insertUserCommand.Parameters.AddWithValue("@IsActive", 0); // Default IsActive to 0
                        insertUserCommand.Parameters.AddWithValue("@Count", 0); // Default IsActive to 0
                        //insertUserCommand.Parameters.AddWithValue("@Image", avatarData);

                        await insertUserCommand.ExecuteNonQueryAsync();
                    }

                    return Ok(new { message = "User added successfully." });
                }
            }
            catch (SqlException sqlEx)
            {
                // Log the detailed SQL error for debugging
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                return StatusCode(500, new { message = "Database error occurred. Please try again later." });
            }
            catch (Exception ex)
            {
                // Log general exception details
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        public class UserDto
        {
            public string? Username { get; set; }
            public string? Password { get; set; }
            public int Trainee_ID { get; set; }
            public string? NIC { get; set; }
            public string? Trainee_Name { get; set; }
        }


        [HttpDelete]
        [Route("/DeleteUser")]
        public IActionResult DeleteUser(string username, string password)
        {
            string _query = "SELECT * FROM Users WHERE Username = @Username and Password = @Password";
            string query = "DELETE FROM Users WHERE Username = @Username and Password = @Password";
            bool has = false;
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand comm = new SqlCommand(_query, conn))
                    {
                        comm.Parameters.AddWithValue("@Username", username);
                        comm.Parameters.AddWithValue("Password", password);

                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                has = true;
                                reader.Close();
                            }
                            else
                            {
                                has = false;
                                reader.Close();
                            }
                        }
                    }
                    if (has)
                    {
                        using (SqlCommand command = new SqlCommand(query, conn))
                        {
                            command.Parameters.AddWithValue("@Username", username);
                            command.Parameters.AddWithValue("@Password", password);

                            command.ExecuteNonQuery();
                        }

                        return Ok(new { message = "User Deleted Successfully" });

                    }
                    else
                    {
                        return BadRequest(new { message = "No username found" });
                    }

                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Server error" });
            }

        }

        [HttpGet]
        [Route("/UserById")]
        public IActionResult UserByID(string trainee_id)
        {
            string query = "SELECT * FROM Users WHERE Trainee_ID = @Trainee_id";

            Users user = null;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand(query, conn))
                {
                    command.Parameters.AddWithValue("Trainee_id", trainee_id);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read()) // Read the first record if available
                        {
                            // Convert the image to a base64 string if it exists
                            string? imageBase64 = null;
                            if (!reader.IsDBNull(5))
                            {
                                byte[] imageBytes = (byte[])reader["Image"];
                                imageBase64 = Convert.ToBase64String(imageBytes);
                            }

                            user = new Users
                            {
                                Username = reader["Username"].ToString(),
                                Password = reader["Password"].ToString(),
                                NIC = reader["NIC"].ToString(),
                                Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                Trainee_Name = reader["Trainee_Name"].ToString(),
                                Leave_Count = reader["Leave_Count"] != DBNull.Value ? (int)reader["Leave_Count"] : 0,
                                Image = imageBase64
                            };
                        }
                    }
                }
            }

            if (user == null)
            {
                return NotFound(new { message = "User not found" }); // Return 404 if user not found
            }

            return Ok(user);
        }

        [HttpPut]
        [Route("/updateUser")]
        public async Task<IActionResult> UpdateUser(
            int trainee_ID,
            string Username,
            string Password,
            IFormFile image)
        {
            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || image == null)
            {
                return BadRequest(new { message = "All fields are required." });
            }

            // SQL query for updating the user details
            string query = "UPDATE Users SET Username = @Username, Password = @Password, Image = @Image WHERE Trainee_ID = @Trainee_ID";

            try
            {
                byte[] fileBytes = null;
                if (image != null && image.Length > 0)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream); // Use asynchronous copy
                        fileBytes = memoryStream.ToArray(); // Convert the memory stream to a byte array
                    }
                }

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync(); // Ensure the connection is opened asynchronously
                    using (SqlCommand comm = new SqlCommand(query, conn))
                    {
                        comm.Parameters.AddWithValue("@Username", Username);
                        comm.Parameters.AddWithValue("@Password", Password);
                        comm.Parameters.AddWithValue("@Trainee_ID", trainee_ID);
                        comm.Parameters.AddWithValue("@Image", fileBytes ?? (object)DBNull.Value);

                        int rowsAffected = await comm.ExecuteNonQueryAsync(); // Use asynchronous execution

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Profile updated successfully." });
                        }
                        else
                        {
                            return NotFound(new { message = "User not found or no changes made." });
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log SQL exception details here
                return StatusCode(500, new { message = "Database error", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Log general exception details here
                return StatusCode(500, new { message = "An unexpected error occurred", error = ex.Message });
            }
        }

        [HttpGet]
        [Route("/AssignedSupervisor")]
        public async Task<IActionResult> AssignedSupervisor(int trainee_id)
        {
            // Check for invalid or missing trainee_id
            if (trainee_id <= 0)
            {
                return BadRequest(new { message = "Invalid trainee ID." });
            }

            try
            {
                // SQL query to fetch supervisor details for the provided trainee_id
                string query = @"
                SELECT Assigned_Supervisor_ID
                FROM Assigned_Supervisor 
                WHERE Trainee_ID = @Trainee_id";

                // Open SQL connection and execute the query
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync(); // Open the connection asynchronously

                    using (SqlCommand command = new SqlCommand(query, conn))
                    {
                        // Add the trainee_id as a parameter
                        command.Parameters.AddWithValue("@Trainee_ID", trainee_id);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            // Check if any supervisor was found
                            if (await reader.ReadAsync())
                            {
                                int supervisor_id = reader.GetInt32(0);
                                return Ok(supervisor_id);
                            }
                            else
                            {
                                // No supervisor found for the given trainee_id
                                return NotFound(new { message = "No supervisor found for the given trainee ID." });
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Handle SQL-related exceptions
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Handle general exceptions
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }


        [HttpPost]
        [Route("/ReqBySupervisor")]
        public IActionResult ReqBySupervisorID(string supID)
        {
            string query = "SELECT Id,Trainee_ID,Name,NIC,Date,Time,Reason,Supervisor_ID,Leave_type,Status,AcceptDateTime FROM Request WHERE Supervisor_ID = @supID";

            List<Requests> req = new List<Requests>();
            var status = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@supID", supID);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                req.Add(new Requests
                                {
                                    Id = reader["Id"] != DBNull.Value ? (int)reader["Id"] : 0,
                                    Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                    Name = reader["Name"].ToString(),
                                    NIC = reader["NIC"].ToString(),
                                    Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                    Time = reader["Time"].ToString(),
                                    Reason = reader["Reason"].ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                    Leave_type = reader["Leave_type"].ToString(),
                                    Status = (int)reader["Status"],
                                    AcceptDateTime = reader["AcceptDateTime"] != DBNull.Value && reader["AcceptDateTime"] is DateTime
                                             ? ((DateTime)reader["AcceptDateTime"]).Date
                                             : DateTime.MinValue // Default to MinValue if invalid

                                });

                            }


                            return Ok(req);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Server error" });
            }

        }

        [HttpPost]
        [Route("/ReqBySupervisorandTrainee")]
        public IActionResult ReqBySupervisorIDandTraineeID(string supID,int trainee_id)
        {
            string query = "SELECT Id,Trainee_ID,Name,NIC,Date,Time,Reason,Supervisor_ID,Leave_type,Status,AcceptDateTime FROM Request WHERE Supervisor_ID = @supID AND Trainee_ID = @Trainee_id";

            List<Requests> req = new List<Requests>();
            var status = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@supID", supID);
                        cmd.Parameters.AddWithValue("@Trainee_id", trainee_id);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                req.Add(new Requests
                                {
                                    Id = reader["Id"] != DBNull.Value ? (int)reader["Id"] : 0,
                                    Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                    Name = reader["Name"].ToString(),
                                    NIC = reader["NIC"].ToString(),
                                    Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                    Time = reader["Time"].ToString(),
                                    Reason = reader["Reason"].ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                    Leave_type = reader["Leave_type"].ToString(),
                                    Status = (int)reader["Status"],
                                    AcceptDateTime = reader["AcceptDateTime"] != DBNull.Value && reader["AcceptDateTime"] is DateTime
                                             ? ((DateTime)reader["AcceptDateTime"]).Date
                                             : DateTime.MinValue // Default to MinValue if invalid

                                });

                            }


                            return Ok(req);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Server error" });
            }

        }


        [HttpPut]
        [Route("/SupervisorApproval")]
        public IActionResult SupervisorApprove(int id)
        {

            Console.WriteLine(id);

            string selectIDQuery = "SELECT Trainee_ID FROM Request WHERE Id = @id";
            string selectQuery = "SELECT Leave_count FROM Users WHERE Trainee_ID = @Trainee_ID";
            string updateQuery = "UPDATE Users SET Leave_Count = @Leave_Count WHERE Trainee_ID = @Trainee_ID";
            string query = "UPDATE Request SET Status = 1, AcceptDateTime = @Datetime WHERE Id = @id";

            int leaveCount = 0;
            int trainee_id = 0;

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                con.Open();
                using (SqlTransaction transaction = con.BeginTransaction())
                {
                    try
                    {
                        // Step 1: Fetch Trainee_ID
                        using (SqlCommand com = new SqlCommand(selectIDQuery, con, transaction))
                        {
                            com.Parameters.AddWithValue("@id", id);
                            using (SqlDataReader reader = com.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    trainee_id = reader.GetInt32(0);
                                }
                                else
                                {
                                    return NotFound(new { message = "Request not found." });
                                }
                            }
                        }

                        // Step 2: Fetch current Leave_count
                        using (SqlCommand selectCommand = new SqlCommand(selectQuery, con, transaction))
                        {
                            selectCommand.Parameters.AddWithValue("@Trainee_ID", trainee_id);
                            using (SqlDataReader reader = selectCommand.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    leaveCount = reader["Leave_count"] != DBNull.Value ? (int)reader["Leave_count"] : 0;
                                }
                                else
                                {
                                    return BadRequest(new { message = "Trainee not found in the system." });
                                }
                            }
                        }

                        // Step 3: Update Leave count
                        using (SqlCommand updateCommand = new SqlCommand(updateQuery, con, transaction))
                        {
                            updateCommand.Parameters.AddWithValue("@Trainee_ID", trainee_id);
                            updateCommand.Parameters.AddWithValue("@Leave_Count", leaveCount + 1);
                            updateCommand.ExecuteNonQuery();
                        }

                        // Step 4: Update Request status
                        using (SqlCommand command = new SqlCommand(query, con, transaction))
                        {
                            command.Parameters.AddWithValue("@Datetime", DateTime.Now);
                            command.Parameters.AddWithValue("@id", id);
                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected == 0)
                            {
                                return NotFound(new { message = "Request not found." });
                            }
                        }

                        // Commit the transaction if all commands succeed
                        transaction.Commit();
                        return Ok(new { message = "Request approved successfully." });
                    }
                    catch (SqlException ex)
                    {
                        // Rollback the transaction if any command fails
                        transaction.Rollback();
                        return BadRequest(new { message = "Server Error: " + ex.Message });
                    }
                    catch (Exception ex)
                    {
                        // Rollback the transaction if an unexpected error occurs
                        transaction.Rollback();
                        return BadRequest(new { message = "Unexpected error: " + ex.Message });
                    }
                }
            }
        }


        [HttpPut]
        [Route("/SupervisorDecline")]
        public IActionResult cancelRequest(int id)
        {
            string query = "Update Request SET Status = 2 WHERE ID = @id";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    using (SqlCommand com = new SqlCommand(query, con))
                    {
                        com.Parameters.AddWithValue("@id", id);
                        com.ExecuteNonQuery();
                        return Ok("Request Declined");
                    }
                }
            }
            catch (SqlException ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("/QRGenerator")]
        public IActionResult QRGen(int trainee_id)
        {

            string query = "SELECT Name,NIC,Date,Time,Reason,Supervisor_ID,Leave_type FROM Request WHERE Trainee_ID = @TraineeID AND Status = 2";
            Request req = null;
            string qrContent = null;
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@TraineeID", trainee_id);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                req = new Request
                                {
                                    Name = reader["Name"].ToString(),
                                    NIC = reader["NIC"].ToString(),
                                    // Handling TimeSpan conversion to DateTime
                                    Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                    Reason = reader["Reason"].ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                    Leave_type = reader["Leave_type"].ToString(),
                                    Status = 2,

                                };

                                // Convert leaveDetails to a string format (e.g., JSON) that can be encoded in the QR code
                                qrContent = $"Name:{req.Name}," +
                                            $"NIC: {req.NIC}, " +
                                            $"Date:{req.Date}," +
                                            $"Reason: {req.Reason}, " +
                                            $"Supervisor_ID: {req.Supervisor_ID}, " +
                                            $"Leave_type: {req.Leave_type}, " +
                                       $"Status: {req.Status}";
                            }
                            reader.Close();


                        }

                    }
                }

                // Create a barcode writer instance
                var barcodeWriter = new BarcodeWriterPixelData
                {
                    Format = BarcodeFormat.QR_CODE,
                    Options = new QrCodeEncodingOptions
                    {
                        Height = 300,
                        Width = 300,
                        Margin = 1
                    }
                };

                // Generate the QR code
                var pixelData = barcodeWriter.Write(qrContent);

                // Create a Bitmap from the pixel data
                using (var bitmap = new Bitmap(pixelData.Width, pixelData.Height, PixelFormat.Format32bppRgb))
                {
                    using (var ms = new MemoryStream())
                    {
                        var bitmapData = bitmap.LockBits(new Rectangle(0, 0, pixelData.Width, pixelData.Height), ImageLockMode.WriteOnly, PixelFormat.Format32bppRgb);
                        try
                        {
                            System.Runtime.InteropServices.Marshal.Copy(pixelData.Pixels, 0, bitmapData.Scan0, pixelData.Pixels.Length);
                        }
                        finally
                        {
                            bitmap.UnlockBits(bitmapData);
                        }

                        // Save the bitmap to a memory stream as PNG
                        bitmap.Save(ms, ImageFormat.Png);
                        var byteImage = ms.ToArray();

                        // Set a file name for the download
                        var fileName = "QRCode.png";

                        // Return the file as a downloadable attachment
                        return File(byteImage, "image/png", fileName);
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Not working", error = ex.Message });
            }


        }
        /*
        [HttpPost]
        [Route("/GetDetailsByQR")]
        public IActionResult DecodeQRCode([FromBody] byte[] qrCodeImage)
        {
            if (qrCodeImage == null || qrCodeImage.Length == 0)
            {
                return BadRequest("No QR code image provided.");
            }

            try
            {
                // Load the image from the byte array
                using (var ms = new MemoryStream(qrCodeImage))
                using (var bitmap = new Bitmap(ms))
                {
                    // Create a barcode reader instance
                    var barcodeReader = new BarcodeReaderGeneric
                    {
                        AutoRotate = true,
                        TryInverted = true
                    };

                    // Decode the QR code
                    var result = barcodeReader.Decode(bitmap);

                    if (result != null)
                    {
                        return Ok(result.Text); // The content encoded in the QR code
                    }
                    else
                    {
                        return BadRequest("QR code could not be decoded.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (if logging is set up)
                // _logger.LogError(ex, "Error decoding QR code.");

                return BadRequest($"Error decoding QR code: {ex.Message}");
            }
        }
        */
        [HttpGet]
        [Route("/GenerateLeaveRequestPDF")]
        public IActionResult GenerateLeaveRequestPDF(int id)
        {
            string query = "SELECT Name, NIC, Date, Time, Reason, Supervisor_ID, Leave_type, Status, AcceptDateTime FROM Request WHERE Id = @ID";
            Request req = null;
            string content = null;
            string acceptDateErrorMessage = "Accepted Date and Time is not valid.";

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("ID", id);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                req = new Request
                                {
                                    Name = reader["Name"].ToString(),
                                    NIC = reader["NIC"].ToString(),
                                    Date = reader["Date"] != DBNull.Value ? ((DateTime)reader["Date"]).Date : DateTime.MinValue,
                                    Time = reader["Time"].ToString(),
                                    Reason = reader["Reason"].ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                    Leave_type = reader["Leave_type"].ToString(),
                                    Status = (int)reader["Status"],
                                    // Validate AcceptDateTime
                                    AcceptDateTime = reader["AcceptDateTime"] != DBNull.Value && reader["AcceptDateTime"] is DateTime
                                             ? ((DateTime)reader["AcceptDateTime"]).Date
                                             : DateTime.MinValue // Default to MinValue if invalid
                                };

                                // Prepare the content string for QR code or further use
                                content = $"Name:{req.Name}," +
                                          $"NIC: {req.NIC}, " +
                                          $"Date:{req.Date.ToString("MM/dd/yyyy")}," +
                                          $"Time:{req.Time}," +
                                          $"Reason: {req.Reason}, " +
                                          $"Supervisor_ID: {req.Supervisor_ID}, " +
                                          $"Leave_type: {req.Leave_type}, " +
                                          $"Leave_type: {req.AcceptDateTime}, " +
                                          $"Status: {req.Status}";
                            }
                        }
                    }
                }

                // Check if req is null to ensure data was fetched successfully
                if (req == null)
                {
                    return NotFound("Leave request not found.");
                }


                // Create a new PDF document
                var document = new PdfDocument();
                var page = document.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                // Set up a modern design
                //page.Size = PageSize.A4;
                //gfx.Clear(XColors.White);
                // Load the logo image
                string logoPath = @"C:\Users\N.Sahan\Desktop\IMS\IMS_EarlyLeave\IMS_EarlyLeave\ims_earlyleave.client\src\assets\SLT-LOGO.png"; // Adjust path as necessary
                XImage logoImage = XImage.FromFile(logoPath);

                // Draw the logo on the PDF (Adjust X and Y positions as needed)
                gfx.DrawImage(logoImage, 40, 100, 100, 150); // (image, x, y, width, height)

                // Define fonts
                var titleFont = new XFont("Arial", 16, XFontStyle.Bold);
                var contentFont = new XFont("Arial", 12, XFontStyle.Regular);
                var headerFont = new XFont("Arial", 14, XFontStyle.Bold);

                // Draw a header box
                gfx.DrawRectangle(XBrushes.LightBlue, new XRect(0, 0, page.Width, 50));
                gfx.DrawString("Leave Request Approval", titleFont, XBrushes.Black, new XRect(0, 10, page.Width, 50), XStringFormats.TopCenter);

                // Recipient
                gfx.DrawString("To: Manager / Security", headerFont, XBrushes.Black, new XRect(40, 70, page.Width, page.Height), XStringFormats.TopLeft);

                // Content - Permission Details
                gfx.DrawString($"I hereby grant permission to Mr/Ms {req.Name} ( NIC {req.NIC} ) to leave SLT premises ", contentFont, XBrushes.Black,
                    new XRect(40, 100, page.Width - 80, page.Height), XStringFormats.TopLeft);

                // Format the date to display only the date portion
                string formattedDate = req.Date.ToString("MM/dd/yyyy");

                // Draw the string without the time part
                gfx.DrawString($"at (Time) {req.Time} on (Date) {formattedDate}.", contentFont, XBrushes.Black,
                    new XRect(40, 130, page.Width - 80, page.Height), XStringFormats.TopLeft);

                // Purpose
                gfx.DrawString("Purpose:", headerFont, XBrushes.Black, new XRect(40, 160, page.Width, page.Height), XStringFormats.TopLeft);
                gfx.DrawString($"    {req.Reason}", contentFont, XBrushes.Black, new XRect(100, 162, page.Width - 80, page.Height), XStringFormats.TopLeft);

                // Footer with a border line
                gfx.DrawLine(XPens.Black, new XPoint(40, 230), new XPoint(page.Width - 40, 230));
                gfx.DrawString($"Signature: {req.Supervisor_ID}", contentFont, XBrushes.Black, new XRect(40, 240, page.Width - 80, page.Height), XStringFormats.TopLeft);
                gfx.DrawString($"Frank: {req.Supervisor_ID}", contentFont, XBrushes.Black, new XRect(200, 240, page.Width - 80, page.Height), XStringFormats.TopLeft);

                // Format the AcceptDateTime for display
                string acceptDateFormatted = req.AcceptDateTime != DateTime.MinValue ? req.AcceptDateTime.ToString("MM/dd/yyyy") : acceptDateErrorMessage;
                gfx.DrawString($"Date: {acceptDateFormatted}", contentFont, XBrushes.Black, new XRect(350, 240, page.Width - 80, page.Height), XStringFormats.TopLeft);

                gfx.DrawString("Supervising officer (A5 and above)", contentFont, XBrushes.Black, new XRect(40, 270, page.Width, page.Height), XStringFormats.TopLeft);

                // Save the document into a memory stream
                using (var stream = new MemoryStream())
                {
                    document.Save(stream, false);
                    var pdfBytes = stream.ToArray();

                    // Return the PDF as a downloadable file
                    return File(pdfBytes, "application/pdf", "LeaveRequest.pdf");
                }
            }
            catch (SqlException sqlEx)
            {
                // Log SQL exceptions (consider using a logging framework)
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log general exceptions
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet]
        [Route("/PendingRequests")]
        public IActionResult pendingRequests()
        {
            string query = "SELECT * FROM Request WHERE Status = 0 ";
            List<Requests> req = new List<Requests>();

            try
            {

                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    using (SqlCommand comm = new SqlCommand(query, con))
                    {
                        //comm.Parameters.AddWithValue("@Supervisor_ID", supID);
                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                req.Add(new Requests
                                {


                                    Id = (int)reader["Id"],
                                    Trainee_ID = (int)reader["Trainee_ID"],
                                    Name = reader["Name"].ToString(),
                                    NIC = reader["NIC"].ToString(),
                                    //Handling TimeSpan conversion to DateTime
                                    Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                    Time = reader["Time"].ToString(),
                                    Reason = reader["Reason"].ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                    Leave_type = reader["Leave_type"].ToString(),
                                    Status = (int)reader["Status"]

                                });

                            }
                            return Ok(req);
                        }
                    }

                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }

        }

        [HttpGet]
        [Route("/PendingRequestsbySupervisor")]
        public IActionResult pendingRequestsBySupervisor(string Supervisor_ID)
        {
            string query = "SELECT * FROM Request WHERE Status = 0 AND Supervisor_ID = @sup_id";
            List<Requests> req = new List<Requests>();

            try
            {

                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    using (SqlCommand comm = new SqlCommand(query, con))
                    {
                        comm.Parameters.AddWithValue("@sup_id", Supervisor_ID);
                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                req.Add(new Requests
                                {


                                    Id = (int)reader["Id"],
                                    Trainee_ID = (int)reader["Trainee_ID"],
                                    Name = reader["Name"].ToString(),
                                    NIC = reader["NIC"].ToString(),
                                    //Handling TimeSpan conversion to DateTime
                                    Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                    Time = reader["Time"].ToString(),
                                    Reason = reader["Reason"].ToString(),
                                    Supervisor_ID = reader["Supervisor_ID"].ToString(),
                                    Leave_type = reader["Leave_type"].ToString(),
                                    Status = (int)reader["Status"]

                                });

                            }
                            return Ok(req);
                        }
                    }

                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }

        }

        [HttpGet]
        [Route("/PendingRequestsCountbySupervisor")]
        public IActionResult pendingRequestsCount(string Supervisor_ID)
        {
            string query = "SELECT Count(*) FROM Request WHERE Status = 0 AND Supervisor_ID = @sup_id";
            int count = -1;

            try
            {

                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    using (SqlCommand comm = new SqlCommand(query, con))
                    {
                        comm.Parameters.AddWithValue("@sup_id", Supervisor_ID);
                         
                        using (SqlDataReader reader = comm.ExecuteReader())
                        {

                            if (reader.Read())
                            {
                                count = reader.GetInt32(0);

                            }

                        }
                        return Ok(count);

                    }

                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }

        }

        [HttpGet]
        [Route("/ApprovedRequests")]
        public IActionResult ApprovedRequets(int trainee_id)
        {

            string query = @"SELECT Id, Trainee_ID, Name, NIC, Date, Time, Reason, Supervisor_ID, Leave_type, Status, AcceptDateTime 
                            FROM Request WHERE Trainee_ID = @TraineeID AND Status = 1";

            List<Requests> requests = new List<Requests>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TraineeID", trainee_id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Requests req = new Requests
                            {
                                Id = (int)reader["Id"],
                                Trainee_ID = (int)reader["Trainee_ID"],
                                Name = reader["Name"] as string,
                                NIC = reader["NIC"] as string,
                                Date = reader["Date"] != DBNull.Value ? (DateTime)reader["Date"] : DateTime.MinValue,
                                Time = reader["Time"] as string,
                                Reason = reader["Reason"] as string,
                                Supervisor_ID = reader["Supervisor_ID"] as string,
                                Leave_type = reader["Leave_type"] as string,
                                Status = (int)reader["Status"],
                                AcceptDateTime = reader["AcceptDateTime"] != DBNull.Value ? (DateTime)reader["AcceptDateTime"] : DateTime.MinValue

                            };

                            requests.Add(req); // Add each request to the list
                        }
                    }
                }
            }
            return Ok(requests);
        }

        [HttpGet]
        [Route("/DeclinedRequests")]
        public IActionResult declinedRequests()
        {
            string query = "SELECT * FROM Request WHERE Status = 2";
            return Ok();
        }

        [HttpGet]
        [Route("/Login")]
        public IActionResult Login(string username, string password)
        {
            string query = "SELECT Username,Trainee_ID FROM [dbo].[Users] WHERE Username = @Username and Password = @Password";
            int trainee_ID = 0;
            string name = "";
            try
            {


                using (SqlConnection con = new SqlConnection(_connectionString))
                {

                    con.Open();

                    using (SqlCommand comm = new SqlCommand(query, con))
                    {

                        comm.Parameters.AddWithValue("@Username", username);
                        comm.Parameters.AddWithValue("@Password", password);

                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                trainee_ID = (int)reader["Trainee_ID"];
                                name = (string)reader["Username"];
                            }

                        }
                        return Ok(trainee_ID);
                    }
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }


        }

        [HttpGet]
        [Route("/leaveCount")]
        public IActionResult leaveCount(int trainee_id)
        {
            string query = "SELECT Leave_Count FROM Users WHERE Trainee_ID = @Trainee_ID";
            int count = 0;
            try
            {


                using (SqlConnection con = new SqlConnection(_connectionString))
                {

                    con.Open();

                    using (SqlCommand comm = new SqlCommand(query, con))
                    {

                        comm.Parameters.AddWithValue("@Trainee_ID", trainee_id);


                        using (SqlDataReader reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = (int)reader["Leave_Count"];

                            }

                        }
                        return Ok(count);
                    }
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }

;
        }

        [HttpGet]
        [Route("/weeklyCount")]
        public int GetWeeklyLeaveCount(int trainee_id)
        {

            string query = @"
            SELECT COUNT(*)
            FROM Request
            WHERE Trainee_ID = @trainee_id
            AND Date >= DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) - 2), CAST(GETDATE() AS DATE))
            AND Date <= DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE));";


            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    comm.Parameters.AddWithValue("@trainee_id", trainee_id);

                    // Use ExecuteScalar() for queries that return a single value
                    int count = (int)comm.ExecuteScalar();



                    return count;
                }


            }
        }

        [HttpGet]
        [Route("/TotalLeaveCount")]
        public async Task<IActionResult> GetRequestsByDate(string date)
        {

            if (!DateTime.TryParse(date, out DateTime requestDate))
            {
                return BadRequest(new { error = "Invalid date format. Please use YYYY-MM-DD." });
            }

            string totalRequestsQuery = "SELECT COUNT(*) FROM Request WHERE Date = @Date AND Status = 1";
            int totalRequests = 0;

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {

                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(totalRequestsQuery, conn))
                    {

                        cmd.Parameters.AddWithValue("@Date", date);
                        var result = await cmd.ExecuteScalarAsync();


                        if (result != null)
                        {
                            totalRequests = Convert.ToInt32(result);
                        }
                    }
                }

                // Return the count in the response
                return Ok(new { date = requestDate.ToString("yyyy-MM-dd"), totalRequests = totalRequests });
            }
            catch (SqlException sqlEx)
            {
                // SQL-specific error handling
                return StatusCode(500, new { error = "A database error occurred.", details = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // General error handling
                return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet]
        [Route("/CurrentMonthLeaveCounts")]
        public async Task<IActionResult> GetLeaveCountsForCurrentMonth()
        {
            try
            {
                var leaveCounts = new List<LeaveCount>();

                string query = @"
                    SELECT Leave_Type, COUNT(*) AS TotalRequests
                    FROM Request
                    WHERE Date >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) 
                      AND Date < DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) + 1, 0) 
                      AND Status = 1
                    GROUP BY Leave_Type";

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                leaveCounts.Add(new LeaveCount
                                {
                                    LeaveType = reader["Leave_Type"].ToString(),
                                    TotalRequests = (int)reader["TotalRequests"]
                                });
                            }
                        }
                    }
                }

                // If no data found, return an empty list
                if (leaveCounts.Count == 0)
                {
                    return NotFound("No leave requests found for the current month.");
                }

                return Ok(leaveCounts);
            }
            catch (SqlException sqlEx)
            {
                // Log SQL exceptions (you can use your preferred logging framework here)
                return StatusCode(500, $"SQL error occurred: {sqlEx.Message}");
            }
            catch (InvalidOperationException invalidOpEx)
            {
                // Log invalid operation exceptions
                return StatusCode(500, $"Invalid operation error occurred: {invalidOpEx.Message}");
            }
            catch (Exception ex)
            {
                // Log general exceptions
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        public class LeaveCount
        {
            public string? LeaveType { get; set; }
            public int TotalRequests { get; set; }
        }

        [HttpGet]
        [Route("/CurrentMonthWeeklyLeaveCounts")]
        public async Task<IActionResult> GetCurrentMonthWeeklyLeaveCounts()
        {
            var leaveCounts = new List<WeeklyLeaveCount>();

            // Get current month and year
            int currentMonth = DateTime.Now.Month;
            int currentYear = DateTime.Now.Year;

            string query = @"
                SELECT 
                    DATEPART(WEEK, Date) AS WeekNumber,
                    COUNT(*) AS TotalRequests
                FROM Request
                WHERE Date >= DATEFROMPARTS(@Year, @Month, 1) AND 
                      Date < DATEADD(MONTH, 1, DATEFROMPARTS(@Year, @Month, 1))
                GROUP BY DATEPART(WEEK, Date)
                ORDER BY WeekNumber";

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        // Add parameters for the current month and year
                        cmd.Parameters.AddWithValue("@Year", currentYear);
                        cmd.Parameters.AddWithValue("@Month", currentMonth);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var leaveCount = new WeeklyLeaveCount
                                {
                                    WeekNumber = reader["WeekNumber"] != DBNull.Value ? (int)reader["WeekNumber"] : 0,
                                    TotalRequests = reader["TotalRequests"] != DBNull.Value ? (int)reader["TotalRequests"] : 0
                                };
                                leaveCounts.Add(leaveCount);
                            }
                        }
                    }
                }

                return Ok(leaveCounts);
            }
            catch (SqlException sqlEx)
            {
                // Log SQL exceptions (you can use your preferred logging framework here)
                return StatusCode(500, $"SQL error occurred: {sqlEx.Message}");
            }
            catch (InvalidOperationException invalidOpEx)
            {
                // Log invalid operation exceptions
                return StatusCode(500, $"Invalid operation error occurred: {invalidOpEx.Message}");
            }
            catch (Exception ex)
            {
                // Log general exceptions
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        public class WeeklyLeaveCount
        {
            public int WeekNumber { get; set; }
            public int TotalRequests { get; set; }
        }

        [HttpGet]
        [Route("/RequestByAcceptedDate")]
        public async Task<IActionResult> RequestByAcceptedDate(int trainee_id)
        {
            // Initialize the response object
            var results = new List<AcceptedDate>();

            try
            {
                // Check if the trainee_id is valid (greater than zero)
                if (trainee_id <= 0)
                {
                    return BadRequest("Invalid trainee ID. Trainee ID must be greater than zero.");
                }

                // Get today's date in the format YYYY-MM-DD
                string today = DateTime.Now.ToString("yyyy-MM-dd");

                // Query to get requests accepted on today's date for the specified trainee
                string query = @"
                SELECT Leave_Type, AcceptDateTime, Status
                FROM Request
                WHERE Status = 1 AND AcceptDateTime = @AcceptedDate AND Trainee_ID = @Trainee_id
                ORDER BY AcceptDateTime";

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    // Attempt to open the connection
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        // Add parameters for the query
                        cmd.Parameters.AddWithValue("@Trainee_id", trainee_id);
                        cmd.Parameters.AddWithValue("@AcceptedDate", today);

                        // Execute the query and handle the results
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (!reader.HasRows)
                            {
                                return NotFound("No accepted requests found for the given trainee and date.");
                            }

                            while (await reader.ReadAsync())
                            {
                                var request = new AcceptedDate
                                {
                                    Leave_Type = reader.GetString(0),    // Leave_Type
                                    ApproveDate = reader.GetString(1),   // AcceptedDate
                                    Status = reader.GetInt32(2)          // Status
                                };
                                results.Add(request);
                            }
                        }
                    }
                }

                return Ok(results);
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL-specific error (could use a logging framework here)
                return StatusCode(500, $"Database error occurred: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the general exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        public class AcceptedDate
        {
            public string? Leave_Type { get; set; }
            public string? ApproveDate { get; set; }
            public int Status { get; set; }
        }

        [HttpGet]
        [Route("/RecentActivities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            var activities = new List<RecentActivity>(); // List to hold the activities

            try
            {
                // Define the query to fetch recent activities
                string query = @"
            SELECT TOP (1000) ActivityID,
                              Trainee_ID,
                              Description,
                              TimeStamp,
                              Status
            FROM RecentActivity
            ORDER BY Timestamp DESC"; // You can order by Timestamp or any relevant column

                // Create a connection using the connection string
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync(); // Open the connection

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                // Map the reader to the RecentActivity object
                                var activity = new RecentActivity
                                {
                                    ActivityID = (int)reader["ActivityID"],
                                    Trainee_ID = reader.IsDBNull(reader.GetOrdinal("Trainee_ID")) ? (int?)null : (int)reader["Trainee_ID"],
                                    Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                    TimeStamp = reader.GetDateTime(3).ToString("yyyy-MM-dd HH:mm:ss"), // Convert DateTime to string
                                    Status = reader.GetInt32(4)
                                };
                                activities.Add(activity); // Add the activity to the list
                            }
                        }
                    }
                }

                return Ok(activities); // Return the list of activities
            }
            catch (SqlException sqlEx)
            {
                // Handle SQL exceptions specifically
                return StatusCode(500, $"SQL error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Handle all other exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("/AddRecentActivity")]
        public async Task<IActionResult> AddRecentActivity(int trainee_id, string description, int status)
        {
            // Validate the input
            if (trainee_id == null || string.IsNullOrEmpty(description))
            {
                return BadRequest("Invalid activity data. Description is required.");
            }

            try
            {
                // Define the SQL insert command
                string query = @"
                INSERT INTO RecentActivity(Trainee_ID, Description,Status)
                VALUES (@Trainee_ID, @Description, @Status)";

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        // Add parameters for the SQL command
                        cmd.Parameters.AddWithValue("@Trainee_ID", trainee_id); // Handle nullable Trainee_ID
                        cmd.Parameters.AddWithValue("@Description", description);
                        cmd.Parameters.AddWithValue("@Status", status);

                        // Execute the command
                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok("Activity added");
            }
            catch (SqlException sqlEx)
            {
                // Log SQL exceptions (you might want to use a logging library)
                return StatusCode(500, $"SQL error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the general exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }


        }

        [HttpGet]
        [Route("/GetUnreadNotifications")]
        public async Task<IActionResult> GetUnreadNotifications()
        {
            try
            {
                var notifications = new List<Notification>();
                string query = @"
                SELECT Notifi_ID, Trainee_id ,Timestamp, Description, Expire, Unread
                FROM Notifications
                WHERE Unread = 1
                ORDER BY Timestamp DESC";

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var notification = new Notification
                                {
                                    Notifi_ID = (int)reader["Notifi_ID"],
                                    Trainee_id = (int)reader["Trainee_id"],
                                    Timestamp = (DateTime)reader["Timestamp"],
                                    Description = reader["Description"].ToString(),
                                    Expire = (int)reader["Expire"],
                                    Unread = (int)reader["Unread"]
                                };
                                notifications.Add(notification);
                            }
                        }
                    }
                }

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("/MarkNotificationsAsRead")]
        public async Task<IActionResult> MarkNotificationsAsRead()
        {
            try
            {
                string query = @"
                UPDATE Notifications
                SET Unread = 0
                WHERE Unread = 1"; // Mark all unread notifications as read

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                        {
                            return Ok(new { message = "No notifications were marked as read." });
                        }
                        return Ok(new { message = "Notifications marked as read." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("/SaveNotification")]
        public async Task<IActionResult> SaveNotificationAsync(string description, int trainee_id)
        {
            if (string.IsNullOrEmpty(description) || trainee_id <= 0)
            {
                return BadRequest(new { message = "Invalid notification data." });
            }

            string insertQuery = "INSERT INTO Notifications (Description, Trainee_id) " +
                                 "VALUES (@Description, @Trainee_ID)";

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    using (SqlCommand command = new SqlCommand(insertQuery, conn))
                    {
                        command.Parameters.AddWithValue("@Description", description);
                        command.Parameters.AddWithValue("@Trainee_ID", trainee_id);

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Notification saved successfully." });
                        }
                        else
                        {
                            return StatusCode(500, new { message = "Failed to save notification." });
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, new { message = "Database error: " + sqlEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error: " + ex.Message });
            }

        }

        // Method to get the leave records
        [HttpGet]
        [Route("/Leaves")]
        public async Task<IActionResult> GetTraineeLeaves(int trainee_id)
        {
            List<LeaveMonthCount> traineeLeaves = new List<LeaveMonthCount>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // SQL Query
                    string query = @"
                        SELECT TraineeID, LeaveCount, Month, CreatedAt, UpdatedAt
                        FROM TraineeLeave WHERE TraineeID = @Trainee_ID
                        ORDER BY CreatedAt DESC ";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Trainee_ID", trainee_id);
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                LeaveMonthCount traineeLeave = new LeaveMonthCount
                                {
                                    TraineeID = reader.GetInt32(0),
                                    LeaveBalance = reader.GetInt32(1),
                                    Month = reader.GetString(2),
                                    CreatedAt = reader.GetDateTime(3),
                                    UpdatedAt = reader.GetDateTime(4)
                                };

                                traineeLeaves.Add(traineeLeave);
                            }
                        }
                    }
                }

                // Return 404 if no records are found
                if (traineeLeaves.Count == 0)
                {
                    return NotFound(new { Message = "No trainee leave records found." });
                }

                // Return the list of trainee leaves
                return Ok(traineeLeaves);
            }
            catch (SqlException sqlEx)
            {
                // SQL exception handling
                return StatusCode(500, new { Message = "Database error occurred.", Error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // General exception handling
                return StatusCode(500, new { Message = "An internal server error occurred.", Error = ex.Message });
            }
        }

        [HttpPost]
        [Route("/Setleaves")]
        public async Task<IActionResult> SetLeaves([FromBody] LeaveMonthCount model)
        {
            if (model == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("INSERT INTO TraineeLeave (TraineeID, LeaveCount, Month, UpdatedAt) VALUES (@TraineeID, @LeaveCount, @Month, @UpdatedAt)", conn))
                    {
                        // Prevent SQL Injection by using parameters
                        cmd.Parameters.AddWithValue("@TraineeID", model.TraineeID);
                        cmd.Parameters.AddWithValue("@LeaveCount", model.LeaveBalance);
                        cmd.Parameters.AddWithValue("@Month", model.Month);
                        cmd.Parameters.AddWithValue("@UpdatedAt", DateTime.Now); // Set updated time

                        // Execute the command
                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)
                        {
                            return Ok("Leave data saved successfully.");
                        }
                        else
                        {
                            return BadRequest("Failed to save leave data.");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // SQL exception handling
                return StatusCode(500, new { Message = "Database error occurred.", Error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // General exception handling
                return StatusCode(500, new { Message = "An internal server error occurred.", Error = ex.Message });
            }


        }

        [HttpPost]
        [Route("/ExcelSheet")]
        public async Task<IActionResult> ExportLeaveRequests([FromBody]List<Requests> leaveRequests)
        {
            if (leaveRequests == null || leaveRequests.Count == 0)
            {
                return BadRequest("No leave requests provided.");
            }

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Leave Requests");

                // Create header row
                worksheet.Cells[1, 1].Value = "ID";
                worksheet.Cells[1, 2].Value = "Trainee ID";
                worksheet.Cells[1, 3].Value = "Name";
                worksheet.Cells[1, 4].Value = "NIC";
                worksheet.Cells[1, 5].Value = "Date";
                worksheet.Cells[1, 6].Value = "Time";
                worksheet.Cells[1, 7].Value = "Reason";
                worksheet.Cells[1, 8].Value = "Supervisor ID";
                worksheet.Cells[1, 9].Value = "Leave Type";
                worksheet.Cells[1, 10].Value = "Status";
                worksheet.Cells[1, 11].Value = "Accept Date Time";

                // Populate data rows
                for (int i = 0; i < leaveRequests.Count; i++)
                {
                    var leave = leaveRequests[i];
                    worksheet.Cells[i + 2, 1].Value = leave.Id;
                    worksheet.Cells[i + 2, 2].Value = leave.Trainee_ID;
                    worksheet.Cells[i + 2, 3].Value = leave.Name;
                    worksheet.Cells[i + 2, 4].Value = leave.NIC;
                    worksheet.Cells[i + 2, 5].Value = leave.Date.ToString("yyyy-MM-dd");
                    worksheet.Cells[i + 2, 6].Value = leave.Time;
                    worksheet.Cells[i + 2, 7].Value = leave.Reason;
                    worksheet.Cells[i + 2, 8].Value = leave.Supervisor_ID;
                    worksheet.Cells[i + 2, 9].Value = leave.Leave_type;
                    worksheet.Cells[i + 2, 10].Value = leave.Status;
                    worksheet.Cells[i + 2, 11].Value = leave.AcceptDateTime.ToString("yyyy-MM-dd HH:mm:ss");
                }

                // Save the Excel file to a memory stream
                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                var fileName = "LeaveRequests.xlsx";
                return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
        }

            [HttpGet]
            [Route("/AssigendSupervisorforTrainees")]
            public async Task<IActionResult> GetAssignedTrainees(string supervisor_id)
            {
                var assignedSupervisors = new List<AssignedSupervisorTrainee>();

                // Query to fetch data
                string query = @"SELECT asup.Trainee_ID, asup.Assigned_Supervisor_ID, t.Image,t.Username 
                                FROM Assigned_Supervisor asup
                                JOIN Users t ON asup.Trainee_ID = t.Trainee_ID
                                WHERE asup.Assigned_Supervisor_ID = @Supervisor_id ";

            // Convert the image to a base64 string if it exists
            string? imageBase64 = null;

            try
                {
                    // Create a connection to the SQL database
                    using (SqlConnection conn = new SqlConnection(_connectionString))
                    {
                        await conn.OpenAsync();  // Open connection asynchronously


                        // Create a SQL command
                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.Parameters.AddWithValue("@Supervisor_id", supervisor_id);
                            // Execute the query and read the results
                            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                                {
                                while (await reader.ReadAsync())
                                {
                                    if (!reader.IsDBNull(2))
                                    {
                                        byte[] imageBytes = (byte[])reader["Image"];
                                        imageBase64 = Convert.ToBase64String(imageBytes);
                                    }
                                // Populate the data model with results
                                assignedSupervisors.Add(new AssignedSupervisorTrainee
                                    {
                                        Trainee_ID = reader["Trainee_ID"] != DBNull.Value ? (int)reader["Trainee_ID"] : 0,
                                        Assigned_Supervisor_ID = reader["Assigned_Supervisor_ID"] != DBNull.Value ? (int)reader["Assigned_Supervisor_ID"] : 0,
                                        Name = reader["Username"].ToString(),
                                        Image = imageBase64
                                        
                                });
                                }
                            }
                        }
                    }

                    return Ok(assignedSupervisors);  // Return the results as JSON
                }
                catch (SqlException ex)
                {
                    return StatusCode(500, $"Database error: {ex.Message}");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Server error: {ex.Message}");
                }
            }
        [HttpGet]
        [Route("/TraineeCountOnSupervisor")]
        public async Task<IActionResult> GetTraineeCountOnSupervisor(int supervisor_id){
            string query = @"SELECT 
                                COUNT(Trainee_ID) AS TraineeCount,
                                DATENAME(MONTH, Assigned_Date) AS MonthName
                                FROM 
                                Assigned_Supervisor
                                WHERE 
                                Assigned_Supervisor_ID = @sup_id
                                GROUP BY 
                                FORMAT(Assigned_Date, 'yyyy-MM'),
	                            DATENAME(MONTH, Assigned_Date)
                                ORDER BY 
                                FORMAT(Assigned_Date, 'yyyy-MM')";

            var data = new List<UserCount>();

            // Create a connection to the SQL database
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@sup_id", supervisor_id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (reader.Read())
                        {
                            data.Add(new UserCount
                            {
                                count = reader.GetInt32(0),
                                month = reader.GetString(1)
                            }
                            );
                        }
                    }

                }

                return Ok(data);
            }
        }

            public  class UserCount
            {
                public int count { get; set; }
                public string? month { get; set; }
            }

        // Data model for AssignedSupervisor
        public class AssignedSupervisorTrainee
        {
            public int Trainee_ID { get; set; }
            public int Assigned_Supervisor_ID { get; set; }
            public string? Name { get; set; }
            public string? Image { get; set; }
            
        }
    
}

}
