using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace weightech_api.Models
{

    public partial class SizerTray
    {
        public long Serial { get; set; }

        //[JsonPropertyName("weight_g")]
        public long Net_g { get; set; }
        public long Timestamp { get; set; }
        public long Gate { get; set; }
        public long Scale { get; set; }
        //        public string ServerGroup { get; set; } //added for grouping
    }

    public class SizerSummary
    {
        public long Gate { get; set; }
        public long net_g { get; set; }
        public double net_lb { get; set; }
        public long Count { get; set; }
        public long High_g { get; set; }
        public long Low_g { get; set; }
    }



    public class SizerDetailRes : ResInfo
    {
        public List<SizerTray> Details { get; set; }

    }

    public class SizerRate
    {
        public long Timestamp { get; set; }
        public int Count { get; set; }
    }

    public class SizerRateRes : ResInfo
    {
        public List<SizerRate> Rate { get; set; }

    }



    public class SizerSummaryRes : ResInfo
    {
        public List<SizerSummary> Summary { get; set; }

    }

    public class SizerTimeFrame
    {
        public long start { get; set; }
        public long stop { get; set; }

    }
}
