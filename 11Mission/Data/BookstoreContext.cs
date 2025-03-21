// Data/BookstoreContext.cs
using _11Mission.Models;
using Microsoft.EntityFrameworkCore;

namespace _11Mission.Data
{
    public class BookstoreContext(DbContextOptions<BookstoreContext> options) : DbContext(options)
    {
        public DbSet<Book> Books { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>().ToTable("Books");
        }
    }
}