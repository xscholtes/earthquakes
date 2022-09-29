using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using NetTopologySuite;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO.Converters;


namespace earthquakeapi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class EarthquakeController : ControllerBase
    {

        private readonly ILogger<EarthquakeController> _logger;
        private readonly EarthquakeContext _EarthquakeContext;
        private readonly IOptions<JsonOptions> _jsonOptions;
        private readonly NtsGeometryServices _geometryServices;


        public EarthquakeController(ILogger<EarthquakeController> logger, EarthquakeContext eq, IOptions<JsonOptions> jsonOptions, NtsGeometryServices geometryServices)
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

        [HttpGet(Name = "GetEarthquakes")]
        public FeatureCollection Get()
        {
            IEnumerable<Earthquake> eqIQ = from eq in _EarthquakeContext.Earthquakes
                                           select eq;
            var geometryFactory = _geometryServices.CreateGeometryFactory();

            var result = new FeatureCollection();
            foreach (Earthquake eqk in eqIQ)
            {
                result.Add(new Feature
                {
                    Geometry = eqk.Location,
                    Attributes = new AttributesTable
                    {
                        { GeoJsonConverterFactory.DefaultIdPropertyName, eqk.EarthquakeId },
                        { "source", eqk.Source},
                    }
                });
            }

            return result;
        }
    }

}