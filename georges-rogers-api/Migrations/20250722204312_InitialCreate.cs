using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bags",
                columns: table => new
                {
                    weight = table.Column<double>(type: "REAL", nullable: false),
                    high = table.Column<double>(type: "REAL", nullable: false),
                    low = table.Column<double>(type: "REAL", nullable: false),
                    timestamp = table.Column<long>(type: "INTEGER", nullable: false),
                    serial = table.Column<long>(type: "INTEGER", nullable: false),
                    status = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "sizer",
                columns: table => new
                {
                    serial = table.Column<long>(type: "INTEGER", nullable: false),
                    net_g = table.Column<long>(type: "INTEGER", nullable: false),
                    timestamp = table.Column<long>(type: "INTEGER", nullable: false),
                    gate = table.Column<long>(type: "INTEGER", nullable: false),
                    scale = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "status_names",
                columns: table => new
                {
                    status_index = table.Column<long>(type: "INTEGER", nullable: true),
                    status = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateIndex(
                name: "IX_bags_weight_timestamp_serial",
                table: "bags",
                columns: new[] { "weight", "timestamp", "serial" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "index_timestamp",
                table: "sizer",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_sizer_serial_timestamp",
                table: "sizer",
                columns: new[] { "serial", "timestamp" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_status_names_status_index_status",
                table: "status_names",
                columns: new[] { "status_index", "status" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bags");

            migrationBuilder.DropTable(
                name: "sizer");

            migrationBuilder.DropTable(
                name: "status_names");
        }
    }
}
