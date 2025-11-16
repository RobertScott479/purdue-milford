using Microsoft.AspNetCore.Mvc;

using dg_foods_api.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace weightech.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ScaleController : ControllerBase
    {
        private readonly DatabaseContext db;
        // private readonly string filePath;
        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public ScaleController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            // filePath = configuration["filepath"];
            db = _db;
        }



        [HttpGet("loadstations")]
        public ActionResult<StationsResModel> loadStations()
        {

            var res = new StationsResModel();
            res.errorCode = "0";
            res.errorMessage = "";
            try
            {
                var q = db.Stations.Select(u =>
                    new StationTableModel
                    {
                        Station = u.Station,
                        Enabled = Convert.ToBoolean(u.Enabled),
                    }
                ).ToList();

                res.stations = q;
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }

            return Ok(res);
        }

        [HttpPost("savestations")]
        public ActionResult<ErrorResModel> saveStations([FromBody] StationsRootModel req)
        {

            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            db.Database.BeginTransaction();
            try
            {

                db.Stations.RemoveRange(db.Stations);
                db.SaveChanges();
                req.stations.ForEach(e =>
               {
                   var station = new StationTableModel
                   {
                       Enabled = Convert.ToBoolean(e.Enabled),
                       Station = e.Station,
                   };
                   db.Stations.Add(station);
               });

                db.SaveChanges();
                db.Database.CommitTransaction();

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