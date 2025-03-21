using _11Mission.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models; 
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // React app URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Added this line to allow credentials
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "11Mission Bookstore API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Commenting out HTTPS redirection temporarily for testing
// app.UseHttpsRedirection();

// Apply CORS before routing
app.UseCors("AllowReactApp");

// Debug middleware to log requests
app.Use(async (context, next) =>
{
    Console.WriteLine($"Received request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
    Console.WriteLine($"Responded with status code: {context.Response.StatusCode}");
});

// Define API endpoints
app.MapGet("/api/books", async ([FromServices] BookstoreContext context, int pageNumber = 1, int pageSize = 5, string sortBy = "Title", string sortDirection = "asc") =>
{
    Console.WriteLine($"Getting books: Page {pageNumber}, Size {pageSize}, Sort {sortBy} {sortDirection}");
    try
    {
        var totalItems = await context.Books.CountAsync();
        Console.WriteLine($"Total books in database: {totalItems}");

        var books = sortDirection.ToLower() == "asc" ?
            await context.Books
                .OrderBy(b => sortBy == "Title" ? b.Title :
                        sortBy == "Author" ? b.Author :
                        sortBy == "Publisher" ? b.Publisher :
                        b.Title)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync() :
            await context.Books
                .OrderByDescending(b => sortBy == "Title" ? b.Title :
                        sortBy == "Author" ? b.Author :
                        sortBy == "Publisher" ? b.Publisher :
                        b.Title)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

        Console.WriteLine($"Returning {books.Count} books");
        return Results.Ok(new
        {
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Books = books
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error getting books: {ex.Message}");
        return Results.Problem($"Error retrieving books: {ex.Message}");
    }
})
.WithName("GetBooks")
.WithOpenApi();

// Add a simple test endpoint
app.MapGet("/api/test", () => 
{
    Console.WriteLine("Test endpoint called");
    return Results.Ok(new { message = "API is working!" });
})
.WithName("TestEndpoint")
.WithOpenApi();

Console.WriteLine("Starting the API server...");
app.Run();
Console.WriteLine("API server stopped.");