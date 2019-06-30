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
using EHS.Server.DataAccess.Repository;
using EHS.Server.WebApi.Extensions;

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
            //from the ServiceExtensions class 
            services.ConfigureCors();
            services.ConfigureIISIntegration();
            services.ConfigureApiVersioning(); 

            var connectinString = Configuration["connectionStrings:EHSConnectionString"];
            services.AddDbContext<EhsDbContext>(o => o.UseSqlServer(connectinString));

            //services.AddSingleton<IConfiguration>(Configuration); believe this is called by the framework by default

            //azure ad config 
            //services.AddAuthentication(AzureADDefaults.BearerAuthenticationScheme)
            //    .AddAzureADBearer(options => Configuration.Bind("AzureAd", options));

            // add Repos 
            services.AddTransient<IHierarchyLevelRepository, HierarchyLevelRepository>();
            services.AddTransient<IHierarchyRepository, HierarchyRepository>();

            // Utility for mapping DTO's to Models 
            var config = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new Helpers.MappingHelper());
            });
            var mapper = config.CreateMapper();
            services.AddSingleton(mapper); 

            

            services.AddMvc(o =>
            {
                
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
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
            //app.UseAuthentication(); when using aad
            app.UseMvc();
        }
    }
}
