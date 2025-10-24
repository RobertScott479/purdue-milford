using Microsoft.AspNetCore.Mvc;

using dg_foods_api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Globalization;

namespace api_philly.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DatabaseContext db;
        //  private readonly string filePath;
        // dg_foods_api.Data.ProductsDatabaseAccess products;

        public ProductsController(IConfiguration configuration, IHostEnvironment env, DatabaseContext _db)
        {
            // filePath = configuration["filepath"];
            // var connStr = configuration["ConnectionStrings:ConnectionStr"];
            db = _db;
            //   products = new ProductsDatabaseAccess(connStr);

        }

        // [HttpGet("loadproductsfile")]
        // public async Task<ActionResult<ProductsResModel>> loadproductsfile()
        // {
        //     var res = new ProductsResModel();
        //     try
        //     {
        //         var fileToRead = Path.Combine(this.filePath, "products.json");
        //         if (System.IO.File.Exists(fileToRead))
        //         {
        //             var json = await System.IO.File.ReadAllTextAsync(fileToRead);
        //             res.products = JsonConvert.DeserializeObject<ProductsRootModel>(json).products;
        //             res.errorCode = "0";
        //             res.errorMessage = "";
        //         }
        //         else
        //         {
        //             res.errorCode = "1";
        //             res.errorMessage = "Unable to load products.json.  This file is missing!";
        //         }

        //     }
        //     catch (Exception e)
        //     {
        //         res.errorCode = "1";
        //         res.errorMessage =  e.Message + " " + e.InnerException?.Message;
        //     }
        //     return Ok(res);
        // }

        // [HttpPost("saveproductsfile")]
        // public async Task<ActionResult<ErrorResModel>> saveproductsfile([FromBody] ProductsRootModel req)
        // {
        //     ErrorResModel res = new ErrorResModel();

        //     try
        //     {
        //         if (!Directory.Exists(filePath))
        //         {
        //             DirectoryInfo di = Directory.CreateDirectory(filePath);
        //         }

        //         var fileToWrite = Path.Combine(this.filePath, "products.json");
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

        [HttpGet("loadCuts")]
        public ActionResult<CutsResModel> loadCuts()
        {
            var res = new CutsResModel();
            res.errorCode = "0";
            res.errorMessage = "";
            res.cuts = db.Cuts.ToList();
            return Ok(res);
        }



        [HttpPost("saveCuts")]
        public ActionResult<ErrorResModel> saveCuts([FromBody] CutModel[] req)
        {
            ErrorResModel res = new ErrorResModel();

            // try
            // {
            db.Database.BeginTransaction();
            db.Cuts.RemoveRange(db.Cuts);
            db.Cuts.AddRange(req);
            db.SaveChanges();
            db.Database.CommitTransaction();
            // }
            // catch (Exception e)
            // {
            //     db.Database.RollbackTransaction();
            //     Console.WriteLine("The process failed: {0}", e.ToString());
            //     res.errorCode = "1";
            //     res.errorMessage = e.Message + " " + e.InnerException?.Message;
            // }
            return Ok(res);
        }


        // [HttpPost("saveproducts")]
        // public ActionResult<ErrorResModel> saveproducts([FromBody] ProductsRootModel req)
        // {

        //     ErrorResModel res = new ErrorResModel();
        //     res.errorCode = "0";
        //     res.errorMessage = "";

        //     try
        //     {
        //         db.Database.BeginTransaction();
        //         // var all = from c in db.Products select c;
        //         db.Products.RemoveRange(db.Products);
        //         // db.SaveChanges();

        //         req.products.ForEach(e =>
        //         {
        //             var product = new Product
        //             {
        //                 Key = e.productKey,
        //                 Code = e.code,
        //                 Description = e.description,
        //                 PrimaryRate = e.primary_rate.ToString(),
        //                 Cut1Rate = e.cut_1_rate.ToString(),
        //                 Cut2Rate = e.cut_2_rate.ToString(),
        //                 Pattern = e.pattern,
        //                 Cut1Name = e.cut_1_name
        //             ,
        //                 Cut2Name = e.cut_2_name
        //             ,
        //                 PrimaryName = e.primary_name
        //             ,
        //                 PPMH = e.ppmh
        //             ,

        //                 PieceCount = Convert.ToDouble(e.pieceCount),
        //                 PieceCount1 = Convert.ToDouble(e.pieceCount1),
        //                 PieceCount2 = Convert.ToDouble(e.pieceCount2),

        //                 PieceWeightMin = Convert.ToDouble(e.pieceWeightMin),
        //                 PieceWeightMin1 = Convert.ToDouble(e.pieceWeightMin1),
        //                 PieceWeightMin2 = Convert.ToDouble(e.pieceWeightMin2),

        //                 PieceWeightMax = Convert.ToDouble(e.pieceWeightMax),
        //                 PieceWeightMax1 = Convert.ToDouble(e.pieceWeightMax1),
        //                 PieceWeightMax2 = Convert.ToDouble(e.pieceWeightMax2),



        //                 //PRIMARY
        //                 PassScore = Convert.ToDouble(e.passScore)
        //             ,
        //                 D1 = Convert.ToDouble(e.demerits1)
        //             ,
        //                 D2 = Convert.ToDouble(e.demerits2)
        //             ,
        //                 D3 = Convert.ToDouble(e.demerits3)
        //             ,
        //                 D4 = Convert.ToDouble(e.demerits4)
        //             ,
        //                 D5 = Convert.ToDouble(e.demerits5)
        //             ,
        //                 D6 = Convert.ToDouble(e.demerits6)
        //             ,
        //                 D7 = Convert.ToDouble(e.demerits7)
        //             ,
        //                 D8 = Convert.ToDouble(e.demerits8)
        //             ,
        //                 D9 = Convert.ToDouble(e.demerits9)
        //             ,
        //                 D10 = Convert.ToDouble(e.demerits10)
        //             ,
        //                 DName1 = e.demeritDescription1
        //             ,
        //                 DName2 = e.demeritDescription2
        //             ,
        //                 DName3 = e.demeritDescription3
        //             ,
        //                 DName4 = e.demeritDescription4
        //             ,
        //                 DName5 = e.demeritDescription5
        //             ,
        //                 DName6 = e.demeritDescription6
        //             ,
        //                 DName7 = e.demeritDescription7
        //             ,
        //                 DName8 = e.demeritDescription8
        //             ,
        //                 DName9 = e.demeritDescription9
        //             ,
        //                 DName10 = e.demeritDescription10,


        //                 //CUT 1
        //                 PassScore1 = Convert.ToDouble(e.passScore1)
        //             ,
        //                 D11 = Convert.ToDouble(e.demerits11)
        //             ,
        //                 D12 = Convert.ToDouble(e.demerits12)
        //             ,
        //                 D13 = Convert.ToDouble(e.demerits13)
        //             ,
        //                 D14 = Convert.ToDouble(e.demerits14)
        //             ,
        //                 D15 = Convert.ToDouble(e.demerits15)
        //             ,
        //                 D16 = Convert.ToDouble(e.demerits16)
        //             ,
        //                 D17 = Convert.ToDouble(e.demerits17)
        //             ,
        //                 D18 = Convert.ToDouble(e.demerits18)
        //             ,
        //                 D19 = Convert.ToDouble(e.demerits19)
        //             ,
        //                 D20 = Convert.ToDouble(e.demerits20)
        //             ,
        //                 DName11 = e.demeritDescription11
        //             ,
        //                 DName12 = e.demeritDescription12
        //             ,
        //                 DName13 = e.demeritDescription13
        //             ,
        //                 DName14 = e.demeritDescription14
        //             ,
        //                 DName15 = e.demeritDescription15
        //             ,
        //                 DName16 = e.demeritDescription16
        //             ,
        //                 DName17 = e.demeritDescription17
        //             ,
        //                 DName18 = e.demeritDescription18
        //             ,
        //                 DName19 = e.demeritDescription19
        //             ,
        //                 DName20 = e.demeritDescription20
        //             ,


        //                 //CUT 2
        //                 PassScore2 = Convert.ToDouble(e.passScore2)
        //             ,
        //                 D21 = Convert.ToDouble(e.demerits21)
        //             ,
        //                 D22 = Convert.ToDouble(e.demerits22)
        //             ,
        //                 D23 = Convert.ToDouble(e.demerits23)
        //             ,
        //                 D24 = Convert.ToDouble(e.demerits24)
        //             ,
        //                 D25 = Convert.ToDouble(e.demerits25)
        //             ,
        //                 D26 = Convert.ToDouble(e.demerits26)
        //             ,
        //                 D27 = Convert.ToDouble(e.demerits27)
        //             ,
        //                 D28 = Convert.ToDouble(e.demerits28)
        //             ,
        //                 D29 = Convert.ToDouble(e.demerits29)
        //             ,
        //                 D30 = Convert.ToDouble(e.demerits30)
        //             ,
        //                 DName21 = e.demeritDescription21
        //             ,
        //                 DName22 = e.demeritDescription22
        //             ,
        //                 DName23 = e.demeritDescription23
        //             ,
        //                 DName24 = e.demeritDescription24
        //             ,
        //                 DName25 = e.demeritDescription25
        //             ,
        //                 DName26 = e.demeritDescription26
        //             ,
        //                 DName27 = e.demeritDescription27
        //             ,
        //                 DName28 = e.demeritDescription28
        //             ,
        //                 DName29 = e.demeritDescription29
        //             ,
        //                 DName30 = e.demeritDescription30


        //             };
        //             db.Products.Add(product);

        //         });

        //         db.SaveChanges();
        //         db.Database.CommitTransaction();
        //     }
        //     catch (Exception e)
        //     {
        //         db.Database.RollbackTransaction();
        //         Console.WriteLine("The process failed: {0}", e.ToString());
        //         res.errorCode = "1";
        //         res.errorMessage = e.Message + " " + e.InnerException?.Message;
        //     }


        //     return Ok(res);
        // }



        // [HttpGet("loadproducts")]
        // public ActionResult<ProductsResModel> loadproducts()
        // {
        //     var res = new ProductsResModel();
        //     res.errorCode = "0";
        //     res.errorMessage = "";

        //     // NumberFormatInfo provider = new NumberFormatInfo();
        //     // provider.NumberDecimalSeparator = ".";
        //     // provider.NumberGroupSeparator = ",";
        //     //.Where(u => u.Code == "90801")
        //     var q = db.Products.ToList().Select(u =>
        //      new ProductModel
        //      {
        //          productKey = u.Key,
        //          code = u.Code,
        //          primary_rate = Convert.ToDecimal(u.PrimaryRate),
        //          cut_1_rate = Convert.ToDecimal(u.Cut1Rate),
        //          cut_2_rate = Convert.ToDecimal(u.Cut2Rate),
        //          description = u.Description,
        //          pattern = u.Pattern,
        //          ppmh = u.PPMH,

        //          cut_1_name = u.Cut1Name
        //     ,
        //          cut_2_name = u.Cut2Name
        //     ,
        //          primary_name = u.PrimaryName
        //     ,

        //          pieceCount = Convert.ToDecimal(u.PieceCount),
        //          pieceCount1 = Convert.ToDecimal(u.PieceCount1),
        //          pieceCount2 = Convert.ToDecimal(u.PieceCount2),

        //          pieceWeightMin = Convert.ToDecimal(u.PieceWeightMin),
        //          pieceWeightMin1 = Convert.ToDecimal(u.PieceWeightMin1),
        //          pieceWeightMin2 = Convert.ToDecimal(u.PieceWeightMin2),

        //          pieceWeightMax = Convert.ToDecimal(u.PieceWeightMax),
        //          pieceWeightMax1 = Convert.ToDecimal(u.PieceWeightMax1),
        //          pieceWeightMax2 = Convert.ToDecimal(u.PieceWeightMax2),


        //          //PRIMARY
        //          passScore = Convert.ToDecimal(u.PassScore)
        //      ,
        //          demeritDescription1 = u.DName1,
        //          demerits1 = Convert.ToDecimal(u.D1)
        //      ,
        //          demeritDescription2 = u.DName2,
        //          demerits2 = Convert.ToDecimal(u.D2)
        //      ,
        //          demeritDescription3 = u.DName3,
        //          demerits3 = Convert.ToDecimal(u.D3)
        //      ,
        //          demeritDescription4 = u.DName4,
        //          demerits4 = Convert.ToDecimal(u.D4)
        //      ,
        //          demeritDescription5 = u.DName5,
        //          demerits5 = Convert.ToDecimal(u.D5)
        //      ,
        //          demeritDescription6 = u.DName6,
        //          demerits6 = Convert.ToDecimal(u.D6)
        //      ,
        //          demeritDescription7 = u.DName7,
        //          demerits7 = Convert.ToDecimal(u.D6)
        //      ,
        //          demeritDescription8 = u.DName8,
        //          demerits8 = Convert.ToDecimal(u.D8)
        //      ,
        //          demeritDescription9 = u.DName9,
        //          demerits9 = Convert.ToDecimal(u.D9)
        //      ,
        //          demeritDescription10 = u.DName10,
        //          demerits10 = Convert.ToDecimal(u.D10)
        //     ,


        //          //CUT 1
        //          passScore1 = Convert.ToDecimal(u.PassScore1)
        //      ,
        //          demeritDescription11 = u.DName11,
        //          demerits11 = Convert.ToDecimal(u.D11)
        //      ,
        //          demeritDescription12 = u.DName12,
        //          demerits12 = Convert.ToDecimal(u.D12)
        //      ,
        //          demeritDescription13 = u.DName13,
        //          demerits13 = Convert.ToDecimal(u.D13)
        //      ,
        //          demeritDescription14 = u.DName14,
        //          demerits14 = Convert.ToDecimal(u.D14)
        //      ,
        //          demeritDescription15 = u.DName15,
        //          demerits15 = Convert.ToDecimal(u.D15)
        //      ,
        //          demeritDescription16 = u.DName16,
        //          demerits16 = Convert.ToDecimal(u.D16)
        //      ,
        //          demeritDescription17 = u.DName17,
        //          demerits17 = Convert.ToDecimal(u.D17)
        //      ,
        //          demeritDescription18 = u.DName18,
        //          demerits18 = Convert.ToDecimal(u.D18)
        //      ,
        //          demeritDescription19 = u.DName19,
        //          demerits19 = Convert.ToDecimal(u.D19)
        //      ,
        //          demeritDescription20 = u.DName20,
        //          demerits20 = Convert.ToDecimal(u.D20)
        //    ,


        //          //CUT 2
        //          passScore2 = Convert.ToDecimal(u.PassScore2)
        //      ,
        //          demeritDescription21 = u.DName21,
        //          demerits21 = Convert.ToDecimal(u.D21)
        //      ,
        //          demeritDescription22 = u.DName22,
        //          demerits22 = Convert.ToDecimal(u.D22)
        //      ,
        //          demeritDescription23 = u.DName23,
        //          demerits23 = Convert.ToDecimal(u.D23)
        //      ,
        //          demeritDescription24 = u.DName24,
        //          demerits24 = Convert.ToDecimal(u.D24)
        //      ,
        //          demeritDescription25 = u.DName25,
        //          demerits25 = Convert.ToDecimal(u.D25)
        //      ,
        //          demeritDescription26 = u.DName26,
        //          demerits26 = Convert.ToDecimal(u.D26)
        //      ,
        //          demeritDescription27 = u.DName27,
        //          demerits27 = Convert.ToDecimal(u.D27)
        //      ,
        //          demeritDescription28 = u.DName28,
        //          demerits28 = Convert.ToDecimal(u.D28)
        //      ,
        //          demeritDescription29 = u.DName29,
        //          demerits29 = Convert.ToDecimal(u.D29)
        //      ,
        //          demeritDescription30 = u.DName30,
        //          demerits30 = Convert.ToDecimal(u.D30)



        //      }
        //      ).ToList();


        //     res.products = q;
        //     return Ok(res);
        // }



        // [HttpGet("getproducts")]
        // public async Task<ActionResult<ProductsResModel>> getproducts()
        // {
        //     var res = await this.products.getProductsAsync();
        //     return Ok(res);
        // }


        // [HttpPost("addProduct")]
        // public ActionResult<ProductsResModel> addProduct([FromBody] ProductModel req)
        // {
        //     return Ok(products.addProduct(req));
        // }


        // [HttpPut("updateProduct/{productKey}")]
        // public ActionResult<ErrorResModel> updateProduct(int productKey, [FromBody] ProductModel req)
        // {
        //     return Ok(products.updateProduct(productKey, req));
        // }


        // [HttpDelete("deleteProduct/{productKey}")]
        // public ActionResult<ErrorResModel> deleteProduct(int productKey)
        // {
        //     return Ok(products.deleteProduct(productKey));
        // }   



    }
}