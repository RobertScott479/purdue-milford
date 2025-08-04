using Microsoft.AspNetCore.Mvc;

using weightech_api.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.Design.Serialization;

namespace weightech_api.Models
{

    [Produces("application/json")]
    //[Route("api/hopper")]
    [Route("api/fronts")]
    [Route("api/fillets")]
    [Route("api/tenders")]
    [Route("api/wings")]
    [Route("api/shells")]
    [Route("api/skins")]
    [Route("api/condemned")]

    [ApiController]
    public class HopperController : ControllerBase
    {

        private readonly ILogger<HopperController> _logger;
        public readonly IConfiguration _configuration;
        private afnlContext db = new afnlContext();



        public HopperController(ILogger<HopperController> logger, IConfiguration configuration, IHostEnvironment env, afnlContext _db)//dependency injection
        {
            _logger = logger;
            _configuration = configuration;
            db = _db;

            if (env.IsDevelopment())
            {

            }
        }



        [HttpGet("details")]
        public ActionResult<HopperDetailRes> detail(int start, int stop)
        {
            var res = new HopperDetailRes();
            var path = HttpContext.Request.Path.Value;
            var servergroup = path?.Split('/')[2]; // Gets "hopper", "distribution", "tenders", or "wings"

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var q = db.Hopper.Where(b => b.Timestamp >= start && b.Timestamp < stop && b.ServerGroup == servergroup)
                // .Select(g => new HopperTableModel
                // {
                //     Id = g.Id,
                //     ServerGroup = g.ServerGroup,
                //     Serial = g.Serial,
                //     Timestamp = g.Timestamp,
                //     Net_lb = g.Net_lb,
                //     Gate = g.Gate
                // })
                .ToList();
                stopwatch.Stop();
                res.Details = q;
                res.ErrorCode = 0;
                res.ErrorMessage = "ok";
                res.Rows = q.Count;
                res.Db_filename = _configuration["ConnectionStrings:DefaultConnection"];
                res.Start_timestamp = start.ToString();
                res.Stop_timestamp = stop.ToString();
                res.Query_time = stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                res.ErrorCode = 1;
                res.ErrorMessage = ex.Message + " " + ex.InnerException?.Message;
            }

            return Ok(res);

        }


        [HttpGet("rate")]
        public ActionResult<HopperRateRes> rate(int start, int stop)
        {
            var res = new HopperRateRes();

            var path = HttpContext.Request.Path.Value;
            var servergroup = path?.Split('/')[2]; // Gets "hopper", "distribution", "tenders", or "wings"


            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var groupedSizer = db.Hopper
                    .Where(b => b.Timestamp >= start && b.Timestamp < stop && b.ServerGroup == servergroup)
                    .GroupBy(b => b.Timestamp - (b.Timestamp % 60)) //round to nearest minute
                    .Select(g => new RateModel { Timestamp = g.Key, Count = g.Count() })
                    .ToList();
                stopwatch.Stop();
                res.Rate = groupedSizer;
                res.ErrorCode = 0;
                res.ErrorMessage = "ok";
                res.Rows = groupedSizer.Count;
                res.Db_filename = _configuration["ConnectionStrings:DefaultConnection"];
                res.Start_timestamp = start.ToString();
                res.Stop_timestamp = stop.ToString();
                res.Query_time = stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                //  log.write("gethotkeys ex: " + ex.Message);
                res.ErrorCode = 1;
                res.ErrorMessage = ex.Message + " " + ex.InnerException?.Message;
            }

