using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class stationtablefieldremoves : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_stations_Station_shift",
                table: "stations");

            migrationBuilder.DropColumn(
                name: "cutter_number",
                table: "stations");

            migrationBuilder.DropColumn(
                name: "shift",
                table: "stations");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "punches");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "cutter_number",
                table: "stations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "shift",
                table: "stations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "punches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_stations_Station_shift",
                table: "stations",
                columns: new[] { "Station", "shift" },
                unique: true);
        }
    }
}
