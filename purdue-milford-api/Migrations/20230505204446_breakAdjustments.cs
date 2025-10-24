using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class breakAdjustments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BreakAdjustments",
                columns: table => new
                {
                    Bank = table.Column<string>(type: "TEXT", nullable: false),
                    Adjustment = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BreakAdjustments");
        }
    }
}
