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
namespace api_philly.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {

        //  private readonly string filePath;
        private readonly DatabaseContext db;
        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public EmployeesController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            //  filePath = configuration["filepath"];
            db = _db;
        }

        // [HttpGet("loademployeesfile")]
        // public async Task<ActionResult<EmployeesResModel>> loademployeesfile()
        // {

        //     var res = new EmployeesResModel();
        //     try
        //     {
        //         var fileToRead = Path.Combine(this.filePath, "employees.json");
        //         if (System.IO.File.Exists(fileToRead))
        //         {
        //             var json = await System.IO.File.ReadAllTextAsync(fileToRead);
        //             res.employees = JsonConvert.DeserializeObject<EmployeesRootModel>(json).employees;
        //             res.errorCode = "0";
        //             res.errorMessage = "";
        //         }
        //         else
        //         {
        //             res.errorCode = "1";
        //             res.errorMessage = "Unable to load employees.json.  This file is missing!";
        //         }

        //     }
        //     catch (Exception e)
        //     {
        //         res.errorCode = "1";
        //         res.errorMessage =  e.Message + " " + e.InnerException?.Message;
        //     }

        //     return Ok(res);
        // }

        // [HttpPost("saveemployeesfile")]
        // public async Task<ActionResult<ErrorResModel>> saveemployeesfile([FromBody] EmployeesRootModel req)
        // {
        //     ErrorResModel res = new ErrorResModel();

        //     try
        //     {
        //         if (!Directory.Exists(filePath))
        //         {
        //             DirectoryInfo di = Directory.CreateDirectory(filePath);
        //         }

        //         var fileToWrite = Path.Combine(this.filePath, "employees.json");
        //         // Console.Write(fileToWrite);                           
        //         var json = JsonConvert.SerializeObject(req);
        //         await System.IO.File.WriteAllTextAsync(fileToWrite, json);
        //         res.errorCode = "0";
        //         res.errorMessage = "";
        //     }
        //     catch (Exception e)
        //     {
        //         Console.WriteLine("The process failed: {0}", e.ToString());
        //         res.errorCode = "1";
        //         res.errorMessage =  e.Message + " " + e.InnerException?.Message;
        //     }


        //     return Ok(res);
        // }


        [HttpGet("loademployees")]
        public ActionResult<EmployeesResModel> loademployees()
        {

            var res = new EmployeesResModel();
            res.errorCode = "0";
            res.errorMessage = "";
            try
            {
                var e = db.Employees.ToList();
                var q = db.Employees.Select(u =>
                    new EmployeeModel { cutter_number = u.Cutter_number, name = u.Name, role = u.Role, enabled = Convert.ToBoolean(u.Enabled == "1" ? true : false), shift = Convert.ToInt32(u.Shift), employeeCategory = u.EmployeeCategory, hireDate = u.HireDate }
                ).ToList();

                res.employees = q;
            }
            catch (Exception e)
            {
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }

            return Ok(res);
        }

        [HttpPost("saveemployees")]
        public ActionResult<ErrorResModel> saveemployees([FromBody] EmployeesRootModel req)
        {
            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            db.Database.BeginTransaction();

            try
            {
                //var all = from c in db.Employees select c;
                db.Employees.RemoveRange(db.Employees);
                db.SaveChanges();
                req.employees.ForEach(e =>
               {
                   var employee = new Employee
                   {
                       Cutter_number = e.cutter_number,
                       Name = e.name,
                       Role = e.role,
                       Shift = e.shift.ToString(),
                       Enabled = e.enabled == true ? "1" : "0",
                       EmployeeCategory = e.employeeCategory,
                       HireDate = e.hireDate
                   };
                   db.Employees.Add(employee);

               });
                db.SaveChanges();
                db.Database.CommitTransaction();
            }
            catch (Exception e)
            {
                db.Database.RollbackTransaction();
                Console.WriteLine("The process failed: {0}", e.ToString());
                res.errorCode = "1";
                res.errorMessage = e.Message + " " + e.InnerException?.Message;
            }


            return Ok(res);
        }








    }
}