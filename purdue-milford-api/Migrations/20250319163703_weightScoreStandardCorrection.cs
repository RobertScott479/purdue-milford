using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class weightScoreStandardCorrection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "weightechScoreStandard",
                table: "Cuts",
                newName: "weightScoreStandard");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "weightScoreStandard",
                table: "Cuts",
                newName: "weightechScoreStandard");
        }
    }
}
