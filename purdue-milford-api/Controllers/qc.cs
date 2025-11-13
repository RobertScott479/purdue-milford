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
namespace weightech.Controllers
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


        public QCController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            db = _db;
            filePath = configuration["filepath"];
            log = new Logger(configuration, _db, "qc.log");
        }





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

            try
            {
                string json = HttpContext.Session.GetString(this.key);
                tm = JsonConvert.DeserializeObject<TeguarModel>(json ?? "");
                if (tm != null)
                {
                    tm.status = "0";
                    json = JsonConvert.SerializeObject(tm);
                    HttpContext.Session.SetString(key, json);
                }

                // Insert into QcResults table
                var qcResult = new QcResults
                {
                    checker_cutter_number = req.checker_cutter_number,
                    product = req.product,
                    bank = req.checkEvent.bank,
                    cut = req.checkEvent.cut,
                    cutter_number = req.checkEvent.cutter_number,
                    cycle = req.checkEvent.index,
                    station = req.checkEvent.station,
                    timestamp = req.checkEvent.timestamp,
                    weight = req.checkEvent.weight,
                    defect_0 = req.defects.Length > 0 ? req.defects[0] : 0,
                    defect_1 = req.defects.Length > 1 ? req.defects[1] : 0,
                    defect_2 = req.defects.Length > 2 ? req.defects[2] : 0,
                    defect_3 = req.defects.Length > 3 ? req.defects[3] : 0,
                    defect_4 = req.defects.Length > 4 ? req.defects[4] : 0,
                    defect_5 = req.defects.Length > 5 ? req.defects[5] : 0,
                    defect_6 = req.defects.Length > 6 ? req.defects[6] : 0,
                    defect_7 = req.defects.Length > 7 ? req.defects[7] : 0,
                    defect_8 = req.defects.Length > 8 ? req.defects[8] : 0,
                    defect_9 = req.defects.Length > 9 ? req.defects[9] : 0,
                    inspect_time = req.inspectionTime,
                    pass = req.passed,
                    fail = req.failed,
                    cancel = req.canceled,
                    pieces = req.pieces != null ? JsonConvert.SerializeObject(req.pieces) : string.Empty,
                    finished_po = req.finishedPO ?? string.Empty,
                    aqlScore = req.aqlScore,
                    aqlStandard = req.aqlStandard
                };

                db.QcResults.Add(qcResult);
                db.SaveChanges();

                log.write("setCheckEvent - Data inserted into QcResults");
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
                log.write($"setCheckEvent error: {res.errorMessage}");
            }

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

        [HttpGet("summary")]
        public ActionResult<List<ITrimlineQASummaryRes>> GetSummary([FromQuery] int start, [FromQuery] int stop, [FromQuery] string groupBy = "cutter_number,product,checker_cutter_number")
        {
            try
            {
                // Parse groupBy fields
                var groupByFields = groupBy.Split(',').Select(f => f.Trim().ToLower()).ToList();

                // Query all records in time range
                var query = db.QcResults
                    .Where(q => q.timestamp >= start && q.timestamp <= stop)
                    .Select(q => new
                    {
                        line = q.station.Substring(0, 1), // First character of station
                        station = q.station,
                        product = q.product,
                        cutter_number = q.cutter_number,
                        checker_cutter_number = q.checker_cutter_number,
                        pass = q.pass,
                        fail = q.fail,
                        defect_0 = q.defect_0,
                        defect_1 = q.defect_1,
                        defect_2 = q.defect_2,
                        defect_3 = q.defect_3,
                        defect_4 = q.defect_4,
                        defect_5 = q.defect_5,
                        defect_6 = q.defect_6,
                        defect_7 = q.defect_7,
                        defect_8 = q.defect_8,
                        defect_9 = q.defect_9,
                        inspect_time = q.inspect_time,
                        weight = q.weight,
                        aqlScore = q.aqlScore,
                        aqlStandard = q.aqlStandard
                    })
                    .ToList();

                // Dynamic grouping
                var grouped = query.GroupBy(q =>
                {
                    var key = new List<string>();
                    if (groupByFields.Contains("line")) key.Add(q.line);
                    if (groupByFields.Contains("station")) key.Add(q.station);
                    if (groupByFields.Contains("product")) key.Add(q.product);
                    if (groupByFields.Contains("cutter_number")) key.Add(q.cutter_number.ToString());
                    if (groupByFields.Contains("checker_cutter_number")) key.Add(q.checker_cutter_number.ToString());
                    return string.Join("|", key);
                }).Select(g =>
                {
                    var first = g.First();
                    return new
                    {
                        line = groupByFields.Contains("line") ? first.line : "",
                        station = groupByFields.Contains("station") ? first.station : "",
                        product = groupByFields.Contains("product") ? first.product : "",
                        cutter_number = groupByFields.Contains("cutter_number") ? first.cutter_number : 0,
                        checker_cutter_number = groupByFields.Contains("checker_cutter_number") ? first.checker_cutter_number : 0,
                        totalChecks = g.Count(),
                        passedChecks = g.Sum(x => x.pass),
                        failedChecks = g.Sum(x => x.fail),
                        totalDefects1 = g.Sum(x => x.defect_1),
                        totalDefects2 = g.Sum(x => x.defect_2),
                        totalDefects3 = g.Sum(x => x.defect_3),
                        totalDefects4 = g.Sum(x => x.defect_4),
                        totalDefects5 = g.Sum(x => x.defect_5),
                        totalDefects6 = g.Sum(x => x.defect_6),
                        totalDefects7 = g.Sum(x => x.defect_7),
                        totalDefects8 = g.Sum(x => x.defect_8),
                        totalDefects9 = g.Sum(x => x.defect_9),
                        totalDefects10 = g.Sum(x => x.defect_0),
                        totalDefects = g.Sum(x => x.defect_0 + x.defect_1 + x.defect_2 + x.defect_3 + x.defect_4 + x.defect_5 + x.defect_6 + x.defect_7 + x.defect_8 + x.defect_9),
                        avgInspectionTime = g.Average(x => x.inspect_time),
                        totalWeight = g.Sum(x => x.weight),
                        avgAqlScore = g.Average(x => x.aqlScore),
                        avgAqlStandard = g.Average(x => x.aqlStandard)
                    };
                }).ToList();

                // Get employee names
                var cutterNumbers = grouped.Select(r => r.cutter_number).Where(n => n > 0).Distinct().ToList();
                var checkerNumbers = grouped.Select(r => r.checker_cutter_number).Where(n => n > 0).Distinct().ToList();
                var allNumbers = cutterNumbers.Union(checkerNumbers).Distinct().ToList();
                var allProducts = grouped.Select(r => r.product).Where(p => !string.IsNullOrEmpty(p)).Distinct().ToList();

                var employees = db.Employees
                    .Where(e => allNumbers.Contains(e.Cutter_number))
                    .ToDictionary(e => e.Cutter_number, e => e.Name);

                var products = db.Cuts.Where(e => allProducts.Contains(e.code))
                    .ToDictionary(e => e.code, e => e.description);

                // Map to response model
                var response = grouped.Select(r => new ITrimlineQASummaryRes
                {
                    Line = r.line,
                    Station = r.station,
                    Code = r.product,
                    Description = !string.IsNullOrEmpty(r.product) && products.ContainsKey(r.product) ? products[r.product] : "",
                    Cutter = r.cutter_number,
                    CutterName = r.cutter_number > 0 && employees.ContainsKey(r.cutter_number) ? employees[r.cutter_number] : "",
                    Checker = r.checker_cutter_number,
                    CheckerName = r.checker_cutter_number > 0 && employees.ContainsKey(r.checker_cutter_number) ? employees[r.checker_cutter_number] : "",
                    AqlScore = (int)r.avgAqlScore,
                    AqlStandard = (int)r.avgAqlStandard,
                    AqlPOS = 0,
                    TotalChecks = r.totalChecks,
                    PassedChecks = r.passedChecks,
                    PassPercent = r.totalChecks > 0 ? (int)((double)r.passedChecks / r.totalChecks * 100) : 0,
                    Defects1 = r.totalDefects1,
                    Defects2 = r.totalDefects2,
                    Defects3 = r.totalDefects3,
                    Defects4 = r.totalDefects4,
                    Defects5 = r.totalDefects5,
                    Defects6 = r.totalDefects6,
                    Defects7 = r.totalDefects7,
                    Defects8 = r.totalDefects8,
                    Defects9 = r.totalDefects9,
                    Defects10 = r.totalDefects10,
                    AvgInspectionTime = (int)r.avgInspectionTime,
                    Weight = (int)r.totalWeight,
                    TotalDefects = r.totalDefects
                }).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                log.write($"summary error: {e.Message} {e.InnerException?.Message}");
                return StatusCode(500, new List<ITrimlineQASummaryRes>());
            }
        }

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

