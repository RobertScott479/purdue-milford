using Microsoft.AspNetCore.Mvc;

using dg_foods_api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

public class Logger
{

    private readonly string filePath;
    private readonly string fileName;
    private readonly DatabaseContext db;

    public Logger(IConfiguration configuration, DatabaseContext _db, string _logFileName)
    {
        db = _db;
        filePath = configuration["filepath"];
        fileName = _logFileName;
    }

    public void write(string logEntry)
    {
        try
        {
            Console.WriteLine(logEntry);
            // if (!Directory.Exists(filePath))
            // {
            //     DirectoryInfo di = Directory.CreateDirectory(filePath);
            // }

            // var fileToWrite = Path.Combine(Path.Combine(this.filePath, this.fileName));
            // // Console.Write(fileToWrite);                           
            // //var json = JsonConvert.SerializeObject(req);
            // using (StreamWriter sw = File.AppendText(fileToWrite))
            // {
            //     var logDate = DateTime.Now.ToString("M/dd/yy hh:mm:ss:fff");
            //     sw.WriteLine(logDate + "\t" + logEntry);
            // }

        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());

        }
        return;

    }
}