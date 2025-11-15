using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace dg_foods_api.Models
{

    public class StationsRootModel
    {
        [Required] public List<StationTableModel> stations { get; set; }
    }


    // public class StationModel : StationTableModel
    // {
    //     public string Name { get; set; } = "";
    // }

    public class StationTableModel
    {

        //[Required] public int Id { get; set; }
        [Required] public string Station { get; set; }

        [Required] public bool Enabled { get; set; }
        //public int Cutter_number { get; set; } = 0;
        //public int AlternateCutterNumber { get; set; } = 0;
        // [Required] public string EmployeeName { get; set; }
        //[Required] public int Shift { get; set; } = 1;
    }



    public class StationsResModel : ErrorResModel
    {
        [Required] public List<StationTableModel> stations { get; set; }
    }




    public class BreakAdjustmentRootModel
    {
        [Required] public List<BreakAdjustmentModel> breakAdjustments { get; set; }
    }

    public class BreakAdjustmentModel
    {

        // [Required] public int Id { get; set; }
        [Required] public int bank { get; set; }
        [Required] public int adjustment { get; set; }
    }



    public class BreakAdjustmentsResModel : ErrorResModel
    {
        [Required] public List<BreakAdjustmentModel> Banks { get; set; }
    }

    public class CodeChangeModel
    {
        [Required] public string product { get; set; } = "";
        [Required] public string po { get; set; } = "";
        [Required] public string department { get; set; } = "";
    }

}