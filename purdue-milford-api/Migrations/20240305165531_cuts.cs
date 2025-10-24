using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class cuts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cuts",
                columns: table => new
                {
                    code = table.Column<string>(type: "TEXT", nullable: false),
                    productKey = table.Column<string>(type: "TEXT", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    cutRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    PPMH = table.Column<decimal>(type: "TEXT", nullable: false),
                    pieceCount = table.Column<decimal>(type: "TEXT", nullable: false),
                    pieceWeightMin = table.Column<decimal>(type: "TEXT", nullable: false),
                    pieceWeightMax = table.Column<decimal>(type: "TEXT", nullable: false),
                    passScore = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription1 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits1 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription2 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits2 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription3 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits3 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription4 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits4 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription5 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits5 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription6 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits6 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription7 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits7 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription8 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits8 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription9 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits9 = table.Column<decimal>(type: "TEXT", nullable: false),
                    demeritDescription10 = table.Column<string>(type: "TEXT", nullable: false),
                    demerits10 = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuts", x => x.code);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cuts");
        }
    }
}
