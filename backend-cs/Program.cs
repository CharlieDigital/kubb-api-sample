using Microsoft.AspNetCore.Mvc;
using Vernou.Swashbuckle.HttpResultsAdapter;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen(options => options.OperationFilter<HttpResultsOperationFilter>());

var app = builder.Build();

app.MapGet(
        "/posts",
        ([FromQuery] int page, [FromQuery] int pageSize) =>
        {
            var posts = Enumerable
                .Range(1, 100)
                .Select(index => new Post(
                    Id: Guid.NewGuid().ToString(),
                    Title: $"Post {index}",
                    Content: $"Content for post {index}"
                ));

            return new PostsResponse(
                posts.Skip((page - 1) * pageSize).Take(pageSize),
                posts.Count() == pageSize ? page + 1 : null
            );
        }
    )
    .WithDescription("Gets a list of posts with Seth");

app.Run();

record Post(string Id, string Title, string Content);

record PostsResponse(IEnumerable<Post> Data, int? NextPage);
