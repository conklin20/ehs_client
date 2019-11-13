using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;

namespace EHS.Server.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //CreateWebHostBuilder(args).Build().Run();
            CreateHostBuilder(args).Build().Run();

        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureLogging((context, logging) =>
                {
                    logging.ClearProviders(); // clears the .net core default providers 
                    logging.AddConfiguration(context.Configuration.GetSection("Logging"));
                    if (context.HostingEnvironment.IsDevelopment())
                    {
                        logging.AddConsole();
                    }
                    logging.AddNLog($"nlog.{context.HostingEnvironment.EnvironmentName}.config");
                    //logging.AddNLog($"nlog.Development.config"); //forcing to use Dev config for testing something 
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel(serverOptions =>
                    {
                        // Set properties and call methods on options
                        serverOptions.Limits.MaxRequestBodySize = 10500000; // ~10mb
                    })
                    .UseStartup<Startup>();
                });
    }
}
