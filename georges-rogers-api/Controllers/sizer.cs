using Microsoft.AspNetCore.Mvc;

using weightech_api.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace weightech_api.Models
{

    [Produces("application/json")]
    [Route("api/sizer")]
    [ApiController]
    public class SizerController : ControllerBase
    {

        private readonly ILogger<SizerController> _logger;
        public readonly IConfiguration _configuration;
        private afnlContext db = new afnlContext();



        public SizerController(ILogger<SizerController> logger, IConfiguration configuration, IHostEnvironment env, afnlContext _db)//dependency injection
        {
            _logger = logger;
            _configuration = configuration;
            db = _db;

            if (env.IsDevelopment())
            {

            }
        }





        [HttpGet("details")]
        public ActionResult<SizerDetailRes> detail(int start, int stop)
        {
            var res = new SizerDetailRes();

            // NumberFormatInfo provider = new NumberFormatInfo();
            // provider.NumberDecimalSeparator = ".";
            // provider.NumberGroupSeparator = ",";
            //.Where(u => u.Code == "90801")

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var q = db.Sizer.Where(b => b.Timestamp >= start && b.Timestamp < stop).Select(g => new SizerTray
                {
                    Serial = g.Serial,
                    Net_g = g.Net_g,
                    Timestamp = g.Timestamp,
                    Gate = g.Gate,
                    Scale = g.Scale
                }).ToList();

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
                res.ErrorMessage = ex.Message;
            }

            return Ok(res);

        }


        [HttpGet("rate")]
        public ActionResult<SizerRateRes> rate(int start, int stop)
        {
            var res = new SizerRateRes();

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var groupedSizer = db.Sizer
                    .Where(b => b.Timestamp >= start && b.Timestamp < stop)
                    .GroupBy(b => b.Timestamp - (b.Timestamp % 60)) //round to nearest minute
                    .Select(g => new SizerRate { Timestamp = g.Key, Count = g.Count() })
                    .ToList();
                //var q = db.Sizer.Where(b => b.Timestamp > start && b.Timestamp < stop).ToList();
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
                res.ErrorMessage = ex.Message;
            }

            return Ok(res);
        }


        [HttpGet("summary")]
        public ActionResult<SizerSummaryRes> summary(int start, int stop)
        {
            var res = new SizerSummaryRes();

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var groupedSizer = db.Sizer
                    .Where(b => b.Timestamp >= start && b.Timestamp <= stop)
                    .GroupBy(b => b.Gate)
                    .Select(g => new SizerSummary
                    {
                        Gate = g.Key,
                        net_g = g.Sum(b => b.Net_g),
                        net_lb = g.Sum(b => b.Net_g * 0.00220462), // Convert grams to pounds
                        Count = g.Count(),
                        High_g = g.Max(b => b.Net_g),
                        Low_g = g.Min(b => b.Net_g)
                    })
                    .ToList();

                stopwatch.Stop();
                res.Summary = groupedSizer;
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
                res.ErrorMessage = ex.Message;
            }

            return Ok(res);
        }







    }
}