using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class StationIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_stations",
                table: "stations");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "stations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_stations",
                table: "stations",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_stations_Station_shift",
                table: "stations",
                columns: new[] { "Station", "shift" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_stations",
                table: "stations");

            migrationBuilder.DropIndex(
                name: "IX_stations_Station_shift",
                table: "stations");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "stations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_stations",
                table: "stations",
                column: "Station");
        }
    }
}
