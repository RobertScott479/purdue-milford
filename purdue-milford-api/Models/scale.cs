using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using weightech_api.Models;

namespace weightech_api.Models
{

    public class StationsRootModel
    {
        [Required] public List<StationModel> stations { get; set; }
    }

    public class StationModel
    {
        [Required] public string Station { get; set; }

        [Required] public bool Enabled { get; set; }
    }



    public class StationsResModel : ErrorResModel
    {
        [Required] public List<StationModel> stations { get; set; }
    }

    public class QCModel
    {
        [Required] public string station { get; set; }
        [Required] public int duration { get; set; }
        [Required] public int index { get; set; }
        [Required] public decimal weight { get; set; }
        [Required] public long timestamp { get; set; } = 0;
        [Required] public string checkStatus { get; set; }

    }



}