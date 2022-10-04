using System.Data;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace earthquakeapi;
public static class DBHelper
{
    public static List<T> RawSqlQuery<T>(string query, Func<DbDataReader, T> map)
    {
        using (var context = new EarthquakeContext())
        {
            using (var command = context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                command.CommandType = CommandType.Text;

                context.Database.OpenConnection();

                using (var result = command.ExecuteReader())
                {
                    var entities = new List<T>();

                    while (result.Read())
                    {
                        entities.Add(map(result));
                    }

                    return entities;
                }
            }
        }
    }

    public static void UpdateGeometry(int id)
    {
        using (var context = new EarthquakeContext())
        {
            using (var command = context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @$"UPDATE public.earthquakes SET wkb_geometry = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) WHERE ogc_fid = {id}";
                command.CommandType = CommandType.Text;
                context.Database.OpenConnection();
                command.ExecuteNonQuery();
            }
        }
    }

}