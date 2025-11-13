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

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class trimlineController : ControllerBase
    {
        private readonly DatabaseContext db;
        // private readonly string filePath;
        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public trimlineController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            // filePath = configuration["filepath"];
            db = _db;
        }


        // Add methods for trimlineController here


    }

}