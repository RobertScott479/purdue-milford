using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class weight2net : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "timestamp",
                table: "sizer",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "serial",
                table: "sizer",
                newName: "Serial");

            migrationBuilder.RenameColumn(
                name: "scale",
                table: "sizer",
                newName: "Scale");

            migrationBuilder.RenameColumn(
                name: "net_g",
                table: "sizer",
                newName: "Net_g");

            migrationBuilder.RenameColumn(
                name: "gate",
                table: "sizer",
                newName: "Gate");

            migrationBuilder.RenameColumn(
                name: "weight_lb",
                table: "hopper",
                newName: "Weight_lb");

            migrationBuilder.RenameColumn(
                name: "timestamp",
                table: "hopper",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "serverGroup",
                table: "hopper",
                newName: "ServerGroup");

            migrationBuilder.RenameColumn(
                name: "serial",
                table: "hopper",
                newName: "Serial");

            migrationBuilder.RenameColumn(
                name: "gate",
                table: "hopper",
                newName: "Gate");

            migrationBuilder.RenameColumn(
                name: "timestamp",
                table: "floorscale",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "serverGroup",
                table: "floorscale",
                newName: "ServerGroup");

            migrationBuilder.RenameColumn(
                name: "serial",
                table: "floorscale",
                newName: "Serial");

            migrationBuilder.RenameColumn(
                name: "gate",
                table: "floorscale",
                newName: "Gate");

            migrationBuilder.RenameColumn(
                name: "weight_lb",
                table: "floorscale",
                newName: "Net_lb");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "sizer",
                newName: "timestamp");

            migrationBuilder.RenameColumn(
                name: "Serial",
                table: "sizer",
                newName: "serial");

            migrationBuilder.RenameColumn(
                name: "Scale",
                table: "sizer",
                newName: "scale");

            migrationBuilder.RenameColumn(
                name: "Net_g",
                table: "sizer",
                newName: "net_g");

            migrationBuilder.RenameColumn(
                name: "Gate",
                table: "sizer",
                newName: "gate");

            migrationBuilder.RenameColumn(
                name: "Weight_lb",
                table: "hopper",
                newName: "weight_lb");

            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "hopper",
                newName: "timestamp");

            migrationBuilder.RenameColumn(
                name: "ServerGroup",
                table: "hopper",
                newName: "serverGroup");

            migrationBuilder.RenameColumn(
                name: "Serial",
                table: "hopper",
                newName: "serial");

            migrationBuilder.RenameColumn(
                name: "Gate",
                table: "hopper",
                newName: "gate");

            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "floorscale",
                newName: "timestamp");

            migrationBuilder.RenameColumn(
                name: "ServerGroup",
                table: "floorscale",
                newName: "serverGroup");

            migrationBuilder.RenameColumn(
                name: "Serial",
                table: "floorscale",
                newName: "serial");

            migrationBuilder.RenameColumn(
                name: "Gate",
                table: "floorscale",
                newName: "gate");

            migrationBuilder.RenameColumn(
                name: "Net_lb",
                table: "floorscale",
                newName: "weight_lb");
        }
    }
}