            return Ok(res);
        }


        [HttpGet("summary")]
        public ActionResult<HopperSummaryRes> summary(int start, int stop)
        {
            var res = new HopperSummaryRes();
            var path = HttpContext.Request.Path.Value;
            var servergroup = path?.Split('/')[2]; // Gets "hopper", "distribution", "tenders", or "wings"
                                                   // Console.WriteLine($"servergroup: {path}");


            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var groupedHopper = db.Hopper
                    .Where(b => b.Timestamp >= start && b.Timestamp <= stop && b.ServerGroup == servergroup)
                    .GroupBy(b => new { b.Gate }) // Group by Gate and ServerGroup

                    .Select(g => new HopperSummary
                    {
                        ServerGroup = servergroup,
                        Gate = g.Key.Gate,
                        Net_lb = g.Sum(b => b.Net_lb), // Convert grams to pounds
                        Count = g.Count(),
                    })
                    .ToList();

                var grandTotals = groupedHopper
               .GroupBy(b => b.ServerGroup) // Group by Gate and ServerGroup
               .Select(g => new HopperSummary
               {
                   Gate = 0,
                   ServerGroup = g.Key,
                   Net_lb = g.Sum(b => b.Net_lb), // Convert grams to pounds
                   Count = g.Count(),
               })
               .ToList();

                groupedHopper.AddRange(grandTotals);



                stopwatch.Stop();
                res.Summary = groupedHopper.OrderBy(b => b.Gate).ToList();
                res.ErrorCode = 0;
                res.ErrorMessage = "ok";
                res.Rows = groupedHopper.Count;
                res.Db_filename = _configuration["ConnectionStrings:DefaultConnection"];
                res.Start_timestamp = start.ToString();
                res.Stop_timestamp = stop.ToString();
                res.Query_time = stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                //  log.write("gethotkeys ex: " + ex.Message);
                res.ErrorCode = 1;
                res.ErrorMessage = ex.Message + " " + ex.InnerException?.Message;
            }

            return Ok(res);
        }


        [HttpGet("summaryAll")]    //assumes all the server groups are in the same db
        public ActionResult<HopperSummaryRes> summaryAll(int start, int stop)
        {
            var res = new HopperSummaryRes();
            var path = HttpContext.Request.Path.Value;
            var servergroup = path?.Split('/')[2]; // Gets "hopper", "distribution", "tenders", or "wings"



            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var groupedHopper = db.Hopper
                    .Where(b => b.Timestamp >= start && b.Timestamp <= stop && b.ServerGroup == servergroup)
                    .GroupBy(b => new { b.Gate, b.ServerGroup }) // Group by Gate and ServerGroup
                    .Select(g => new HopperSummary
                    {
                        Gate = g.Key.Gate,
                        ServerGroup = g.Key.ServerGroup,
                        Net_lb = g.Sum(b => b.Net_lb), // Convert grams to pounds
                        Count = g.Count(),
                    })
                    .ToList();

                var grandTotals = groupedHopper
                      .GroupBy(b => b.ServerGroup) // Group by Gate and ServerGroup
                      .Select(g => new HopperSummary
                      {
                          Gate = 0,
                          ServerGroup = g.Key,
                          Net_lb = g.Sum(b => b.Net_lb), // Convert grams to pounds
                          Count = g.Count(),
                      })
                      .ToList();

                groupedHopper.AddRange(grandTotals);

                stopwatch.Stop();
                res.Summary = groupedHopper;
                res.ErrorCode = 0;
                res.ErrorMessage = "ok";
                res.Rows = groupedHopper.Count;
                res.Db_filename = _configuration["ConnectionStrings:DefaultConnection"];
                res.Start_timestamp = start.ToString();
                res.Stop_timestamp = stop.ToString();
                res.Query_time = stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                //  log.write("gethotkeys ex: " + ex.Message);
                res.ErrorCode = 1;
                res.ErrorMessage = ex.Message + " " + ex.InnerException?.Message;
            }

            return Ok(res);
        }

        [HttpPost("populate")]
        public ActionResult PopulateHopperTable(int count = 100, int? startTimestamp = null)
        {
            db.Database.BeginTransaction();
            db.Hopper.RemoveRange(db.Hopper); // Clear existing entries
            var random = new Random();
            var serverGroups = new[]
            {
                //new { groupName = "fronts", standardYield = 100 },
                new { groupName = "fillets", standardYield = .68, frequency = 2,index=1 },
                new { groupName = "tenders", standardYield = .08, frequency = 2,index=2 },
                new { groupName = "wings", standardYield = .07, frequency =2,index=3 },
                new { groupName = "shells", standardYield = .13, frequency = 1,index=4 },
                new { groupName = "skins", standardYield = .03, frequency = 1,index=5 },
                new { groupName = "condemned", standardYield = .01, frequency = 1,index=6}
            };

            var serials = new int[serverGroups.Length + 1];

            var globalSerial = 0;

            var gates = Enumerable.Range(1, 6).ToArray();

            int baseTimestamp = startTimestamp ?? (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            double startingWeight = 100000;

            var hopperEntries = new List<HopperTableModel>();
            var batchWeight = 0.0;

            while (startingWeight > 0)
            {
                globalSerial++;
                baseTimestamp++;
                batchWeight += Math.Round(random.NextDouble() * 2 + 2, 2);
                var fronts = new HopperTableModel
                {
                    Timestamp = baseTimestamp,
                    ServerGroup = "fronts",
                    Gate = gates[random.Next(gates.Length)],
                    Net_lb = batchWeight,
                    Serial = ++serials[0],
                    // ServerIndex = -1
                };
                hopperEntries.Add(fronts);
                startingWeight -= fronts.Net_lb;


                foreach (var serverGroup in serverGroups)
                {
                    batchWeight = Math.Round(fronts.Net_lb * serverGroup.standardYield / serverGroup.frequency, 2);
                    for (int j = 0; j < serverGroup.frequency; j++)
                    {
                        baseTimestamp++;

                        var entrys = new HopperTableModel
                        {
                            Timestamp = baseTimestamp,
                            ServerGroup = serverGroup.groupName,
                            Gate = gates[random.Next(gates.Length)],
                            Net_lb = batchWeight,
                            Serial = ++serials[serverGroup.index],
                            // ServerIndex = -1
                        };
                        hopperEntries.Add(entrys);
                    }
                }
            }

            db.Hopper.AddRange(hopperEntries);
            db.SaveChanges();

            db.Database.CommitTransaction();
            _logger.LogInformation($"Inserted {hopperEntries.Count} hopper entries starting from timestamp {startTimestamp ?? baseTimestamp - hopperEntries.Count}.");

            return Ok(new { Inserted = hopperEntries.Count });
        }





    }
}