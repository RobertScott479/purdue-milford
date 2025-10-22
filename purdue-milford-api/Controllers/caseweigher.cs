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
    [Route("api/caseweigher")]
    [ApiController]
    public class DbController : ControllerBase
    {

        private readonly ILogger<DbController> _logger;
        public readonly IConfiguration _configuration;
        private afnlContext db = new afnlContext();


        public DbController(ILogger<DbController> logger, IConfiguration configuration, IHostEnvironment env, afnlContext _db)//dependency injection
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
            var res = new CaseweigherDetailsRes();

            // NumberFormatInfo provider = new NumberFormatInfo();
            // provider.NumberDecimalSeparator = ".";
            // provider.NumberGroupSeparator = ",";
            //.Where(u => u.Code == "90801")

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();

                var q = db.Caseweigher
                .Where(b => b.Timestamp >= start && b.Timestamp < stop)
                // .Select(g => new Bag
                // {
                //     Weight = g.Weight,
                //     High = g.High,
                //     Low = g.Low,
                //     Timestamp = g.Timestamp,
                //     Serial = g.Serial,
                //     Status = g.Status
                // })                
                .ToList();
                stopwatch.Stop();
                res.details = q;
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


        [HttpGet("rate")]
        public ActionResult<CaseweigherRateRes> rate(int start, int stop)
        {
            var res = new CaseweigherRateRes();

            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                var rate = db.Caseweigher
                    .Where(b => b.Timestamp >= start && b.Timestamp < stop)
                    .GroupBy(b => b.Timestamp - (b.Timestamp % 60)) //round to nearest minute
                    .Select(g => new CaseweigherRate { Timestamp = g.Key, Count = g.Count() })
                    .ToList();

                stopwatch.Stop();
                res.Rate = rate;
                res.ErrorCode = 0;
                res.ErrorMessage = "ok";
                res.Rows = rate.Count;
                res.Db_filename = "anfl.db";
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



        [HttpGet("summary")]
        public ActionResult<CaseweigherSummaryRes> summary2(int start, int stop)
        {
            var res = new CaseweigherSummaryRes();

            try
            {
                var summaryList = new List<CaseweigherSummary>();
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                stopwatch.Start();
                // Get the filtered bags
                var filteredBags = db.Caseweigher
                    .Where(x => x.Timestamp >= start && x.Timestamp <= stop)
                    .ToList();


                if (filteredBags.Count > 0)
                {


                    // Create a single summary for all bags in the time range
                    var summary = new CaseweigherSummary
                    {
                        Net_lb = filteredBags.Where(x => x.Status == 1).ToList().Sum(x => x.Net_lb),
                        Mean = filteredBags.Where(x => x.Status == 1).ToList().Average(x => x.Net_lb),
                        Count = filteredBags.Count(x => x.Status == 1),
                        Over = filteredBags.Count(x => x.Status == 2),
                        Under = filteredBags.Count(x => x.Status == 3),
                        TooClose = filteredBags.Count(x => x.Status == 4),
                        Error = filteredBags.Count(x => x.Status == 5),
                        Unknown = filteredBags.Count(x => x.Status > 5 || x.Status < 1)
                    };

                    summaryList.Add(summary);
                }

                stopwatch.Stop();
                res.Summary = summaryList;
                res.ErrorCode = 0;
                res.ErrorMessage = "ok";
                res.Rows = summaryList.Count;
                res.Db_filename = "anfl.db";
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



    }
}