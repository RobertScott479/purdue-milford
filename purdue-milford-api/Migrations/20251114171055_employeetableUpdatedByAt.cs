using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class employeetableUpdatedByAt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "employee_category",
                table: "employees");

            migrationBuilder.RenameColumn(
                name: "shift",
                table: "employees",
                newName: "Shift");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "employees",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "enabled",
                table: "employees",
                newName: "Enabled");

            migrationBuilder.RenameColumn(
                name: "cutter_number",
                table: "employees",
                newName: "Cutter_number");

            migrationBuilder.RenameColumn(
                name: "hire_date",
                table: "employees",
                newName: "updateBy");

            migrationBuilder.AddColumn<int>(
                name: "updateAt",
                table: "employees",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "updateAt",
                table: "employees");

            migrationBuilder.RenameColumn(
                name: "Shift",
                table: "employees",
                newName: "shift");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "employees",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Enabled",
                table: "employees",
                newName: "enabled");

            migrationBuilder.RenameColumn(
                name: "Cutter_number",
                table: "employees",
                newName: "cutter_number");

            migrationBuilder.RenameColumn(
                name: "updateBy",
                table: "employees",
                newName: "hire_date");

            migrationBuilder.AddColumn<string>(
                name: "employee_category",
                table: "employees",
                type: "TEXT",
                nullable: true);
        }
    }
}
