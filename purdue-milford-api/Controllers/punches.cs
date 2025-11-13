using Microsoft.AspNetCore.Mvc;
using dg_foods_api.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace weightech.Controllers
{
    public class PunchesReqModel
    {
        [Required] public int productionDate { get; set; }
        [Required] public int shift { get; set; }
        [Required] public List<Punches> punches { get; set; }
    }

    public class PunchesResModel
    {
        [Required] public string errorCode { get; set; }
        [Required] public string errorMessage { get; set; }
        [Required] public List<Punches> punches { get; set; }
    }

    [Produces("application/json")]
    [Route("api/punches")]
    [ApiController]
    public class PunchesController : ControllerBase
    {
        private readonly DatabaseContext db;
        private readonly Logger log;

        public PunchesController(IConfiguration configuration, DatabaseContext _db)
        {
            db = _db;
            log = new Logger(configuration, _db, "punches.log");
        }

        [HttpGet("load/{productionDate}/{shift}")]
        public ActionResult<PunchesResModel> LoadPunches(int productionDate, int shift)
        {
            PunchesResModel res = new PunchesResModel
            {
                errorCode = "0",
                errorMessage = "",
                punches = new List<Punches>()
            };

            try
            {
                res.punches = db.Punches
                    .Where(p => p.ProductionDate == productionDate && p.Shift == shift)
                    .OrderBy(p => p.Station)
                    .ThenBy(p => p.Cutter_number)
                    .ToList();

                log.write($"LoadPunches - Production Date: {productionDate}, Shift: {shift}, Count: {res.punches.Count}");
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
                log.write($"LoadPunches error: {res.errorMessage}");
            }

            return Ok(res);
        }

        [HttpPost("save/{productionDate}/{shift}")]
        public ActionResult<ErrorResModel> SavePunches(int productionDate, int shift, [FromBody] PunchesReqModel req)
        {
            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };

            try
            {
                db.Database.BeginTransaction();

                // Remove existing punches for this production date
                var existingPunches = db.Punches
                    .Where(p => p.ProductionDate == productionDate && p.Shift == shift)
                    .ToList();

                if (existingPunches.Any())
                {
                    db.Punches.RemoveRange(existingPunches);
                }

                // Add new punches
                if (req.punches != null && req.punches.Any())
                {
                    foreach (var punch in req.punches)
                    {

                        punch.Id = null;
                        punch.updateAt = Convert.ToInt32(DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                        db.Punches.Add(punch);
                    }
                }

                db.SaveChanges();
                db.Database.CommitTransaction();

                log.write($"SavePunches - Production Date: {req.productionDate}, Count: {req.punches?.Count ?? 0}");
            }
            catch (Exception e)
            {
                db.Database.RollbackTransaction();
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
                log.write($"SavePunches error: {res.errorMessage}");
                return StatusCode(500, res.errorMessage);
            }

            return Ok(res);
        }
    }
}
