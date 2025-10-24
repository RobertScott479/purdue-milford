using Microsoft.AspNetCore.Mvc;

using dg_foods_api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api_philly.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ScoreboardController : ControllerBase
    {
        // private readonly DatabaseContext db;
        private readonly string key = "scoreboard";

        public ScoreboardController()
        {

        }

        [HttpGet("loadscoreboard")]
        public ActionResult<ScoreboardResModel> loadScoreboard()
        {
            var res = new ScoreboardResModel();

            res.scoreboard = new ScoreboardModel();
            //res.message = "";
            res.errorCode = "0";
            res.errorMessage = "";

            try
            {
                string json = HttpContext.Session.GetString(key);
                if (string.IsNullOrEmpty(json))
                {
                    res.scoreboard.message = "Weightech Scoreboard Message!";
                }
                else
                {
                    res.scoreboard = JsonConvert.DeserializeObject<ScoreboardModel>(json); ;
                }

            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }

            return Ok(res);
        }

        [HttpPost("savescoreboard")]
        public ActionResult<ErrorResModel> saveScoreboard([FromBody] ScoreboardReqModel req)
        {

            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "", };

            try
            {
                // string json = null;
                // if (string.IsNullOrEmpty(req.scoreboard.message))
                // {
                var json = JsonConvert.SerializeObject(req.scoreboard);
                // }

                HttpContext.Session.SetString(key, json);

            }
            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }
            return Ok(res);
        }

    }
}