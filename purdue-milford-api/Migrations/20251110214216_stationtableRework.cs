using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class stationtableRework : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "alternate_cutter_number",
                table: "stations");

            migrationBuilder.RenameColumn(
                name: "primary_cutter_number",
                table: "stations",
                newName: "cutter_number");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "cutter_number",
                table: "stations",
                newName: "primary_cutter_number");

            migrationBuilder.AddColumn<int>(
                name: "alternate_cutter_number",
                table: "stations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
