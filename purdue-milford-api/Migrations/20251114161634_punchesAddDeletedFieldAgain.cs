using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class punchesAddDeletedFieldAgain : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "deleted",
                table: "punches",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deleted",
                table: "punches");
        }
    }
}
