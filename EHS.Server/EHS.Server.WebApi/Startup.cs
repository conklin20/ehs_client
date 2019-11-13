using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting; 
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Repository;
using EHS.Server.WebApi.Extensions;
using EHS.Server.WebApi.Helpers;
using System.Text;
using EHS.Server.WebApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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
            //services.ConfigureApiVersioning();


            var connectionString = Configuration["connectionStrings:EHSConnectionString"];
            services.AddDbContext<EhsDbContext>(o => o.UseSqlServer(connectionString));

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

            //new with 3.0
            services.AddControllers(o =>
            {
            });

            services.AddMvc(o =>
            {

            });
            //.SetCompatibilityVersion(CompatibilityVersion.Version_2_2); OBSOLETE with 3.0
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env )
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
                //write custom global exception handler here 
            }

            app.UseDefaultFiles();
            app.UseStaticFiles(); //serves files in the wwwroot folder, where our compiled client app should be 

            app.UseRouting();

            app.UseCors("CorsPolicy"); //important to be able to make API Calls from the client
            //app.UseHttpsRedirection();
            app.UseAuthentication(); //must come AFTER UseCors and UseRouting but BEFORE UseEndpoints
            app.UseAuthorization(); 
            
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();

                //endpoints.MapControllerRoute(
                //    "default", "{controller=Index}/{action=Index}"); 
            });
        }
    }
}
