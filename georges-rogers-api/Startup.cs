using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using weightech_api.Models;

namespace weightech_api
{
    public class Startup
    {
        const string API_TITLE = "georges-rogers-api";
        const string API_VERSION = "v5";
        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        public IConfiguration Configuration { get; }
        public IHostEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<afnlContext>(options =>
            {
                //var connectionString = Configuration.GetConnectionString("DefaultConnection");
                options.UseSqlite(Configuration.GetConnectionString("defaultConnection"), sqlite => { sqlite.CommandTimeout(30); });
                if (Env.IsDevelopment())
                {
                    options.EnableDetailedErrors(true);
                    options.EnableSensitiveDataLogging(true);
                }
            });


            services.AddControllers();

            // Register the Swagger services
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(API_VERSION, new OpenApiInfo
                {
                    Version = API_VERSION,
                    Title = API_TITLE,
                    Description = "Demo API for Georges Rogers ",
                    // TermsOfService = new Uri("https://example.com/terms"),
                    // Contact = new OpenApiContact
                    // {
                    //     Name = "Shayne Boyer",
                    //     Email = string.Empty,
                    //     Url = new Uri("https://twitter.com/spboyer"),
                    // },
                    // License = new OpenApiLicense
                    // {
                    //     Name = "Use under LICX",
                    //     Url = new Uri("https://example.com/license"),
                    // }
                });
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            //app.UseSwagger();
            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            // app.UseSwaggerUI();
            app.UseSwaggerUI(c =>
            {
                // c.RoutePrefix
                c.SwaggerEndpoint(API_VERSION + "/swagger.json", API_TITLE + " " + API_VERSION);
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }
    }
}
