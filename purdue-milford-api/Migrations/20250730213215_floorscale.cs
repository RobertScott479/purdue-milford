using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace weightech_api.Migrations
{
    public partial class floorscale : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "floorscale",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ServerIndex = table.Column<long>(type: "INTEGER", nullable: false),
                    serverGroup = table.Column<string>(type: "TEXT", nullable: true),
                    serial = table.Column<long>(type: "INTEGER", nullable: false),
                    weight_lb = table.Column<double>(type: "REAL", nullable: false),
                    timestamp = table.Column<long>(type: "INTEGER", nullable: false),
                    gate = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_floorscale", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "index_floorscale_timestamp",
                table: "floorscale",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_floorscale_server_group_gate_timestamp",
                table: "floorscale",
                columns: new[] { "serverGroup", "gate", "timestamp" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_floorscale_server_group_timestamp",
                table: "floorscale",
                columns: new[] { "serverGroup", "timestamp" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "floorscale");
        }
    }
}
