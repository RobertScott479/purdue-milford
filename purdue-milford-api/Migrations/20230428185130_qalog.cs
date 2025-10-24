using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class qalog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "qalog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    checker_cutter_number = table.Column<int>(type: "INTEGER", nullable: false),
                    cutter_number = table.Column<int>(type: "INTEGER", nullable: false),
                    product = table.Column<string>(type: "TEXT", nullable: false),
                    cut = table.Column<string>(type: "TEXT", nullable: false),
                    station = table.Column<string>(type: "TEXT", nullable: false),
                    weight = table.Column<double>(type: "REAL", nullable: false),
                    index = table.Column<string>(type: "TEXT", nullable: false),
                    timestamp = table.Column<int>(type: "INTEGER", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_qalog", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "qalog");
        }
    }
}
