using System;
using System.Collections.Generic;

#nullable disable

namespace dg_foods_api.Models
{
    public partial class Employee
    {
        public int Cutter_number { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string Shift { get; set; }
        public string Enabled { get; set; }
        public string EmployeeCategory { get; set; }
        public string HireDate { get; set; }
    }
}
