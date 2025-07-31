using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class bagsweight2net : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "timestamp",
                table: "bags",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "bags",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "serial",
                table: "bags",
                newName: "Serial");

            migrationBuilder.RenameColumn(
                name: "weight",
                table: "bags",
                newName: "Net_lb");

            migrationBuilder.RenameColumn(
                name: "low",
                table: "bags",
                newName: "Low_limit");

            migrationBuilder.RenameColumn(
                name: "high",
                table: "bags",
                newName: "High_limit");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "bags",
                newName: "timestamp");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "bags",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Serial",
                table: "bags",
                newName: "serial");

            migrationBuilder.RenameColumn(
                name: "Net_lb",
                table: "bags",
                newName: "weight");

            migrationBuilder.RenameColumn(
                name: "Low_limit",
                table: "bags",
                newName: "low");

            migrationBuilder.RenameColumn(
                name: "High_limit",
                table: "bags",
                newName: "high");
        }
    }
}
