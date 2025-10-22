using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace weightech_api.Models
{

    public class ErrorResModel
    {
        [Required] public string errorCode { get; set; }
        [Required] public string errorMessage { get; set; }
    }


    public class ResInfo
    {
        public string Db_filename { get; set; }
        public string Start_timestamp { get; set; }
        public string Stop_timestamp { get; set; }
        public double Query_time { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public int Rows { get; set; }
    }


    public class RateModel
    {
        public long Timestamp { get; set; }
        public long Count { get; set; }
    }


    public class QueryParams
    {
        public long start { get; set; }
        public long stop { get; set; }

    }




}