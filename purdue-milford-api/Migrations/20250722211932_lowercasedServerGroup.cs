using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class lowercasedServerGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ServerGroup",
                table: "hopper",
                newName: "serverGroup");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "serverGroup",
                table: "hopper",
                newName: "ServerGroup");
        }
    }
}
