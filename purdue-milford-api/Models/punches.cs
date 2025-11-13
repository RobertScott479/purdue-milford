//create a class/table for employee(cutters) time punches
using System;
using System.ComponentModel.DataAnnotations;

namespace dg_foods_api.Models
{
    public class Punches
    {
        public int? Id { get; set; }
        [Required] public int ProductionDate { get; set; }
        [Required] public int Shift { get; set; }
        [Required] public int Cutter_number { get; set; }
        [Required] public string Station { get; set; }
        public int PunchIn { get; set; }
        public int? PunchOut { get; set; }
        [Required] public string updateBy { get; set; }
        [Required] public int updateAt { get; set; }
    }
}