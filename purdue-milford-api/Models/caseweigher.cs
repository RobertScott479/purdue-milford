using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace weightech_api.Models
{
    public partial class CaseweigherTableModel
    {
        public long Id { get; set; }
        public double Net_lb { get; set; }

        //[JsonPropertyName("high_limit")]
        public double High_limit { get; set; }

        //[JsonPropertyName("low_limit")]
        public double Low_limit { get; set; }
        public long Timestamp { get; set; }
        public long Serial { get; set; }
        public long Status { get; set; }
    }


    public class CaseweigherResInfo
    {
        public string Db_filename { get; set; }
        public string Start_timestamp { get; set; }
        public string Stop_timestamp { get; set; }
        public double Query_time { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public int Rows { get; set; }
    }



    public class CaseweigherDetailsRes : CaseweigherResInfo
    {
        public List<CaseweigherTableModel> details { get; set; }
    }


    public class CaseweigherRate
    {
        public long Timestamp { get; set; }
        public int Count { get; set; }
    }

    public class CaseweigherRateRes : CaseweigherResInfo
    {
        public List<CaseweigherRate> Rate { get; set; }
    }


    public class CaseweigherSummary
    {
        public double Net_lb { get; set; }
        public int Count { get; set; }
        public int Over { get; set; }
        public int Under { get; set; }
        public int TooClose { get; set; }
        public int Error { get; set; }
        public int Unknown { get; set; }
        public double Mean { get; set; }
    }

    public class CaseweigherSummaryRes : CaseweigherResInfo
    {
        public List<CaseweigherSummary> Summary { get; set; }
    }
}

