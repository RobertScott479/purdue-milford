using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class sizerId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add the Id column as nullable first to avoid constraint issues
            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "sizer",
                type: "INTEGER",
                nullable: true);

            // Step 2: Populate the Id column with sequential values
            migrationBuilder.Sql(@"
                UPDATE sizer 
                SET Id = (
                    SELECT COUNT(*) 
                    FROM sizer s2 
                    WHERE s2.rowid <= sizer.rowid
                )");

            // Step 3: Make the Id column non-nullable and add auto-increment
            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "sizer",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "INTEGER",
                oldNullable: true)
                .Annotation("Sqlite:Autoincrement", true);

            // Step 4: Add the primary key
            migrationBuilder.AddPrimaryKey(
                name: "PK_sizer",
                table: "sizer",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_sizer",
                table: "sizer");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "sizer");
        }
    }
}