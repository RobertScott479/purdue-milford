// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc;
// using dg_foods_api.Models;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Hosting;

// namespace api_philly.Controllers
// {
//     [Produces("application/json")]
//     [Route("api/[controller]")]
//     [ApiController]
//     public class StationController : ControllerBase
//     {
//         private readonly DatabaseContext db;

//         public StationController(DatabaseContext _db)
//         {
//             db = _db;
//         }

//         [HttpGet("loadstations")]
//         public ActionResult<StationsResModel> loadStations()
//         {

//             var res = new StationsResModel();
//             res.errorCode = "0";
//             res.errorMessage = "";
//             try
//             {
//                 var q = db.Stations.Select(u =>
//                     new StationModel { station = u.Station, employeeName = u.Name, shift = Convert.ToInt32(u.Shift), enabled = Convert.ToBoolean(u.Enabled), Id = u.Id }
//                 ).ToList();

//                 res.stations = q;
//             }
//             catch (Exception e)
//             {
//                 res.errorCode = "1";
//                 res.errorMessage =  e.Message + " " + e.InnerException?.Message;
//             }

//             return Ok(res);
//         }

//         [HttpPost("savestations")]
//         public ActionResult<ErrorResModel> saveStations([FromBody] StationsRootModel req)
//         {

//             ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };

//             try
//             {
//                 db.Database.BeginTransaction();
//                 req.stations.ForEach((Action<StationModel>)(e =>
//                {
//                    var station = new StationModel
//                    {
//                        Id = e.Id,
//                        Name = e.employeeName,
//                        Shift = e.shift.ToString(),
//                        Enabled = Convert.ToInt32(e.enabled),
//                        Station = e.station
//                    };
//                    db.Stations.Update(station);
//                }));

//                 db.SaveChanges();
//                 db.Database.CommitTransaction();
//             }
//             catch (Exception e)
//             {
//                 db.Database.RollbackTransaction();
//                 Console.WriteLine("The process failed: {0}", e.ToString());
//                 res.errorCode = "1";
//                 res.errorMessage =  e.Message + " " + e.InnerException?.Message;
//             }
//             return Ok(res);
//         }

//     }
// }