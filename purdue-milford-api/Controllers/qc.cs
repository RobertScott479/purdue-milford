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


    public class TeguarModel
    {
        [Required] public string status { get; set; } = "";
        [Required] public CheckEventModel checkEvent { get; set; } = new CheckEventModel();
    }

    [Produces("application/json")]
    [Route("api/qc")]
    [ApiController]
    public class QCController : ControllerBase
    {

        private readonly string key = "QcEvent";
        private readonly string filePath;
        private readonly DatabaseContext db;

        private readonly Logger log;

        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public QCController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            db = _db;
            filePath = configuration["filepath"];
            log = new Logger(configuration, _db, "qc.log");
        }

        // [HttpGet("loadcheckers")]
        // public ActionResult<CheckersResModel> loadcheckers()
        // {
        //     var res = new CheckersResModel();
        //     res.errorCode = "0";
        //     res.errorMessage = "";
        //     try
        //     {
        //         var q = db.Checkers.Select(u =>
        //             new CheckerModel { Id = u.Id, checkerName = u.Name }
        //         ).ToList();

        //         res.checkers = q;
        //     }
        //     catch (Exception e)
        //     {
        //         res.errorCode = "1";
        //         res.errorMessage = e.Message + " " + e.InnerException?.Message;
        //     }

        //     return Ok(res);
        // }


        // [HttpPost("savecheckers")]
        // public ActionResult<ErrorResModel> savecheckers([FromBody] CheckersModel req)
        // {
        //     ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };

        //     try
        //     {
        //         db.Database.BeginTransaction();
        //         //var i = db.Database.ExecuteSqlRaw("DELETE FROM [checkers]");
        //         db.Checkers.RemoveRange(db.Checkers);
        //         req.checkers.ForEach(e =>
        //        {
        //            var checker = new Checker
        //            {
        //                // Id = e.Id,
        //                Name = e.checkerName
        //            };
        //            db.Checkers.Add(checker);
        //        });
        //         db.Database.CommitTransaction();
        //         db.SaveChanges();
        //     }
        //     catch (Exception e)
        //     {
        //         db.Database.RollbackTransaction();
        //         res.errorCode = "1";
        //         res.errorMessage = e.Message + " " + e.InnerException?.Message;
        //     }
        //     return Ok(res);
        // }



        [HttpGet("getCheckEvent")]
        public ActionResult<CheckEventResModel> getCheckEvent()
        {


            TeguarModel tm = new TeguarModel();

            Random random = new Random();

            string[] stations = { "A01", "B01", "A02", "B02", "A03", "B03", "A04", "B04", "A05", "B05", "A06", "B06", "A07", "B07", "A08", "B08", "A09", "B09", "A10", "B10", };
            string[] cuts = { "Primary", "Cut 1", "Cut 2" };
            string json = HttpContext.Session.GetString(key);
            if (string.IsNullOrEmpty(json))
            {
                tm.checkEvent = new CheckEventModel { weight = 0, station = "A01", timestamp = 0, index = 0, cut = "primary", bank = 0 };
            }
            else
            {
                tm = JsonConvert.DeserializeObject<TeguarModel>(json);
                tm.checkEvent.weight = random.NextDouble() * 10;
                tm.checkEvent.station = stations[random.Next(0, 19)];
                tm.checkEvent.cut = cuts[random.Next(0, 2)];
                tm.checkEvent.timestamp = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
                tm.checkEvent.index += 1;
                tm.checkEvent.index %= 3;
                tm.checkEvent.bank = tm.checkEvent.index % 5;
            }

            CheckEventResModel response = new CheckEventResModel();

            if (tm.status == "1")
            {
                tm.status = "0";
                response.errorCode = "3";
                response.errorMessage = "WDF was expecting setcheckevent or cancelcheckevent";
                log.write($"getCheckEvent {tm.status}");
            }
            else if (tm.checkEvent.index == 2)
            {
                tm.status = "1";
                response.errorCode = "0";
                response.errorMessage = "";
                json = JsonConvert.SerializeObject(tm);
                HttpContext.Session.SetString(key, json);
                var ts = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
                response.checkEvent = new CheckEventModel { cutter_number = 9007, bank = 0, cut = cuts[random.Next(0, 3)], index = 412, station = "I01", timestamp = ts, weight = 1.2000000476837158 };
                log.write($"getCheckEvent {tm.status}");
            }
            else
            {
                tm.status = "0";
                response.errorCode = "1";
                response.errorMessage = "no event";
                json = JsonConvert.SerializeObject(tm);
                HttpContext.Session.SetString(key, json);
                response.checkEvent = null;
                log.write($"getCheckEvent {tm.status}");
            }

            return Ok(response);
        }


        [HttpPost("setCheckEvent")]
        public ActionResult<ErrorResModel> setCheckEvent([FromBody] CheckEventOutputModel req)
        {
            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            TeguarModel tm = new TeguarModel();

            string json = HttpContext.Session.GetString(this.key);
            tm = JsonConvert.DeserializeObject<TeguarModel>(json ?? "");
            if (tm != null)
            {
                tm.status = "0";
                json = JsonConvert.SerializeObject(tm);
                HttpContext.Session.SetString(key, json);
            }
            log.write("setCheckEvent");
            return Ok(res);
        }

        [HttpPost("cancelCheckEvent")]
        public ActionResult<ErrorResModel> cancelCheckEvent()
        {
            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            TeguarModel tm = new TeguarModel();
            try
            {
                string json = HttpContext.Session.GetString(this.key);
                tm = JsonConvert.DeserializeObject<TeguarModel>(json);
                if (tm != null)
                {
                    tm.status = "0";
                    json = JsonConvert.SerializeObject(tm);
                    HttpContext.Session.SetString(key, json);
                }
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }

            log.write("cancelCheckEvent");
            return Ok(res);
        }

        // [HttpPost("loginchecker")]
        // public ActionResult<ErrorResModel> qclogin([FromBody] CheckerModel login)
        // {
        //     ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
        //     Console.WriteLine("QC logged in " + login.checker_cutter_number.ToString() + " at " + DateTime.Now.ToString("M/dd/yy hh:mm:ss:ms"));
        //     log.write("loginchecker " + login.checker_cutter_number.ToString());
        //     return Ok(res);
        // }

        // [HttpPost("loginchecker/{cutter_number}")]
        // public ActionResult<ErrorResModel> qclogin(int cutter_number)
        // {
        //     var res = new CheckerLoginResModel();
        //     res.errorCode = "0";
        //     res.errorMessage = "";
        //     try
        //     {
        //         var q = db.Employees.SingleOrDefault(u => u.Cutter_number == cutter_number && u.Role == "Checker");
        //         if (q == null)
        //         {
        //             throw new Exception($"{cutter_number} is not a valid checker number.");
        //         }
        //         res.checker = new EmployeeModel { cutter_number = q.Cutter_number, name = q.Name, role = q.Role, enabled = Convert.ToBoolean(q.Enabled == "1" ? true : false), shift = Convert.ToInt32(q.Shift) };
        //     }
        //     catch (Exception e)
        //     {
        //         res.errorCode = "1";
        //         res.errorMessage = e.Message + " " + e.InnerException?.Message;
        //     }

        //     return Ok(res);
        // }

        [HttpPost("logoutchecker")]
        public ActionResult<ErrorResModel> qclogout()
        {
            this.cancelCheckEvent();
            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            Console.WriteLine("QC logged out at " + DateTime.Now.ToString("M/dd/yy hh:mm:ss:ms"));
            var ClientIPAddr = HttpContext.Connection.RemoteIpAddress?.ToString();
            log.write("logoutchecker, client IP: " + ClientIPAddr);
            return Ok(res);
        }

        [HttpGet("getWeightSSE")]
        public async Task GetWeightSSE()
        {
            try
            {
                // await Task.Delay(10000);
                log.write("GetWeightSSE Started.");
                Response.Headers.Add("Content-Type", "text/event-stream");
                Response.Headers.Add("Connection", "keep-alive");
                Response.Headers.Add("Cache-Control", "no-cache");
                //  Response.Headers.Add("X-Accel-Buffering", "no");
                var random = new Random();
                var id = 0;
                PieceWightModel payload = new PieceWightModel { weight = random.Next(5, 50) };
                var json = JsonConvert.SerializeObject(payload);
                await Response.WriteAsync($"data: {json}\nid:{++id}\n\n");
                await Response.Body.FlushAsync();

                while (!HttpContext.RequestAborted.IsCancellationRequested)
                {
                    payload.weight = random.Next(5, 50);
                    json = JsonConvert.SerializeObject(payload);
                    var packet = $"data: {json}\nid:{++id}\n\n";
                    await Response.WriteAsync(packet);
                    await Response.Body.FlushAsync();
                    await Task.Delay(2000);
                }
                log.write("GetWeightSSE canceled.");
            }
            catch (TaskCanceledException e)
            {
                log.write(e.Message + " " + e.InnerException?.Message);
            }
            catch (Exception e)
            {
                log.write(e.Message + " " + e.InnerException?.Message);
            }
        }
    }

}

