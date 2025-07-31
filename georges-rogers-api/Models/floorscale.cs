using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace weightech_api.Models
{

    public class FloorscaleModel
    {
        public long Id { get; set; }
        public long ServerIndex { get; set; }
        public string ServerGroup { get; set; }
        public long Serial { get; set; }
        public double Net_lb { get; set; }
        public long Timestamp { get; set; }
        public long Gate { get; set; }
    }


    public class FloorscaleDetailRes : ResInfo
    {
        public List<FloorscaleModel> Details { get; set; }
    }



    public class FloorscaleRateRes : ResInfo
    {
        public List<RateModel> Rate { get; set; }
    }



    public class FloorscaleSummaryRes : ResInfo
    {
        public List<HopperSummary> Summary { get; set; }
    }


    //     public class FloorscaleSummary
    // {
    //     public string ServerGroup { get; set; }
    //     public long Gate { get; set; }
    //     public double Total_lb { get; set; }
    //     public long Count { get; set; }
    // }





}
