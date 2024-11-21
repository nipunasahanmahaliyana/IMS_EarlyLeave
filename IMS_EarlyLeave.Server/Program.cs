using OfficeOpenXml;

namespace IMS_EarlyLeave.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Set the LicenseContext to NonCommercial
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
         

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            // Configure CORS if needed
            app.UseCors(policy =>
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader());


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
