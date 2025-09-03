using backend.Encryption;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<backend.Models.Note> Notes { get; set; }
        public DbSet<backend.Models.User> Users { get; set; } = default!;

        //INITIAL USER FOR TESTING PURPOSES
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = Guid.Parse("de13e07f-351d-48d1-9dd2-fe91f8273456"),
                    Username = "admin",
                    Email = "admintest@gmail.com",
                    Password = EncryptPassword.EncryptPww("123456")
                }
            );
        }

    }
}