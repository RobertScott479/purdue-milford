using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace dg_foods_api.Models
{

    public class EmployeesRootModel
    {
        [Required] public List<EmployeeModel> employees { get; set; }
    }

    public class EmployeeModel
    {
        [Required] public bool enabled { get; set; }
        [Required] public string name { get; set; }
        public string employeeCategory { get; set; }
        [Required] public string role { get; set; }
        [Required] public int shift { get; set; }
        [Required] public int cutter_number { get; set; }
        public string hireDate { get; set; }
    }



    public class EmployeesResModel
    {
        [Required] public string errorCode { get; set; }
        [Required] public string errorMessage { get; set; }
        [Required] public List<EmployeeModel> employees { get; set; }
    }



    public class CheckerLoginResModel
    {
        [Required] public string errorCode { get; set; }
        [Required] public string errorMessage { get; set; }
        [Required] public EmployeeModel checker { get; set; }
    }

}