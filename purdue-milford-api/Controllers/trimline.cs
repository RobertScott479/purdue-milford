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
    public class ITrimlineSummaryRes
    {
        // public string Line { get; set; }
        public string Station { get; set; }
        public int Cutter { get; set; }
        public string CutterName { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public double In_lbs { get; set; }
        public double Out_lbs { get; set; }
        public double Yield { get; set; }
        public double StandardYield { get; set; }
        public double PosYield { get; set; }
        public int AqlScore { get; set; }
        public int AqlStandard { get; set; }
        public double PosAqlScore { get; set; }
        public double Hours { get; set; }
        public double Ppmh { get; set; }
        public double Sppmh { get; set; }
        public double PosPpmh { get; set; }
    }

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class trimlineController : ControllerBase
    {
        private readonly DatabaseContext db;
        private readonly Logger log;
        // private readonly string filePath;
        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public trimlineController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            // filePath = configuration["filepath"];
            db = _db;
            log = new Logger(configuration, _db, "trimline.log");
        }


        [HttpGet("summary")]
        public ActionResult<List<ITrimlineSummaryRes>> GetSummary([FromQuery] int start, [FromQuery] int stop, [FromQuery] string groupBy = "cutter_number")
        {
            try
            {
                // // Parse groupBy fields
                // var groupByFields = groupBy.Split(',').Select(f => f.Trim().ToLower()).ToList();

                // // Query QC results for AQL data
                // var qcData = db.QcResults
                //     .Where(q => q.timestamp >= start && q.timestamp <= stop)
                //     .Select(q => new
                //     {
                //         line = q.station.Substring(0, 1),
                //         station = q.station,
                //         product = q.product,
                //         cutter_number = q.cutter_number,
                //         aqlScore = q.aqlScore,
                //         aqlStandard = q.aqlStandard
                //     })
                //     .ToList();

                // // Query Dumps for weight data (in/out)
                // var dumpData = db.Dumps
                //     .Where(d => !string.IsNullOrEmpty(d.Timestamp) && int.Parse(d.Timestamp) >= start && int.Parse(d.Timestamp) <= stop)
                //     .Select(d => new
                //     {
                //         line = d.Station.Substring(0, 1),
                //         station = d.Station,
                //         cut = d.Cut,
                //         weight = double.Parse(d.Weight),
                //         vector = d.Vector
                //     })
                //     .ToList();

                // // Group dump data by station/cutter
                // var weightGroups = dumpData.GroupBy(d => new { d.station, d.cut })
                //     .Select(g => new
                //     {
                //         g.Key.station,
                //         g.Key.cut,
                //         in_lbs = g.Where(x => x.vector == "0").Sum(x => x.weight),
                //         out_lbs = g.Where(x => x.vector == "1").Sum(x => x.weight)
                //     })
                //     .ToList();

                // // Get all employee numbers and product codes
                // var cutterNumbers = qcData.Select(q => q.cutter_number).Distinct().ToList();
                // var productCodes = qcData.Select(q => q.product).Where(p => !string.IsNullOrEmpty(p)).Distinct().ToList();

                // // Load employees and products
                // var employees = db.Employees
                //     .Where(e => cutterNumbers.Contains(e.Cutter_number ?? 0))
                //     .ToDictionary(e => e.Cutter_number ?? 0, e => e.Name);

                // var products = db.Cuts
                //     .Where(c => productCodes.Contains(c.code))
                //     .ToDictionary(c => c.code, c => new { c.description, c.standardPrimaryYield });

                // // Combine QC and weight data, group dynamically
                // var combined = qcData.Select(qc =>
                // {
                //     var weights = weightGroups.FirstOrDefault(w => w.station == qc.station && w.cut == qc.product);
                //     return new
                //     {
                //         line = qc.line,
                //         station = qc.station,
                //         product = qc.product,
                //         cutter_number = qc.cutter_number,
                //         aqlScore = qc.aqlScore,
                //         aqlStandard = qc.aqlStandard,
                //         in_lbs = weights?.in_lbs ?? 0,
                //         out_lbs = weights?.out_lbs ?? 0
                //     };
                // }).ToList();

                // // Dynamic grouping
                // var grouped = combined.GroupBy(c =>
                // {
                //     var key = new List<string>();
                //     if (groupByFields.Contains("line")) key.Add(c.line);
                //     if (groupByFields.Contains("station")) key.Add(c.station);
                //     if (groupByFields.Contains("product")) key.Add(c.product);
                //     if (groupByFields.Contains("cutter_number")) key.Add(c.cutter_number.ToString());
                //     return string.Join("|", key);
                // }).Select(g =>
                // {
                //     var first = g.First();
                //     var totalIn = g.Sum(x => x.in_lbs);
                //     var totalOut = g.Sum(x => x.out_lbs);
                //     var yieldPct = totalIn > 0 ? (totalOut / totalIn) * 100 : 0;
                //     var standardYield = products.ContainsKey(first.product) ? (double)products[first.product].standardPrimaryYield : 0;

                //     return new ITrimlineSummaryRes
                //     {
                //         Line = groupByFields.Contains("line") ? first.line : "",
                //         Station = groupByFields.Contains("station") ? first.station : "",
                //         Cutter = groupByFields.Contains("cutter_number") ? first.cutter_number : 0,
                //         CutterName = groupByFields.Contains("cutter_number") && employees.ContainsKey(first.cutter_number) ? employees[first.cutter_number] : "",
                //         Code = groupByFields.Contains("product") ? first.product : "",
                //         Description = groupByFields.Contains("product") && products.ContainsKey(first.product) ? products[first.product].description : "",
                //         In_lbs = totalIn,
                //         Out_lbs = totalOut,
                //         Yield = yieldPct,
                //         StandardYield = standardYield,
                //         PosYield = standardYield > 0 ? (yieldPct / standardYield) * 100 : 0,
                //         AqlScore = (int)g.Average(x => x.aqlScore),
                //         AqlStandard = (int)g.Average(x => x.aqlStandard),
                //         PosAqlScore = 0,
                //         Hours = 0, // TODO: Calculate from punch data
                //         Ppmh = 0, // TODO: Calculate pounds per man hour
                //         Sppmh = 0, // TODO: Standard PPMH
                //         PosPpmh = 0 // TODO: Percentage of standard PPMH
                //     };
                // }).ToList();

                //return Ok(grouped);

                var result = new ITrimlineSummaryRes
                {
                    //  Line = "",
                    Station = "A01",
                    Cutter = 1,
                    CutterName = "Maria",
                    Code = "AGrade",
                    Description = "GradeA Thighs",
                    In_lbs = 100,
                    Out_lbs = 89,
                    Yield = 89,
                    StandardYield = 92,
                    PosYield = 96.7,
                    AqlScore = 81,
                    AqlStandard = 85,
                    PosAqlScore = 95,
                    Hours = 8, // TODO: Calculate from punch data
                    Ppmh = 12.5, // TODO: Calculate pounds per man hour
                    Sppmh = 10, // TODO: Standard PPMH
                    PosPpmh = 125 // TODO: Percentage of standard PPMH
                };


                var result2 = new ITrimlineSummaryRes
                {
                    //  Line = "",
                    Station = "A02",
                    Cutter = 2,
                    CutterName = "Jose",
                    Code = "Downgrade",
                    Description = "GradeB Thighs",
                    In_lbs = 100,
                    Out_lbs = 89,
                    Yield = 89,
                    StandardYield = 92,
                    PosYield = 96.7,
                    AqlScore = 81,
                    AqlStandard = 85,
                    PosAqlScore = 95,
                    Hours = 8, // TODO: Calculate from punch data
                    Ppmh = 12.5, // TODO: Calculate pounds per man hour
                    Sppmh = 10, // TODO: Standard PPMH
                    PosPpmh = 125 // TODO: Percentage of standard PPMH
                };

                var result3 = new ITrimlineSummaryRes
                {
                    //  Line = "",
                    Station = "A01",
                    Cutter = 1,
                    CutterName = "Maria",
                    Code = "Downgrade",
                    Description = "GradeB Thighs",
                    In_lbs = 100,
                    Out_lbs = 11,
                    Yield = 11,
                    StandardYield = 10,
                    PosYield = 110,
                    AqlScore = 70,
                    AqlStandard = 80,
                    PosAqlScore = 87.5,
                    Hours = 8, // TODO: Calculate from punch data
                    Ppmh = 1.37, // TODO: Calculate pounds per man hour
                    Sppmh = 1, // TODO: Standard PPMH
                    PosPpmh = 73 // TODO: Percentage of standard PPMH
                };

                var resultList = new List<ITrimlineSummaryRes> { result, result2, result3 };

                return Ok(resultList);
            }
            catch (Exception e)
            {
                log.write($"summary error: {e.Message} {e.InnerException?.Message}");
                return StatusCode(500, new List<ITrimlineSummaryRes>());
            }
        }


    }

}