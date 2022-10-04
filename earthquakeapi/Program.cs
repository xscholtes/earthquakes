using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using NetTopologySuite.IO.Converters;
using earthquakeapi;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSystemd(); 
// Add services to the container.

builder.Services.AddControllers(options =>
        {
            // Prevent the following exception: 'This method does not support GeometryCollection arguments' 
            // See: https://github.com/npgsql/Npgsql.EntityFrameworkCore.PostgreSQL/issues/585 
            options.ModelMetadataDetailsProviders.Add(new SuppressChildValidationMetadataProvider(typeof(Point)));
            options.ModelMetadataDetailsProviders.Add(new SuppressChildValidationMetadataProvider(typeof(Coordinate)));
            options.ModelMetadataDetailsProviders.Add(new SuppressChildValidationMetadataProvider(typeof(LineString)));
            options.ModelMetadataDetailsProviders.Add(new SuppressChildValidationMetadataProvider(typeof(MultiLineString)));
        }).AddJsonOptions(options =>
        {
            // this constructor is overloaded.  see other overloads for options.
            var geoJsonConverterFactory = new GeoJsonConverterFactory();
            options.JsonSerializerOptions.Converters.Add(geoJsonConverterFactory);
        });


builder.Services.AddSingleton(NtsGeometryServices.Instance);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddDbContext<EarthquakeContext>();
builder.Services.AddCors();
var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}
 app.UseCors(builder =>
    {
        builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
app.UseAuthorization();

app.MapControllers();
app.MapHub<EarthquakeHub>("/earthquakeHub");
app.Run();
