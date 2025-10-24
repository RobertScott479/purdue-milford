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
    [Route("api/qalog")]
    [ApiController]
    public class QaLog : ControllerBase
    {

        // private readonly string key = "QcEvent";
        private readonly string filePath;
        private readonly DatabaseContext db;

        private readonly Logger log;

        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public QaLog(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            db = _db;
            filePath = configuration["filepath"];
            log = new Logger(configuration, _db, "qc.log");
        }

        [HttpGet("loadEvents")]
        public ActionResult<QaLogResModel> loadQaLog()
        {
            var res = new QaLogResModel();

            try
            {
                var q = db.qalog.OrderByDescending(x => x.timestamp).Take(100).ToList();
                res.checkEvent = q;
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }

            return Ok(res);
        }


        [HttpPost("addEvent")]
        public ActionResult<ErrorResModel> addQaLog([FromBody] QaLogModel checkEvent)
        {
            var res = new ErrorResModel();

            try
            {
                db.qalog.Add(checkEvent);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;

            }

            return Ok(res);
        }

        [HttpGet("streamQAEvents")]
        public async Task streamQAEvents()
        {

            try
            {
                // await Task.Delay(10000);
                log.write("streamQaLog Started.");
                Response.Headers.Add("Content-Type", "text/event-stream");
                Response.Headers.Add("Connection", "keep-alive");
                Response.Headers.Add("Cache-Control", "no-cache");
                //  Response.Headers.Add("X-Accel-Buffering", "no");
                var random = new Random();
                var id = 0;
                var Timestamp = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
                PieceWightModel payload = new PieceWightModel { weight = random.Next(5, 50), timestamp = Timestamp };
                var json = JsonConvert.SerializeObject(payload);
                await Response.WriteAsync($"data: {json}\nid:{++id}\n\n");
                await Response.Body.FlushAsync();

                while (!HttpContext.RequestAborted.IsCancellationRequested)
                {
                    payload.weight = random.Next(5, 50);
                    payload.timestamp = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
                    json = JsonConvert.SerializeObject(payload);
                    var packet = $"data: {json}\nid:{++id}\n\n";
                    await Response.WriteAsync(packet);
                    await Response.Body.FlushAsync();
                    await Task.Delay(2000);
                }
                log.write("streamQaLog canceled.");
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

