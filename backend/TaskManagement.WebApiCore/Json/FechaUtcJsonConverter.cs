using System.Text.Json;
using System.Text.Json.Serialization;

namespace TaskManagement.WebApiCore.Json
{
    // SQL Server devuelve las fechas sin zona horaria (DateTimeKind.Unspecified), pero en la BD se guardan
    // en UTC (GETUTCDATE()). Sin esto, el JSON sale sin "Z" y el navegador las interpreta como hora local.
    public class FechaUtcJsonConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.GetDateTime();
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            var utc = value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();

            writer.WriteStringValue(utc);
        }
    }
}
