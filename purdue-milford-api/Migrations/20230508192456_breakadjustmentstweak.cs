using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class breakadjustmentstweak : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Bank",
                table: "BreakAdjustments",
                newName: "bank");

            migrationBuilder.RenameColumn(
                name: "Adjustment",
                table: "BreakAdjustments",
                newName: "adjustment");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "bank",
                table: "BreakAdjustments",
                newName: "Bank");

            migrationBuilder.RenameColumn(
                name: "adjustment",
                table: "BreakAdjustments",
                newName: "Adjustment");
        }
    }
}
