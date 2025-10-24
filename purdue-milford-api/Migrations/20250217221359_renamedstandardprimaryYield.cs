using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class renamedstandardprimaryYield : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "standardPrimaryYieldPercentage",
                table: "Cuts",
                newName: "standardPrimaryYield");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "standardPrimaryYield",
                table: "Cuts",
                newName: "standardPrimaryYieldPercentage");
        }
    }
}
