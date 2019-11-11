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
using Microsoft.AspNetCore.Server.IISIntegration; 
using NLog;
using NLog.Web;
using NLog.Extensions.Logging;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Repository;
using EHS.Server.WebApi.Extensions;
using EHS.Server.WebApi.Helpers;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using EHS.Server.WebApi.Services;
using Microsoft.AspNetCore.Http;

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

            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AuthSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AuthSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // configure DI for application services
            services.AddScoped<IUserService, UserService>();
            //services.AddTransient<IUserService, UserService>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // add Repos 
            services.AddTransient<IActionRepository, ActionRepository>();
            services.AddTransient<IApprovalRepository, ApprovalRepository>();
            services.AddTransient<IAttributeRepository, AttributeRepository>();
            services.AddTransient<IHierarchyAttributeRepository, HierarchyAttributeRepository>();
            services.AddTransient<IHierarchyLevelRepository, HierarchyLevelRepository>();
            services.AddTransient<IHierarchyRepository, HierarchyRepository>();
            services.AddTransient<ISafetyEventRepository, SafetyEventRepository>();
            services.AddTransient<ISeverityRepository, SeverityRepository>(); 
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IEmployeeRepository, EmployeeRepository>();
            services.AddTransient<IPeopleInvolvedRepository, PeopleInvolvedRepository>();
            services.AddTransient<ICausesRepository, CauseRepository>();
            services.AddTransient<IEventFileRepository, EventFileRepository>();
            services.AddTransient<IUserRoleRepository, UserRoleRepository>(); 

            // Utility for mapping DTO's to Models 
            var config = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingHelper());
            });
            config.AssertConfigurationIsValid(); 
            var mapper = config.CreateMapper();
            services.AddSingleton(mapper); 

           
            services.AddMvc(o =>
            {
                
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            env.ConfigureNLog("nlog.config");
            GlobalDiagnosticsContext.Set("nLogConnectionString", Configuration.GetConnectionString("EHSConnectionString")); //grab the db connection from the appsettings.json so we dont have to maintain it in the nlog.config file as well

            //nlog middleware 
            loggerFactory.AddNLog();
            //app.UseStatusCodePages(); //helps with debugging

            if (env.IsProduction())
            {
                app.UseHsts();
                //write custom global exception handler here 
                //app.UseExceptionHandler("/Error");
            }
            else if (env.IsEnvironment("Test"))
            {

            }
            else if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
            }
            
            app.UseCors("CorsPolicy"); //important to be able to make API Calls from the client
            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication(); 
            app.UseMvc(routes =>
            {
                    //routes.MapRoute(
                    //    name: "default",
                    //    template: "{controller=Index}/{action=Index}");
            });
        }
    }
}
