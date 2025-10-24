using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class cutname : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "description",
                table: "Cuts");

            migrationBuilder.RenameColumn(
                name: "productKey",
                table: "Cuts",
                newName: "cutName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "cutName",
                table: "Cuts",
                newName: "productKey");

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "Cuts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
