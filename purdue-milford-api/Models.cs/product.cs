using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace dg_foods_api.Models
{


    public class ProductsRootModel
    {
        [Required] public List<ProductModel> products { get; set; }
    }

    public class CutModel
    {

        //  [Required] public string productKey { get; set; }
        [Required] public string code { get; set; }
        [Required] public string customer { get; set; }
        [Required] public string description { get; set; }
        [Required] public string cutName { get; set; }
        [Required] public decimal cutRate { get; set; }
        [Required] public decimal PPMH { get; set; } //ppmh std
        [Required] public string pattern { get; set; }
        [Required] public decimal sampleSize { get; set; }
        [Required] public decimal weightMinimum { get; set; }
        [Required] public decimal weightMaximum { get; set; }
        [Required] public decimal wtConfidence { get; set; }
        [Required] public string question1 { get; set; }
        [Required] public string question2 { get; set; }
        [Required] public string question3 { get; set; }
        [Required] public string question4 { get; set; }
        [Required] public string question5 { get; set; }
        [Required] public string question6 { get; set; }
        [Required] public string question7 { get; set; }
        [Required] public string question8 { get; set; }
        [Required] public string question9 { get; set; }
        [Required] public string question10 { get; set; }

        [Required] public decimal q1Confidence { get; set; }
        [Required] public decimal q2Confidence { get; set; }
        [Required] public decimal q3Confidence { get; set; }
        [Required] public decimal q4Confidence { get; set; }
        [Required] public decimal q5Confidence { get; set; }
        [Required] public decimal q6Confidence { get; set; }
        [Required] public decimal q7Confidence { get; set; }
        [Required] public decimal q8Confidence { get; set; }
        [Required] public decimal q9Confidence { get; set; }
        [Required] public decimal q10Confidence { get; set; }
        [Required] public string username { get; set; }
        [Required] public int timestamp { get; set; }
        public decimal standardPrimaryYield { get; set; }
        public decimal aqlScoreStandard { get; set; }
        public decimal weightScoreStandard { get; set; }

    }



    // public class ProductCutsResModel
    // {
    //     [Required] public string errorCode { get; set; } = "0";
    //     [Required] public string errorMessage { get; set; } = "";
    //     [Required] public List<ProductCutsModel> productCuts { get; set; }
    // }


    // public class ProductCutsModel
    // {
    //     [Required] public string code { get; set; }
    //     [Required] public string description { get; set; }
    //     [Required] public string cut1 { get; set; }
    //     [Required] public string cut2 { get; set; }
    //     [Required] public string nugget { get; set; }
    // }


    public class ProductModel
    {
        [Required] public string productKey { get; set; }
        [Required] public string code { get; set; }
        [Required] public decimal cut_1_rate { get; set; }
        [Required] public decimal cut_2_rate { get; set; }
        [Required] public decimal primary_rate { get; set; }
        // [JsonPropertyName("case")]
        // public string Case { get; set; }
        [Required] public string description { get; set; }
        [Required] public string pattern { get; set; }


        [Required] public decimal pieceCount { get; set; }
        [Required] public decimal pieceCount1 { get; set; }
        [Required] public decimal pieceCount2 { get; set; }
        [Required] public decimal pieceWeightMin { get; set; }
        [Required] public decimal pieceWeightMin1 { get; set; }
        [Required] public decimal pieceWeightMin2 { get; set; }

        [Required] public decimal pieceWeightMax { get; set; }
        [Required] public decimal pieceWeightMax1 { get; set; }
        [Required] public decimal pieceWeightMax2 { get; set; }



        //PRIMARY
        [Required] public decimal passScore { get; set; }

        [Required] public string demeritDescription1 { get; set; }
        [Required] public decimal demerits1 { get; set; }

        [Required] public string demeritDescription2 { get; set; }
        [Required] public decimal demerits2 { get; set; }

        [Required] public string demeritDescription3 { get; set; }
        [Required] public decimal demerits3 { get; set; }

        [Required] public string demeritDescription4 { get; set; }
        [Required] public decimal demerits4 { get; set; }

        [Required] public string demeritDescription5 { get; set; }
        [Required] public decimal demerits5 { get; set; }

        [Required] public string demeritDescription6 { get; set; }
        [Required] public decimal demerits6 { get; set; }

        [Required] public string demeritDescription7 { get; set; }
        [Required] public decimal demerits7 { get; set; }

        [Required] public string demeritDescription8 { get; set; }
        [Required] public decimal demerits8 { get; set; }

        [Required] public string demeritDescription9 { get; set; }
        [Required] public decimal demerits9 { get; set; }

        [Required] public string demeritDescription10 { get; set; }
        [Required] public decimal demerits10 { get; set; }





        //CUT 1
        [Required] public decimal passScore1 { get; set; }

        [Required] public string demeritDescription11 { get; set; }
        [Required] public decimal demerits11 { get; set; }

        [Required] public string demeritDescription12 { get; set; }
        [Required] public decimal demerits12 { get; set; }

        [Required] public string demeritDescription13 { get; set; }
        [Required] public decimal demerits13 { get; set; }

        [Required] public string demeritDescription14 { get; set; }
        [Required] public decimal demerits14 { get; set; }

        [Required] public string demeritDescription15 { get; set; }
        [Required] public decimal demerits15 { get; set; }

        [Required] public string demeritDescription16 { get; set; }
        [Required] public decimal demerits16 { get; set; }

        [Required] public string demeritDescription17 { get; set; }
        [Required] public decimal demerits17 { get; set; }

        [Required] public string demeritDescription18 { get; set; }
        [Required] public decimal demerits18 { get; set; }

        [Required] public string demeritDescription19 { get; set; }
        [Required] public decimal demerits19 { get; set; }

        [Required] public string demeritDescription20 { get; set; }
        [Required] public decimal demerits20 { get; set; }


        //CUT 2
        [Required] public decimal passScore2 { get; set; }

        [Required] public string demeritDescription21 { get; set; }
        [Required] public decimal demerits21 { get; set; }

        [Required] public string demeritDescription22 { get; set; }
        [Required] public decimal demerits22 { get; set; }

        [Required] public string demeritDescription23 { get; set; }
        [Required] public decimal demerits23 { get; set; }

        [Required] public string demeritDescription24 { get; set; }
        [Required] public decimal demerits24 { get; set; }

        [Required] public string demeritDescription25 { get; set; }
        [Required] public decimal demerits25 { get; set; }

        [Required] public string demeritDescription26 { get; set; }
        [Required] public decimal demerits26 { get; set; }

        [Required] public string demeritDescription27 { get; set; }
        [Required] public decimal demerits27 { get; set; }

        [Required] public string demeritDescription28 { get; set; }
        [Required] public decimal demerits28 { get; set; }

        [Required] public string demeritDescription29 { get; set; }
        [Required] public decimal demerits29 { get; set; }

        [Required] public string demeritDescription30 { get; set; }
        [Required] public decimal demerits30 { get; set; }



        public string cut_1_name { get; set; }

        public string cut_2_name { get; set; }

        public string primary_name { get; set; }

        [Required] public double ppmh { get; set; }


    }

    public class CutsResModel
    {
        [Required] public string errorCode { get; set; } = "0";
        [Required] public string errorMessage { get; set; } = "";
        [Required] public List<CutModel> cuts { get; set; }

    }


    public class ProductsResModel
    {
        [Required] public string errorCode { get; set; }
        [Required] public string errorMessage { get; set; }
        [Required] public List<ProductModel> products { get; set; }
    }


    // public class CodeChangeReqModel
    // {
    //     public string productCode { get; set; }
    //     public string pattern { get; set; }
    // }


}