using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class renamePunchesField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "station",
                table: "punches",
                newName: "Station");

            migrationBuilder.RenameColumn(
                name: "shift",
                table: "punches",
                newName: "Shift");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "punches",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "cutter_number",
                table: "punches",
                newName: "Cutter_number");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "punches",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "update_by",
                table: "punches",
                newName: "updateBy");

            migrationBuilder.RenameColumn(
                name: "update_at",
                table: "punches",
                newName: "updateAt");

            migrationBuilder.RenameColumn(
                name: "punch_out",
                table: "punches",
                newName: "PunchOut");

            migrationBuilder.RenameColumn(
                name: "punch_in",
                table: "punches",
                newName: "PunchIn");

            migrationBuilder.RenameColumn(
                name: "production_date",
                table: "punches",
                newName: "ProductionDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Station",
                table: "punches",
                newName: "station");

            migrationBuilder.RenameColumn(
                name: "Shift",
                table: "punches",
                newName: "shift");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "punches",
                newName: "notes");

            migrationBuilder.RenameColumn(
                name: "Cutter_number",
                table: "punches",
                newName: "cutter_number");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "punches",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "updateBy",
                table: "punches",
                newName: "update_by");

            migrationBuilder.RenameColumn(
                name: "updateAt",
                table: "punches",
                newName: "update_at");

            migrationBuilder.RenameColumn(
                name: "PunchOut",
                table: "punches",
                newName: "punch_out");

            migrationBuilder.RenameColumn(
                name: "PunchIn",
                table: "punches",
                newName: "punch_in");

            migrationBuilder.RenameColumn(
                name: "ProductionDate",
                table: "punches",
                newName: "production_date");
        }
    }
}
