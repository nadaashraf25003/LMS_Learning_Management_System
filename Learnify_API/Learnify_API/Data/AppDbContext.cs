using Learnify_API.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Learnify_API.Data
{

    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        ///
        public new DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        //public DbSet<LessonProgress> LessonProgresses { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        //public DbSet<QuizResult> QuizResults { get; set; }
        //public DbSet<StudentAnswer> StudentAnswers { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        //public DbSet<FinalProject> FinalProjects { get; set; }
        //public DbSet<LiveSession> LiveSessions { get; set; }
        //public DbSet<Payment> Payments { get; set; }
        public DbSet<InstructorPayout> InstructorPayouts { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<FeedBack> feedBacks { get; set; }
        public DbSet<Profile> profiles { get; set; }

        public DbSet<LessonProgress> LessonProgresses { get; set; }
        public DbSet<SavedCourse> SavedCourses { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Checkout> Checkouts { get; set; }
        public DbSet<StudentAnswer> StudentAnswers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PayoutRequest> PayoutRequests { get; set; }
        public DbSet<PaymentSetting> PaymentSettings { get; set; }
        public DbSet<TaxDocument> TaxDocuments { get; set; }

        //public object Notifications { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<Course>()
            //    .Property(c => c.Price)
            //    .HasPrecision(18, 2);

            //modelBuilder.Entity<Enrollment>()
            //    .Property(e => e.Progress)
            //    .HasPrecision(5, 2);

            //modelBuilder.Entity<Payment>()
            //    .Property(p => p.Amount)
            //    .HasPrecision(18, 2);

            //modelBuilder.Entity<Payment>()
            //    .Property(p => p.PlatformFee)
            //    .HasPrecision(18, 2);

            //modelBuilder.Entity<Payment>()
            //    .Property(p => p.NetAmount)
            //    .HasPrecision(18, 2);

            modelBuilder.Entity<Student>()
                .Property(s => s.GPA)
                .HasPrecision(4, 2);

            modelBuilder.Entity<InstructorPayout>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            // ✅ FIX: prevent multiple cascade paths between Student, Course, Enrollment
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Restrict);  // important change

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict);  // optional but safer

            // Fix cascade delete issue between Student, Course, and Certificate
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Student)
                .WithMany()
                .HasForeignKey(c => c.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Course)
                .WithMany()
                .HasForeignKey(c => c.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Profile>().OwnsOne(p => p.User);
            modelBuilder.Entity<Profile>().OwnsOne(p => p.SocialLinks);

            base.OnModelCreating(modelBuilder);


            //base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(); // ensure unique emails (required for principal key)

            modelBuilder.Entity<Notification>()
               .HasOne(n => n.Receiver)
               .WithMany()
               .HasForeignKey(n => n.ReceiverEmail)
               .HasPrincipalKey(u => u.Email)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Sender)
                .WithMany()
                .HasForeignKey(n => n.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SavedCourse>()
              .HasOne(sc => sc.Student)
              .WithMany(s => s.SavedCourses)
              .HasForeignKey(sc => sc.StudentId)
              .OnDelete(DeleteBehavior.Restrict); // <-- Important

            modelBuilder.Entity<SavedCourse>()
                .HasOne(sc => sc.Course)
                .WithMany(c => c.SavedCourses)
                .HasForeignKey(sc => sc.CourseId)
                .OnDelete(DeleteBehavior.Restrict); // <-- Optional


            modelBuilder.Entity<CartItem>()
              .HasOne(c => c.Student)
              .WithMany()
              .HasForeignKey(c => c.StudentId)
              .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.Course)
                .WithMany()
                .HasForeignKey(c => c.CourseId)
                .OnDelete(DeleteBehavior.NoAction);

            // Checkout → CheckoutItems cascade
            modelBuilder.Entity<CheckoutItem>()
                .HasOne(ci => ci.Checkout)
                .WithMany(c => c.CheckoutItems)
                .HasForeignKey(ci => ci.CheckoutId)
                .OnDelete(DeleteBehavior.Cascade); // ✅ Cascade delete from Checkout

            // Course → CheckoutItems restrict delete
            modelBuilder.Entity<CheckoutItem>()
                .HasOne(ci => ci.Course)
                .WithMany()
                .HasForeignKey(ci => ci.CourseId)
                .OnDelete(DeleteBehavior.Restrict); // ❌ Prevent cascade from Course

            modelBuilder.Entity<StudentAnswer>()
                .HasOne(sa => sa.Student)
                .WithMany()
                .HasForeignKey(sa => sa.StudentId)
                .OnDelete(DeleteBehavior.Restrict); // <-- NO CASCADE

            modelBuilder.Entity<StudentAnswer>()
                .HasOne(sa => sa.Quiz)
                .WithMany()
                .HasForeignKey(sa => sa.QuizId)
                .OnDelete(DeleteBehavior.Cascade); // optional, only if Quiz deletion should remove answers

        }

    }
}
