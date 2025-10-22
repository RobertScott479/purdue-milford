using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class idAndsnewNames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bags");

            migrationBuilder.DropIndex(
                name: "index_timestamp",
                table: "sizer");

            // migrationBuilder.DropIndex(
            //     name: "IX_sizer_serial_timestamp",
            //     table: "sizer");

            migrationBuilder.AlterColumn<long>(
                name: "status_index",
                table: "status_names",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "INTEGER",
                oldNullable: true)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "sizer",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "ServerGroup",
                table: "sizer",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_status_names",
                table: "status_names",
                column: "status_index");

            migrationBuilder.CreateTable(
                name: "caseweigher",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Net_lb = table.Column<double>(type: "REAL", nullable: false),
                    High_limit = table.Column<double>(type: "REAL", nullable: false),
                    Low_limit = table.Column<double>(type: "REAL", nullable: false),
                    Timestamp = table.Column<long>(type: "INTEGER", nullable: false),
                    Serial = table.Column<long>(type: "INTEGER", nullable: false),
                    Status = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_caseweigher", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "index_scale_gate_timestamp",
                table: "sizer",
                columns: new[] { "Scale", "Gate", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_sizer_scale_timestamp",
                table: "sizer",
                columns: new[] { "Scale", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_caseweigher_timestamp",
                table: "caseweigher",
                column: "Timestamp");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "caseweigher");

            migrationBuilder.DropPrimaryKey(
                name: "PK_status_names",
                table: "status_names");

            migrationBuilder.DropIndex(
                name: "index_scale_gate_timestamp",
                table: "sizer");

            migrationBuilder.DropIndex(
                name: "IX_sizer_scale_timestamp",
                table: "sizer");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "sizer");

            migrationBuilder.DropColumn(
                name: "ServerGroup",
                table: "sizer");

            migrationBuilder.AlterColumn<long>(
                name: "status_index",
                table: "status_names",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.CreateTable(
                name: "bags",
                columns: table => new
                {
                    High_limit = table.Column<double>(type: "REAL", nullable: false),
                    Low_limit = table.Column<double>(type: "REAL", nullable: false),
                    Net_lb = table.Column<double>(type: "REAL", nullable: false),
                    Serial = table.Column<long>(type: "INTEGER", nullable: false),
                    Status = table.Column<long>(type: "INTEGER", nullable: false),
                    Timestamp = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateIndex(
                name: "index_timestamp",
                table: "sizer",
                column: "Timestamp");

            // migrationBuilder.CreateIndex(
            //     name: "IX_sizer_serial_timestamp",
            //     table: "sizer",
            //     columns: new[] { "Serial", "Timestamp" },
            //     unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_bags_weight_timestamp_serial",
                table: "bags",
                columns: new[] { "Net_lb", "Timestamp", "Serial" },
                unique: true);
        }
    }
}
