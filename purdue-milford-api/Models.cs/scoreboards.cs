using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace dg_foods_api.Models
{

    public class ScoreboardModel
    {
        [Required] public string message { get; set; }
    }

    public class ScoreboardResModel : ErrorResModel
    {
        [Required] public ScoreboardModel scoreboard { get; set; }
    }
    public class ScoreboardReqModel
    {
        [Required] public ScoreboardModel scoreboard { get; set; }
    }
}