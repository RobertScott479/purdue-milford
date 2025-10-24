using System;
using System.Collections.Generic;

#nullable disable

namespace dg_foods_api.Models
{
    public partial class QcResult
    {
        public string CheckerName { get; set; }
        public string Product { get; set; }
        public long? Bank { get; set; }
        public string Cut { get; set; }
        public long? Cycle { get; set; }
        public string Station { get; set; }
        public long? Timestamp { get; set; }
        public double? Weight { get; set; }
        public double? Defect0 { get; set; }
        public double? Defect1 { get; set; }
        public double? Defect2 { get; set; }
        public double? Defect3 { get; set; }
        public double? Defect4 { get; set; }
        public double? Defect5 { get; set; }
        public double? Defect6 { get; set; }
        public double? Defect7 { get; set; }
        public double? Defect8 { get; set; }
        public double? Defect9 { get; set; }
        public double? Defect10 { get; set; }
        public long? Passed { get; set; }
        public long? Failed { get; set; }
        public long? Canceled { get; set; }
    }
}
