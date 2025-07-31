using Microsoft.AspNetCore.Mvc;

using weightech_api.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;

using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace weightech_api.Models
{

    [Produces("application/json")]
    [Route("api/scale")]
    [ApiController]
    public class ScaleController : ControllerBase
    {

        private static readonly object _lockObject = new object();
        private static QCModel lastCheck = new QCModel { weight = 0, timestamp = DateTimeOffset.Now.ToUnixTimeSeconds() * 1000, station = "", duration = 0, index = 0, checkStatus = "" };
        //private readonly string key = "QcEvent";
        private readonly string filePath;

        private readonly ILogger<ScaleController> _logger;

        public ScaleController(IConfiguration configuration, IHostEnvironment env, ILogger<ScaleController> logger)
        {
            filePath = configuration["filepath"];
            _logger = logger;
        }




        // [HttpPost("cleartotals")]
        // public ActionResult<ErrorResModel> clear()
        // {
        //     return Ok(new ErrorResModel { errorCode = "0", errorMessage = "Totals cleared successfully at " + DateTime.Now });
        // }


        [HttpGet("loadstations")]
        public async Task<ActionResult<StationsResModel>> loadStations()
        {

            var res = new StationsResModel();
            try
            {
                var fileToRead = Path.Combine(this.filePath, "stations.json");
                if (System.IO.File.Exists(fileToRead))
                {
                    var json = await System.IO.File.ReadAllTextAsync(fileToRead);
                    res.stations = JsonSerializer.Deserialize<StationsResModel>(json).stations;
                    res.errorCode = "0";
                    res.errorMessage = "";
                }
                else
                {
                    res.errorCode = "1";
                    res.errorMessage = "Unable to load stations.json.  This file is missing!";
                }

            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message;
            }

            return Ok(res);
        }

        [HttpPost("savestations")]
        public async Task<ActionResult<ErrorResModel>> saveemployees([FromBody] StationsRootModel req)
        {
            ErrorResModel res = new ErrorResModel();

            try
            {
                if (!Directory.Exists(filePath))
                {
                    DirectoryInfo di = Directory.CreateDirectory(filePath);
                }

                var fileToWrite = Path.Combine(this.filePath, "stations.json");
                // Console.Write(fileToWrite);                           
                var json = JsonSerializer.Serialize(req);
                await System.IO.File.WriteAllTextAsync(fileToWrite, json);
                res.errorCode = "0";
                res.errorMessage = "";
            }
            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
                res.errorCode = "1";
                res.errorMessage = e.Message;
            }


            return Ok(res);
        }



        [HttpGet("checkstream")]
        [Produces("text/event-stream")]
        [ProducesResponseType(typeof(QCModel), StatusCodes.Status200OK)]
        public async Task checkstream()
        {
            try
            {
                string[] stations = { "A01", "B01", "A02", "B02", "A03", "B03", "A04", "B04", "A05", "B05", "A06", "B06", "A07", "B07", "A08", "B08", "A09", "B09", "A10", "B10", };
                _logger.LogInformation("Checkstream Started.");

                Response.Headers.Add("Content-Type", "text/event-stream");
                Response.Headers.Add("Connection", "keep-alive");
                Response.Headers.Add("Cache-Control", "no-cache");
                //  Response.Headers.Add("X-Accel-Buffering", "no");
                var random = new Random();
                var id = 0;
                var index = 0;
                var duration = 0;
                var newCheck = 0;
                var newCheckDelay = random.Next(3, 10);
                QCModel payload = new QCModel { weight = 0, timestamp = 0, station = "", duration = 0, index = index, checkStatus = "" };
                var json = JsonSerializer.Serialize(payload);
                // HttpContext.Session.SetString(key, json);

                //await Response.WriteAsync($"event: check\ndata: {json}\nid:{++id}\n\n");
                await Response.WriteAsync($"data: {json}\nid:{++id}\n\n");
                await Response.Body.FlushAsync();


                QCModel checkInfo;
                while (!HttpContext.RequestAborted.IsCancellationRequested)
                {

                    lock (_lockObject)
                    {
                        checkInfo = lastCheck;
                    }
                    if (checkInfo.checkStatus == "pass" || checkInfo.checkStatus == "fail")
                    {
                        checkInfo.checkStatus = "";
                        payload.index = 0;
                        payload.duration = 0;
                        payload.station = "";
                        payload.weight = 0;
                        payload.checkStatus = "";
                        payload.timestamp = 0;
                        newCheck = 0;
                        newCheckDelay = random.Next(5, 15);
                    }

                    newCheck++;
                    if (newCheck == newCheckDelay)
                    {
                        payload.index = checkInfo.index + 1;
                        payload.station = stations[random.Next(0, stations.Length)];
                        payload.weight = random.Next(5, 50);
                        payload.duration = 0;
                        payload.checkStatus = "";
                        payload.timestamp = DateTimeOffset.Now.ToUnixTimeSeconds() * 1000;
                    }

                    if (payload.index > 0)
                    {
                        payload.duration = duration++;
                    }



                    json = JsonSerializer.Serialize(payload);
                    var packet = $"data: {json}\nid:{++id}\n\n";

                    await Response.WriteAsync(packet);
                    await Response.Body.FlushAsync();
                    await Task.Delay(1000);
                }
                _logger.LogInformation("Checkstream canceled.");
                lock (_lockObject)
                {
                    lastCheck.checkStatus = "";
                }

            }
            catch (TaskCanceledException e)
            {
                _logger.LogInformation(e.Message + " " + e.InnerException?.Message);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + " " + e.InnerException?.Message);
            }
        }




        [HttpPost("savecheck")]
        public ActionResult<ErrorResModel> saveCheck([FromBody] QCModel req)
        {
            ErrorResModel res = new ErrorResModel();

            try
            {
                lock (_lockObject)
                {
                    lastCheck = req;
                }

                res.errorCode = "0";
                res.errorMessage = "";
            }
            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
                res.errorCode = "1";
                res.errorMessage = e.Message;
            }


            return Ok(res);
        }


    }
}