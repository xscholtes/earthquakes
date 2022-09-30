using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using NetTopologySuite;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO.Converters;


namespace earthquakeapi.Controllers {

[ApiController]
[Route("[controller]")]
public class CountryController : ControllerBase
{

    private readonly ILogger<CountryController> _logger;
    private readonly EarthquakeContext _EarthquakeContext;
    private readonly IOptions<JsonOptions> _jsonOptions;
    private readonly NtsGeometryServices _geometryServices;


    public CountryController(ILogger<CountryController> logger, EarthquakeContext eq, IOptions<JsonOptions> jsonOptions, NtsGeometryServices geometryServices)
    {
        _logger = logger;
        _EarthquakeContext = eq;
        // if you need to use TryGetJsonObjectPropertyValue, then you will
        // want to inject this in order for it to work correctly:
        _jsonOptions = jsonOptions;

        // in Startup.ConfigureServices:
        // services.AddSingleton(NtsGeometryServices.Instance);
        _geometryServices = geometryServices;
    }

    [HttpGet(Name = "GetCountries")]
    public FeatureCollection Get()
    {
        IEnumerable<Country> eqIQ = from eq in _EarthquakeContext.Countries
                                       select eq;
        var geometryFactory = _geometryServices.CreateGeometryFactory();

            var result = new FeatureCollection();
            foreach (Country co in eqIQ)
            {
                result.Add(new Feature
                {
                    Geometry = co.Location,
                    Attributes = new AttributesTable
                    {
                        { GeoJsonConverterFactory.DefaultIdPropertyName, co.CountryId },
                        { "name", co.Name},
                    }
                });
            }

            return result;
    }
}

}