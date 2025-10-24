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
    public class UsersController : ControllerBase
    {

        //  private readonly string filePath;
        private readonly DatabaseContext db;
        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public UsersController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
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

        [HttpPost("loginuser")]
        public ActionResult<UserModel> loginuser([FromBody] UserLoginModel req)
        {

            var user = db.Users.FirstOrDefault<UserModel>(e => e.username == req.username && e.password == req.password);
            if (user != null)
            {
                var res = new UserResModel();
                res.user = user;
                return Ok(res);
            }
            else
            {
                return NotFound();
            }

        }



        [HttpGet("loadusers")]
        public ActionResult<UsersModel> loadusers()
        {
            // var users = db.Users.Select(u =>
            //     new UserModel { username=u.username,firstName=u.firstName,lastName=u.lastName,password=u.password }
            // ).ToList();

            var res = new UsersModel();
            res.users = db.Users.ToList<UserModel>();
            return Ok(res);
        }

        [HttpPost("saveusers")]
        public ActionResult<ErrorResModel> saveusers([FromBody] UsersModel req)
        {
            ErrorResModel res = new ErrorResModel { errorCode = "0", errorMessage = "" };
            db.Database.BeginTransaction();


            db.Users.RemoveRange(db.Users);
            db.SaveChanges();
            req.users.ForEach(e =>
           {
               var user = new UserModel
               {
                   username = e.username,
                   firstName = e.firstName,
                   roles = e.roles,
                   lastName = e.lastName,
                   password = e.password
               };
               db.Users.Add(user);

           });
            db.SaveChanges();
            db.Database.CommitTransaction();
            return Ok(res);
        }
    }

}