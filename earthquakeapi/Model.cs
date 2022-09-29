using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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
            builder.UseNpgsql("Host=64.225.64.166;Database=hearthquakes;Username=geographer",
                o => o.UseNetTopologySuite());
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
        [Column("source")]
        public string? Source { get; set; }
        [Column("wkb_geometry", TypeName = "geometry (point)")]
        public Point? Location { get; set; }
    }

    [Table("countries")]
    public class Country
    {
        //gc_fid, date, "time", latitude, longitude, type, depth, "depth error", "depth seismic stations", magnitude, "magnitude type", "magnitude error", "magnitude seismic stations", "azimuthal gap", "horizontal distance", "horizontal error", "root mean square", id, source, "location source", "magnitude source", status, wkb_geometry
        [Column("ogc_fid")]
        public int CountryId { get; set; }
        [Column("name")]
        public string? Name { get; set; }
        [Column("wkb_geometry", TypeName = "geometry")]
        public Geometry? Location { get; set; }
    }