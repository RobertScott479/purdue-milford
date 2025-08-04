using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class removeIdAndserverIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "sizer");

            migrationBuilder.DropColumn(
                name: "ServerIndex",
                table: "floorscale");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "sizer",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "ServerIndex",
                table: "floorscale",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
