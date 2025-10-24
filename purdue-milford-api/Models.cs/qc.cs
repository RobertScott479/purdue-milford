using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace dg_foods_api.Models
{

    public class CheckersResModel : ErrorResModel
    {
        [Required] public List<CheckerModel> checkers { get; set; }

    }

    public class CheckersModel
    {
        [Required] public List<CheckerModel> checkers { get; set; }
    }

    public class CheckerModel
    {
        [Required] public int Id { get; set; }
        // [Required] public string checkerName { get; set; }
        [Required] public int checker_cutter_number { get; set; }
    }


    public class CheckEventModel
    {
        [Required] public int cutter_number { get; set; } = 0;
        [Required] public double weight { get; set; } = 0;
        [Required] public string station { get; set; } = "";
        [Required] public int timestamp { get; set; } = 0;
        [Required] public int bank { get; set; } = 0;
        [Required] public int index { get; set; } = 0;
        [Required] public string cut { get; set; } = "";
    }



    public class CheckEventOutputModel
    {
        [Required] public int checker_cutter_number { get; set; }
        [Required] public string product { get; set; }
        [Required] public CheckEventModel checkEvent { get; set; }
        [Required] public int[] defects { get; set; }
        [Required] public double inspectionTime { get; set; }
        [Required] public int passed { get; set; }
        [Required] public int failed { get; set; }
        [Required] public int canceled { get; set; }
        [Required] public PieceWightModel[] pieces { get; set; }
        [Required] public string finishedPO { get; set; }
    }


    public class CheckEventResModel : ErrorResModel
    {
        [Required] public CheckEventModel checkEvent { get; set; }
    }

    public class PieceWightModel
    {
        [Required] public int weight { get; set; }
        [Required] public int timestamp { get; set; } = 0;
    }




}