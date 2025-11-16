using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class dbCleanup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "banks");

            migrationBuilder.DropTable(
                name: "banks2");

            migrationBuilder.DropTable(
                name: "BreakAdjustments");

            migrationBuilder.DropTable(
                name: "checkers");

            migrationBuilder.DropTable(
                name: "dumps");

            migrationBuilder.DropTable(
                name: "qalog");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "banks",
                columns: table => new
                {
                    code = table.Column<string>(type: "text", nullable: true),
                    vector = table.Column<long>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "banks2",
                columns: table => new
                {
                    code = table.Column<string>(type: "TEXT", nullable: true),
                    new_code = table.Column<string>(type: "TEXT", nullable: true),
                    vector = table.Column<long>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "BreakAdjustments",
                columns: table => new
                {
                    bank = table.Column<int>(type: "INTEGER", nullable: false),
                    adjustment = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BreakAdjustments", x => x.bank);
                });

            migrationBuilder.CreateTable(
                name: "checkers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_checkers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dumps",
                columns: table => new
                {
                    cut = table.Column<string>(type: "TEXT", nullable: true),
                    station = table.Column<string>(type: "TEXT", nullable: true),
                    timestamp = table.Column<string>(type: "TEXT", nullable: true),
                    vector = table.Column<string>(type: "TEXT", nullable: true),
                    weight = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "qalog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    checker_cutter_number = table.Column<int>(type: "INTEGER", nullable: false),
                    cut = table.Column<string>(type: "TEXT", nullable: false),
                    cutter_number = table.Column<int>(type: "INTEGER", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    index = table.Column<int>(type: "INTEGER", nullable: false),
                    inspectionTime = table.Column<double>(type: "REAL", nullable: false),
                    product = table.Column<string>(type: "TEXT", nullable: false),
                    station = table.Column<string>(type: "TEXT", nullable: false),
                    timestamp = table.Column<int>(type: "INTEGER", nullable: false),
                    weight = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_qalog", x => x.Id);
                });
        }
    }
}
