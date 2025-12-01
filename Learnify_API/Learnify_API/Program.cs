using Learnify_API.Data;
using Learnify_API.Data.Models;
using Learnify_API.Data.Services;
using Learnify_API.Services;

//using Learnify_API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace Learnify_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers()
                .AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                //opts.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
                //opts.JsonSerializerOptions.MaxDepth = 64; // optional, default is 32
            });
            //builder.Services.AddDbContext<AppDbContext>(option =>
            //    option.UseSqlServer(builder.Configuration.GetConnectionString("conString")));


            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("conString"),
                    sql => sql.EnableRetryOnFailure())
            );


            //builder.Services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<AppDbContext>();
            builder.Services.AddTransient<FeedbackService>();
            //  Add CORS Policy
            builder.Services.AddCors(options =>
             {
                 options.AddPolicy("AllowAll",
                     policy =>
                     {
                         policy
                             .AllowAnyOrigin()
                             .AllowAnyHeader()
                             .AllowAnyMethod();
                     });
             });

            // Add services for Swagger
            builder.Services.AddScoped<StudentService>();
            //builder.Services.AddScoped<InstructorService>();
            builder.Services.AddScoped<AdminService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<ProfileService>();
            builder.Services.AddScoped<CourseService>();
            builder.Services.AddScoped<LessonService>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            builder.Services.AddScoped<DashboardService>();
            builder.Services.AddScoped<QuizService>();
            builder.Services.AddScoped<QuestionService>();
            builder.Services.AddScoped<UserSettingsService>();
            // Register EmailService
            builder.Services.AddScoped<EmailService>();
            builder.Services.AddSingleton<IEmailSender, EmailSender>();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<CheckoutService>();
            builder.Services.AddScoped<StudentService>();
            builder.Services.AddScoped<AdminService>();
            builder.Services.AddScoped<InstructorService>();
            builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // --------------------------------- Identity --------------------------------------------
            builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequiredLength = 8;
                options.SignIn.RequireConfirmedAccount = true;
            }
           )
              .AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();
            // --------------------------------- Identity --------------------------------------------



            // --------------------------------- JWT Configuration --------------------------------------------

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
              .AddJwtBearer(options =>
              {
                  options.RequireHttpsMetadata = false;
                  options.SaveToken = true;

                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuer = true,
                      ValidateAudience = true,
                      ValidateLifetime = true,
                      ValidateIssuerSigningKey = true,
                      ClockSkew = TimeSpan.Zero, // prevent login delay issues

                      ValidIssuer = builder.Configuration["Jwt:Issuer"],
                      ValidAudience = builder.Configuration["Jwt:Audience"],
                      IssuerSigningKey = new SymmetricSecurityKey(
                          Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("Jwt:SecretKey")!))
                  };
              });

            builder.Services.AddAuthorization();
            builder.Services.AddScoped<EmailService>();

            // --------------------------------- JWT Configuration --------------------------------------------


            // --------------------------------- Swagger Security Setup --------------------------------------------

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme.",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[]{}
                    }
                      });
            });



            // --------------------------------- Swagger Security Setup --------------------------------------------

            // -------------------------------- CORS Configuration AllowFrontend --------------------------------------------
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:5173",         // local dev
                        "https://learnify-lms-depi.vercel.app/",  // example frontend domain
                        "https://learnify.vercel.app"         // or Vercel domain if used
                        ) // React app URL
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials(); // Important for sending cookies
                });
            });
            //app.UseCors("AllowFrontend");
            var app = builder.Build();
            app.UseCors("AllowAll");
            // -------------------------------- CORS Configuration AllowFrontend --------------------------------------------



            // Configure the HTTP request pipeline.

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learnify API V1");
                // Optionally expose swagger at root:
                // c.RoutePrefix = string.Empty;
            });
            //}

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            // Use CORS before authorization
            //app.UseCors("AllowReactApp");


            app.UseCors("AllowFrontend"); //  Must come before authentication

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            AppDbInitializer.SeedUsersAndRolesAsync(app).Wait();
            app.Run();
        }
    }
}
