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
                result.Add(eqk.ToFeature());
            }

            return result;
        }

        [HttpPost]
        public Feature Post(IFeature eqFeature)


        {

            if (!(eqFeature.Geometry is Point point))
            {
                throw new ArgumentException("missing 'geometry' on a feature, or it isn't a Point");
            }


            if (eqFeature.Attributes is null)
            {
                throw new ArgumentException("missing 'properties' on a feature");
            }

            var sentId = eqFeature.GetOptionalId("id");
            Earthquake? eqk = null;
            if (sentId == null)
            {
                eqk = new Earthquake();
            }
            else
            {
                int eqId = Decimal.ToInt32((Decimal)eqFeature.GetOptionalId("id"));
                eqk = _EarthquakeContext.Earthquakes?.SingleOrDefault(e => e.EarthquakeId == eqId);
            }
            eqk!.Location = (Point)eqFeature.Geometry;
            if (!eqFeature.Attributes.TryGetJsonObjectPropertyValue("earthquake", _jsonOptions.Value.JsonSerializerOptions, out Earthquake eqkEdited))
            {
                throw new ArgumentException("'earthquake' property is not a Earthquake");
            }


            if (eqFeature != null && eqk != null)
            {
                eqk.FromParsed(eqkEdited);
                if (_EarthquakeContext.Entry(eqk).State == Microsoft.EntityFrameworkCore.EntityState.Detached)
                {
                    _EarthquakeContext.Attach(eqk);
                }
                _EarthquakeContext.SaveChanges();
            }
            return eqk!.ToFeature();
        }

        [HttpDelete]
        public void Delete(IFeature eqFeature)
        {
            var sentId = eqFeature.GetOptionalId("id");
            if (sentId == null)
            {
                throw new ArgumentException("'earthquake' not invalid id");
            }
            else
            {
                int eqId = Decimal.ToInt32((Decimal)eqFeature.GetOptionalId("id"));
                Earthquake eqk = _EarthquakeContext.Earthquakes?.SingleOrDefault(e => e.EarthquakeId == eqId);
                if (eqFeature != null && eqk != null)
                {
                    _EarthquakeContext.Earthquakes?.Remove(eqk);
                    _EarthquakeContext.SaveChanges();
                }
            }
        }
    }

}