using _11Mission.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models; 
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowReactApp", policy =>
//     {
//         policy.WithOrigins("http://localhost:3000")  // React app URL
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .WithExposedHeaders("Content-Disposition")  // Add this line
//             .SetIsOriginAllowed(_ => true)             // Add this line
//             .AllowCredentials();
//     });
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // React app URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("Content-Disposition")
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials();
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

// Add this line before UseCors
app.UseRouting();

// Apply CORS before other middleware
app.UseCors("AllowReactApp");

// Debug middleware to log requests
app.Use(async (context, next) =>
{
    Console.WriteLine($"Received request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
    Console.WriteLine($"Responded with status code: {context.Response.StatusCode}");
});

// Define API endpoints
app.MapGet("/api/books", async ([FromServices] BookstoreContext context, 
    int pageNumber = 1, 
    int pageSize = 5, 
    string sortBy = "Title", 
    string sortDirection = "asc",
    string category = "all") =>
{
    Console.WriteLine($"Getting books: Page {pageNumber}, Size {pageSize}, Sort {sortBy} {sortDirection}, Category {category}");
    try
    {
        var query = context.Books.AsQueryable();
        
        // Apply category filter if not "all"
        if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
        {
            query = query.Where(b => b.Category == category);
        }
        
        var totalItems = await query.CountAsync();
        Console.WriteLine($"Total filtered books: {totalItems}");

        // Apply sorting
        query = sortDirection.ToLower() == "asc" ?
            query.OrderBy(b => sortBy == "Title" ? b.Title :
                    sortBy == "Author" ? b.Author :
                    sortBy == "Publisher" ? b.Publisher :
                    b.Title) :
            query.OrderByDescending(b => sortBy == "Title" ? b.Title :
                    sortBy == "Author" ? b.Author :
                    sortBy == "Publisher" ? b.Publisher :
                    b.Title);
        
        // Apply pagination
        var books = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        Console.WriteLine($"Returning {books.Count} books");
        return Results.Ok(new
        {
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Category = category,
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

// New endpoint to get all categories
app.MapGet("/api/categories", async ([FromServices] BookstoreContext context) =>
{
    try
    {
        var categories = await context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
            
        return Results.Ok(categories);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error getting categories: {ex.Message}");
        return Results.Problem($"Error retrieving categories: {ex.Message}");
    }
})
.WithName("GetCategories")
.WithOpenApi();

// Endpoint for cart management
app.MapPost("/api/cart", async ([FromServices] BookstoreContext context, [FromBody] CartItem item) =>
{
    try
    {
        var book = await context.Books.FindAsync(item.BookId);
        if (book == null)
        {
            return Results.NotFound($"Book with ID {item.BookId} not found");
        }

        var cartItem = new CartItemResponse
        {
            BookId = book.BookID,
            Title = book.Title,
            Author = book.Author,
            Price = book.Price,
            Quantity = item.Quantity
        };

        return Results.Ok(cartItem);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error adding to cart: {ex.Message}");
        return Results.Problem($"Error adding to cart: {ex.Message}");
    }
})
.WithName("AddToCart")
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

// Class definitions must come after all top-level statements
class CartItem
{
    public int BookId { get; set; }
    public int Quantity { get; set; }
}

class CartItemResponse
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => Price * Quantity;
}