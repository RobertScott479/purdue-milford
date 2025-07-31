using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class hoppertable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "hopper",
                columns: table => new
                {
                    ServerGroup = table.Column<string>(type: "TEXT", nullable: true),
                    serial = table.Column<long>(type: "INTEGER", nullable: false),
                    weight_lb = table.Column<double>(type: "REAL", nullable: false),
                    timestamp = table.Column<long>(type: "INTEGER", nullable: false),
                    gate = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateIndex(
                name: "index_hopper_timestamp",
                table: "hopper",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_hopper_server_group_gate_timestamp",
                table: "hopper",
                columns: new[] { "ServerGroup", "gate", "timestamp" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "hopper");
        }
    }
}
