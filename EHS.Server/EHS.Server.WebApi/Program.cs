using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace EHS.Server.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();

            //var host = new WebHostBuilder()
            //    .UseContentRoot(Directory.GetCurrentDirectory())
            //    .UseKestrel()
            //    .UseIISIntegration()
            //    .UseStartup<Startup>()
            //    .ConfigureKestrel((context, options) =>
            //    {
            //            // Set properties and call methods on options
            //        })
            //    .Build();

            //host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .ConfigureKestrel((context, options) =>
                {
                    // Set properties and call methods on options
                    options.Limits.MaxRequestBodySize = 10500000; // ~10mb 
                });
    }
}
