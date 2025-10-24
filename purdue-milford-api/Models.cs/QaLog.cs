using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace dg_foods_api.Models
{

    public class QaLogModel
    {
        [Required] public int Id { get; set; }
        [Required] public int checker_cutter_number { get; set; }
        [Required] public int cutter_number { get; set; }
        [Required] public string product { get; set; }
        [Required] public string cut { get; set; }
        [Required] public string station { get; set; }
        [Required] public double weight { get; set; }
        [Required] public int index { get; set; }
        [Required] public int timestamp { get; set; }
        [Required] public string description { get; set; }
        [Required] public double inspectionTime { get; set; }

    }


    public class QaLogResModel : ErrorResModel
    {
        [Required] public List<QaLogModel> checkEvent { get; set; }
    }



}