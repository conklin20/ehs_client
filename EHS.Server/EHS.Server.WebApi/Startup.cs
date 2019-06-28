using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NLog;
using NLog.Web;
using NLog.Extensions.Logging;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.WebApi
{
    public class Startup
    {
        public static IConfiguration Configuration { get; private set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(); 

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            var connectinString = Configuration["connectionStrings:EHSConnectionString"];
            services.AddDbContext<EhsDbContext>(o => o.UseSqlServer(connectinString));

            //services.AddSingleton<IConfiguration>(Configuration); believe this is called by the framework by default


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            env.ConfigureNLog("nlog.config");
            GlobalDiagnosticsContext.Set("nLogConnectionString", Configuration.GetConnectionString("EHSConnectionString")); //grab the db connection from the appsettings.json so we dont have to maintain it in the nlog.config file as well

            //nlog middleware 
            loggerFactory.AddNLog();
            //app.UseStatusCodePages(); //helps with debugging


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
                //write custom global exception handler here 
            }

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
