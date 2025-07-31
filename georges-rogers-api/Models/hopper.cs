using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace weightech_api.Models
{

    public class HopperModel
    {
        public long Id { get; set; }
        //public long ServerIndex { get; set; }
        public string ServerGroup { get; set; }
        public long Serial { get; set; }
        public double Net_lb { get; set; }
        public long Timestamp { get; set; }
        public long Gate { get; set; }
    }

    // public class HopperResInfo
    // {
    //     public string Db_filename { get; set; }
    //     public string Start_timestamp { get; set; }
    //     public string Stop_timestamp { get; set; }
    //     public double Query_time { get; set; }
    //     public long ErrorCode { get; set; }
    //     public string ErrorMessage { get; set; }
    //     public long Rows { get; set; }
    // }

    // public class RateModel
    // {
    //     public long Timestamp { get; set; }
    //     public long Count { get; set; }
    // }

    public class HopperDetailRes : ResInfo
    {
        public List<HopperModel> Details { get; set; }

    }



    public class HopperRateRes : ResInfo
    {
        public List<RateModel> Rate { get; set; }

    }


    public class HopperSummary
    {
        public string ServerGroup { get; set; }
        public long Gate { get; set; }
        public double Net_lb { get; set; }
        public long Count { get; set; }
    }

    public class HopperSummaryRes : ResInfo
    {
        public List<HopperSummary> Summary { get; set; }

    }

    // public class HopperQueryParams
    // {
    //     public long start { get; set; }
    //     public long stop { get; set; }

    // }
}
