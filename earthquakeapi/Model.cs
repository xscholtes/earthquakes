using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite;
using NetTopologySuite.Features;
using NetTopologySuite.IO.Converters;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http.Json;

namespace earthquakeapi;
public class EarthquakeContext : DbContext
{
    public DbSet<Earthquake>? Earthquakes { get; set; }
    public DbSet<Country>? Countries { get; set; }

    public EarthquakeContext()
    {

    }
    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        builder.UseNpgsql("Host=127.0.0.1;Database=earthquake;Username=geographer",o => o.UseNetTopologySuite());
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasPostgresExtension("postgis");
    }
}

[Table("earthquakes")]
public class Earthquake
{
    //gc_fid, date, "time", latitude, longitude, type, depth, "depth error", "depth seismic stations", magnitude, "magnitude type", "magnitude error", "magnitude seismic stations", "azimuthal gap", "horizontal distance", "horizontal error", "root mean square", id, source, "location source", "magnitude source", status, wkb_geometry
    [Column("ogc_fid")]
    public int EarthquakeId { get; set; }

    [Column("date")]
    public string? Date { get; set; }

    [Column("time")]
    public string? Time { get; set; }

    [Column("latitude")]
    public double? Latitude { get; set; }

    [Column("longitude")]
    public double? Longitude { get; set; }

    [Column("depth")]
    public double? Depth { get; set; }

    [Column("magnitude")]
    public double? Magnitude { get; set; }

    [Column("magnitude type")]
    public string? MagnitudeType { get; set; }

    [Column("source")]
    public string? Source { get; set; }

    [Column("status")]
    public string? Status { get; set; }

    [Column("wkb_geometry", TypeName = "geometry (point)")]
    public Point? Location { get; set; }


    public Feature ToFeature()
    {
        return new Feature
        {
            Geometry = this.Location,
            Attributes = new AttributesTable
                    {
                        { GeoJsonConverterFactory.DefaultIdPropertyName, this.EarthquakeId },
                        { "earthquake", new AttributesTable{
                            { "source", this.Source},
                            { "date", this.Date},
                            { "time", this.Time },
                            { "latitude", this.Latitude },
                            { "longitude", this.Longitude},
                            { "depth", this.Depth },
                            { "magnitude", this.Magnitude },
                            { "magnitude_type", this.MagnitudeType },
                            { "status", this.Status },
                        }}
                    }
        };
    }

    public void FromParsed(Earthquake eqk)
    {
        this.Source = eqk.Source;
        this.Date = eqk.Date;
        this.Time = eqk.Time;
        this.Latitude = eqk.Latitude;
        this.Longitude = eqk.Longitude;
        this.Depth = eqk.Depth;
        this.Magnitude = eqk.Magnitude;
        this.MagnitudeType = eqk.MagnitudeType;
        this.Status = eqk.Status;
        this.Location = eqk.Location;
    }

}

[Table("countries")]
public class Country
{
    [Column("ogc_fid")]
    public int CountryId { get; set; }
    [Column("name")]
    public string? Name { get; set; }
    [Column("wkb_geometry", TypeName = "geometry")]
    public Geometry? Location { get; set; }
}
