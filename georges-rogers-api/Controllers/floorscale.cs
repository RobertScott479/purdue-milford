using Microsoft.AspNetCore.Mvc;

using weightech_api.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace weightech_api.Controllers
{

    [Produces("application/json")]
    [Route("api/floorscale")]
    [ApiController]
    public class floorscaleController : ControllerBase
    {

        private readonly ILogger<floorscaleController> _logger;
        public readonly IConfiguration _configuration;
        private afnlContext db = new afnlContext();


        public floorscaleController(ILogger<floorscaleController> logger, IConfiguration configuration, IHostEnvironment env, afnlContext _db)//dependency injection
        {
            _logger = logger;
            _configuration = configuration;
            db = _db;

            if (env.IsDevelopment())
            {
            }
        }



        [HttpGet("details")]
        public ActionResult<CaseweigherDetailsRes> detail(int start, int stop)
        {
            var res = new FloorscaleDetailRes();

            // NumberFormatInfo provider = new NumberFormatInfo();
            // provider.NumberDecimalSeparator = ".";
            // provider.NumberGroupSeparator = ",";
            //.Where(u => u.Code == "90801")

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();

                var q = db.Floorscale
                .Where(b => b.Timestamp >= start && b.Timestamp < stop)
                // .Select(g => new Bag
               .Select(g => new FloorscaleModel
               {
                   Net_lb = g.Net_lb,
                   Timestamp = g.Timestamp,
                   Serial = g.Serial,
                   ServerGroup = g.ServerGroup,
                   ServerIndex = g.ServerIndex,
                   Gate = g.Gate
               })
                .ToList();
                stopwatch.Stop();
                res.Details = q;
                res.ErrorCode = 0;
                res.ErrorMessage = "";
                res.Rows = q.Count;
                res.Db_filename = "afnl.db";
                res.Start_timestamp = start.ToString();
                res.Stop_timestamp = stop.ToString();
                res.Query_time = stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                res.ErrorCode = 1;
                res.ErrorMessage = ex.Message;
            }

            return Ok(res);

        }


        // [HttpGet("rate")]
        // public ActionResult<CaseweigherRateRes> rate(int start, int stop)
        // {
        //     var res = new CaseweigherRateRes();

        //     try
        //     {
        //         var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        //         stopwatch.Start();
        //         var rate = db.Bags
        //             .Where(b => b.Timestamp >= start && b.Timestamp < stop)
        //             .GroupBy(b => b.Timestamp - (b.Timestamp % 60)) //round to nearest minute
        //             .Select(g => new CaseweigherRate { Timestamp = g.Key, Count = g.Count() })
        //             .ToList();

        //         stopwatch.Stop();
        //         res.Rate = rate;
        //         res.ErrorCode = 0;
        //         res.ErrorMessage = "ok";
        //         res.Rows = rate.Count;
        //         res.Db_filename = "anfl.db";
        //         res.Start_timestamp = start.ToString();
        //         res.Stop_timestamp = stop.ToString();
        //         res.Query_time = stopwatch.ElapsedMilliseconds;
        //     }
        //     catch (Exception ex)
        //     {
        //         res.ErrorCode = 1;
        //         res.ErrorMessage = ex.Message;
        //     }

        //     return Ok(res);
        // }



        [HttpGet("summary")]
        public ActionResult<HopperSummaryRes> summary(int start, int stop)
        {
            var res = new HopperSummaryRes();
            // var path = HttpContext.Request.Path.Value;
            // var servergroup = path?.Split('/')[2]; // Gets "hopper", "distribution", "tenders", or "wings"
            // Console.WriteLine($"servergroup: {path}");


            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var groupedHopper = db.Floorscale
                    .Where(b => b.Timestamp >= start && b.Timestamp <= stop)
                    .GroupBy(b => new { b.ServerGroup, b.Gate }) // Group by Gate and ServerGroup

                    .Select(g => new HopperSummary
                    {
                        ServerGroup = g.Key.ServerGroup,
                        Gate = g.Key.Gate,
                        Net_lb = g.Sum(b => b.Net_lb), // Convert grams to pounds
                        Count = g.Count(),
                    })
                    .ToList();

                //     var grandTotals = groupedHopper
                //    .GroupBy(b => b.ServerGroup) // Group by Gate and ServerGroup
                //    .Select(g => new HopperSummary
                //    {
                //        Gate = 0,
                //        ServerGroup = g.Key,
                //        Total_lb = g.Sum(b => b.Total_lb), // Convert grams to pounds
                //        Count = g.Count(),
                //    })
                //    .ToList();

                //     groupedHopper.AddRange(grandTotals);



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


        [HttpPost("populate")]
        public ActionResult PopulateHopperTable(int count = 100, int? startTimestamp = null)
        {
            db.Database.BeginTransaction();
            db.Floorscale.RemoveRange(db.Floorscale); // Clear existing entries
            var random = new Random();

            var globalSerial = 0;


            var serverGroups = new[] { "shells", "skins", "condemned" };

            var gates = Enumerable.Range(1, 1).ToArray();

            int baseTimestamp = startTimestamp ?? (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            double startingWeight = 100000;

            var floorScaleEntries = new List<FloorscaleModel>();
            var batchWeight = 0.0;

            while (startingWeight > 0)
            {
                globalSerial++;
                baseTimestamp++;
                batchWeight += Math.Round(random.NextDouble() * 175 + 1550, 2);
                var floorscale = new FloorscaleModel
                {
                    Timestamp = baseTimestamp,
                    ServerGroup = serverGroups[random.Next(serverGroups.Length)],
                    Gate = gates[random.Next(gates.Length)],
                    Net_lb = batchWeight,
                    Serial = globalSerial,
                    ServerIndex = -1
                };
                floorScaleEntries.Add(floorscale);
                startingWeight -= floorscale.Net_lb;


            }

            db.Floorscale.AddRange(floorScaleEntries);
            db.SaveChanges();

            db.Database.CommitTransaction();
            _logger.LogInformation($"Inserted {floorScaleEntries.Count} hopper entries starting from timestamp {startTimestamp ?? baseTimestamp - floorScaleEntries.Count}.");

            return Ok(new { Inserted = floorScaleEntries.Count });
        }




    }
}