using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class AddPunchesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "punches",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    production_date = table.Column<int>(type: "INTEGER", nullable: false),
                    cutter_number = table.Column<int>(type: "INTEGER", nullable: false),
                    station = table.Column<string>(type: "TEXT", nullable: false),
                    punch_in = table.Column<int>(type: "INTEGER", nullable: false),
                    punch_out = table.Column<int>(type: "INTEGER", nullable: true),
                    notes = table.Column<string>(type: "TEXT", nullable: true),
                    update_by = table.Column<string>(type: "TEXT", nullable: false),
                    update_at = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_punches", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "punches");
        }
    }
}
