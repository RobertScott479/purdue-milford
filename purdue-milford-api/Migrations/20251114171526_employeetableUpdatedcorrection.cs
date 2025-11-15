using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class employeetableUpdatedcorrection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "updateBy",
                table: "punches",
                newName: "updatedBy");

            migrationBuilder.RenameColumn(
                name: "updateAt",
                table: "punches",
                newName: "updatedAt");

            migrationBuilder.RenameColumn(
                name: "updateBy",
                table: "employees",
                newName: "updatedBy");

            migrationBuilder.RenameColumn(
                name: "updateAt",
                table: "employees",
                newName: "updatedAt");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "updatedBy",
                table: "punches",
                newName: "updateBy");

            migrationBuilder.RenameColumn(
                name: "updatedAt",
                table: "punches",
                newName: "updateAt");

            migrationBuilder.RenameColumn(
                name: "updatedBy",
                table: "employees",
                newName: "updateBy");

            migrationBuilder.RenameColumn(
                name: "updatedAt",
                table: "employees",
                newName: "updateAt");
        }
    }
}
