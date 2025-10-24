using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace dg_foods_api.Models
{

    public class ErrorResModel
    {
        [Required] public string errorCode { get; set; } = "0";
        [Required] public string errorMessage { get; set; } = "";
    }
}