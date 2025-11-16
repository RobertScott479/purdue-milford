
using System.ComponentModel.DataAnnotations;



public class ITrimlineSummaryRes
{
    [Required] public string Line { get; set; }
    [Required] public string Station { get; set; }
    [Required] public int Cutter { get; set; }
    [Required] public string CutterName { get; set; }
    [Required] public string Code { get; set; }
    [Required] public string Description { get; set; }
    [Required] public double InLbs { get; set; }
    [Required] public double GradeALbs { get; set; }
    [Required] public double GradeAYield { get; set; }
    [Required] public double SYieldA { get; set; }
    [Required] public double PosYieldA { get; set; }
    [Required] public double GradeBLbs { get; set; }
    [Required] public double GradeBYield { get; set; }
    [Required] public double TotalLbs { get; set; }
    [Required] public double OverallYield { get; set; }
    [Required] public double AqlScore { get; set; }
    [Required] public double AqlStandard { get; set; }
    [Required] public double PosAqlScore { get; set; }
    [Required] public double Hours { get; set; }
    [Required] public double Ppmh { get; set; }
    [Required] public double Sppmh { get; set; }
    [Required] public double PosPpmh { get; set; }
}



public class ITrimlineQASummaryRes
{
    //[Required] public string Line { get; set; }
    [Required] public string Station { get; set; }
    [Required] public string Code { get; set; }
    [Required] public string Description { get; set; }
    [Required] public int Cutter { get; set; }
    [Required] public string CutterName { get; set; }
    [Required] public int Checker { get; set; }
    [Required] public string CheckerName { get; set; }
    [Required] public int AqlScore { get; set; }
    [Required] public int AqlStandard { get; set; }
    [Required] public double AqlPOS { get; set; }
    [Required] public int TotalChecks { get; set; }
    [Required] public int PassedChecks { get; set; }
    [Required] public int PassPercent { get; set; }
    [Required] public int Defects1 { get; set; }
    [Required] public int Defects2 { get; set; }
    [Required] public int Defects3 { get; set; }
    [Required] public int Defects4 { get; set; }
    [Required] public int Defects5 { get; set; }
    [Required] public int Defects6 { get; set; }
    [Required] public int Defects7 { get; set; }
    [Required] public int Defects8 { get; set; }
    [Required] public int Defects9 { get; set; }
    [Required] public int Defects10 { get; set; }
    [Required] public int AvgInspectionTime { get; set; }
    [Required] public int Weight { get; set; }
    [Required] public int TotalDefects { get; set; }
    [Required] public int SampleCount { get; set; }
}




public class QcResults
{
    [Required] public int Id { get; set; }
    [Required] public int checker_cutter_number { get; set; }
    [Required] public string product { get; set; }
    [Required] public int bank { get; set; }
    [Required] public string cut { get; set; }
    [Required] public int cutter_number { get; set; }
    [Required] public int cycle { get; set; }
    [Required] public string station { get; set; }
    [Required] public int timestamp { get; set; }
    [Required] public double weight { get; set; }
    [Required] public int defect_0 { get; set; }
    [Required] public int defect_1 { get; set; }
    [Required] public int defect_2 { get; set; }
    [Required] public int defect_3 { get; set; }
    [Required] public int defect_4 { get; set; }
    [Required] public int defect_5 { get; set; }
    [Required] public int defect_6 { get; set; }
    [Required] public int defect_7 { get; set; }
    [Required] public int defect_8 { get; set; }
    [Required] public int defect_9 { get; set; }
    [Required] public double inspect_time { get; set; }
    [Required] public int pass { get; set; }
    [Required] public int fail { get; set; }
    [Required] public int cancel { get; set; }
    public string pieces { get; set; } = string.Empty;
    public string finished_po { get; set; } = string.Empty;
    public double aqlScore { get; set; }
    public double aqlStandard { get; set; }
    public int sampleCount { get; set; }
}



//CREATE TABLE qc_results (checker_cutter_number INTEGER, product TEXT, bank INTEGER, cut TEXT, cutter_number INTEGER, cycle INTEGER, station TEXT, timestamp INTEGER, weight REAL, defect_0 INTEGER, defect_1 INTEGER, defect_2 INTEGER, defect_3 INTEGER, defect_4 INTEGER, defect_5 INTEGER, defect_6 INTEGER, defect_7 INTEGER, defect_8 INTEGER, defect_9 INTEGER, inspect_time REAL, pass INTEGER, fail INTEGER, cancel INTEGER, pieces TEXT DEFAULT '', finished_po TEXT DEFAULT '')