using System;
using System.Collections.Generic;

#nullable disable

namespace dg_foods_api.Models
{
    public partial class Dump
    {
        public string Vector { get; set; }
        public string Station { get; set; }
        public string Cut { get; set; }
        public string Weight { get; set; }
        public string Timestamp { get; set; }
    }
}
