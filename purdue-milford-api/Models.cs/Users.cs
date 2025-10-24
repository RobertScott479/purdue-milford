using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace dg_foods_api.Models
{
    public class UserModel
    {
        // public int id { get; set; }
        [Required] public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        // public string jobTitle { get; set; }
        // public string phone { get; set; }
        [Required] public string roles { get; set; }
        [Required] public string password { get; set; }
        // public string Status { get; set; }
    }

    public class UsersModel
    {
        [Required] public List<UserModel> users { get; set; }
    }


    public class UserLoginModel
    {
        [Required] public string username { get; set; }
        [Required] public string password { get; set; }

    }

    public class UserResModel
    {
        [Required] public UserModel user { get; set; }
    }


}


