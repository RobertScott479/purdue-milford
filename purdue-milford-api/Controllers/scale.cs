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

namespace api_philly.Controllers
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

        [HttpPost("codechange")]
        public ActionResult<ErrorResModel> codechange([FromBody] string code)
        {
            System.Threading.Thread.Sleep(500);
            if (code != "")
            {
                return Ok(new ErrorResModel { errorCode = "0", errorMessage = $"New Meat In code {code} applied" });
            }
            else
            {
                return Ok(new ErrorResModel { errorCode = "0", errorMessage = "Old Meat Out applied" });
            }

        }


        [HttpPost("newmeatin")]
        public ActionResult<ErrorResModel> newmeatin([FromBody] CodeChangeModel codeChange)
        {
            System.Threading.Thread.Sleep(500);
            return Ok(new ErrorResModel { errorCode = "0", errorMessage = $"New Meat In code {codeChange.product} applied" });
        }


        [HttpPost("oldmeatout")]
        public ActionResult<ErrorResModel> oldmeatout()
        {
            System.Threading.Thread.Sleep(500);
            return Ok(new ErrorResModel { errorCode = "0", errorMessage = "Old Meat Out applied" });

        }

        [HttpPost("cleanout")]
        public ActionResult<ErrorResModel> cleanout()
        {
            System.Threading.Thread.Sleep(500);
            return Ok(new ErrorResModel { errorCode = "0", errorMessage = "Cleanout Started..." });

        }


        [HttpPost("shiftchange")]
        public ActionResult<ErrorResModel> shiftchange([FromBody] int shiftNum)
        {
            System.Threading.Thread.Sleep(500);
            return Ok(new ErrorResModel { errorCode = "0", errorMessage = "Shift changed to " + shiftNum });
        }


        [HttpPost("clear")]
        public ActionResult<ErrorResModel> clear(int index)
        {
            // Console.Write(index);
            return Ok(new ErrorResModel { errorCode = "0", errorMessage = "Totals cleared successfully at " + DateTime.Now });
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
                    new StationModel { Station = u.Station, Enabled = Convert.ToBoolean(u.Enabled) }
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
                   var station = new StationModel
                   {
                       //  Id = e.Id,                     
                       Enabled = Convert.ToBoolean(e.Enabled),
                       Station = e.Station
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


        [HttpPost("applybreakadjustments")]
        public ActionResult<ErrorResModel> applybreakadjustments([FromBody] BreakAdjustmentRootModel req)
        {

            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            db.Database.BeginTransaction();
            try
            {
                db.BreakAdjustments.RemoveRange(db.BreakAdjustments);
                db.SaveChanges();
                //     req.breakAdjustments.ForEach(e =>
                //   {
                //       var breakAdjustment = new BreakAdjustmentModel
                //       {
                //           //  Id = e.Id,                     
                //           bank = e.bank,
                //           adjustment = e.adjustment
                //       };
                //       db.BreakAdjustments.Add(breakAdjustment);
                //   });
                db.AddRange(req.breakAdjustments);
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


        // [HttpGet("loadstations")]
        // public async Task<ActionResult<StationsResModel>> loadstations()
        // {

        //     var res = new StationsResModel();
        //     var fileExist = false;
        //     try
        //     {
        //         var fileToRead = Path.Combine(this.filePath, "stations.json");
        //         if (System.IO.File.Exists(fileToRead))
        //         {
        //             var json = await System.IO.File.ReadAllTextAsync(fileToRead);
        //             res.stations = JsonConvert.DeserializeObject<StationsRootModel>(json).stations;
        //             fileExist = true;
        //         }

        //         if (res.stations == null)
        //         {
        //             res.errorCode = "1";
        //             res.errorMessage = "Unable to load stations.json. The file is " + (fileExist ? "corrupt" : "missing");
        //         }
        //         else
        //         {
        //             res.errorCode = "0";
        //             res.errorMessage = "";
        //         }

        //     }
        //     catch (Exception e)
        //     {
        //         res.errorCode = "1";
        //         res.errorMessage =  e.Message + " " + e.InnerException?.Message;
        //     }

        //     return Ok(res);
        // }

        // [HttpPost("savestations")]
        // public async Task<ActionResult<ErrorResModel>> savestations([FromBody] StationsRootModel req)
        // {
        //     ErrorResModel res = new ErrorResModel();

        //     try
        //     {
        //         if (!Directory.Exists(filePath))
        //         {
        //             DirectoryInfo di = Directory.CreateDirectory(filePath);
        //         }

        //         var fileToWrite = Path.Combine(this.filePath, "stations.json");
        //         // Console.Write(fileToWrite);                           
        //         var json = JsonConvert.SerializeObject(req);
        //         await System.IO.File.WriteAllTextAsync(fileToWrite, json);
        //         res.errorCode = "0";
        //         res.errorMessage = "";
        //     }
        //     catch (Exception e)
        //     {
        //         Console.WriteLine("The process failed: {0}", e.ToString());
        //         res.errorCode = "1";
        //         res.errorMessage =  e.Message + " " + e.InnerException?.Message;
        //     }


        //     return Ok(res);
        // }








    }
}