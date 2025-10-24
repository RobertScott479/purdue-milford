using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class aqlWeightstandards : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.AlterColumn<decimal>(
                name: "standardPrimaryYield",
                table: "Cuts",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "TEXT");

            migrationBuilder.AddColumn<decimal>(
                name: "aqlScoreStandard",
                table: "Cuts",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "weightechScoreStandard",
                table: "Cuts",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "aqlScoreStandard",
                table: "Cuts");

            migrationBuilder.DropColumn(
                name: "weightechScoreStandard",
                table: "Cuts");

            migrationBuilder.AlterColumn<decimal>(
                name: "standardPrimaryYield",
                table: "Cuts",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "TEXT",
                oldDefaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    key = table.Column<string>(type: "text", nullable: false),
                    code = table.Column<string>(type: "text", nullable: true),
                    cut_1_name = table.Column<string>(type: "TEXT", nullable: true),
                    cut_1_rate = table.Column<string>(type: "TEXT", nullable: true),
                    cut_2_name = table.Column<string>(type: "TEXT", nullable: true),
                    cut_2_rate = table.Column<string>(type: "TEXT", nullable: true),
                    d_1 = table.Column<double>(type: "REAL", nullable: true),
                    d_10 = table.Column<double>(type: "REAL", nullable: true),
                    d_11 = table.Column<double>(type: "REAL", nullable: true),
                    d_12 = table.Column<double>(type: "REAL", nullable: true),
                    d_13 = table.Column<double>(type: "REAL", nullable: true),
                    d_14 = table.Column<double>(type: "REAL", nullable: true),
                    d_15 = table.Column<double>(type: "REAL", nullable: true),
                    d_16 = table.Column<double>(type: "REAL", nullable: true),
                    d_17 = table.Column<double>(type: "REAL", nullable: true),
                    d_18 = table.Column<double>(type: "REAL", nullable: true),
                    d_19 = table.Column<double>(type: "REAL", nullable: true),
                    d_2 = table.Column<double>(type: "REAL", nullable: true),
                    d_20 = table.Column<double>(type: "REAL", nullable: true),
                    d_21 = table.Column<double>(type: "REAL", nullable: true),
                    d_22 = table.Column<double>(type: "REAL", nullable: true),
                    d_23 = table.Column<double>(type: "REAL", nullable: true),
                    d_24 = table.Column<double>(type: "REAL", nullable: true),
                    d_25 = table.Column<double>(type: "REAL", nullable: true),
                    d_26 = table.Column<double>(type: "REAL", nullable: true),
                    d_27 = table.Column<double>(type: "REAL", nullable: true),
                    d_28 = table.Column<double>(type: "REAL", nullable: true),
                    d_29 = table.Column<double>(type: "REAL", nullable: true),
                    d_3 = table.Column<double>(type: "REAL", nullable: true),
                    d_30 = table.Column<double>(type: "REAL", nullable: true),
                    d_4 = table.Column<double>(type: "REAL", nullable: true),
                    d_5 = table.Column<double>(type: "REAL", nullable: true),
                    d_6 = table.Column<double>(type: "REAL", nullable: true),
                    d_7 = table.Column<double>(type: "REAL", nullable: true),
                    d_8 = table.Column<double>(type: "REAL", nullable: true),
                    d_9 = table.Column<double>(type: "REAL", nullable: true),
                    d_name_1 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_10 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_11 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_12 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_13 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_14 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_15 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_16 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_17 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_18 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_19 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_2 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_20 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_21 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_22 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_23 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_24 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_25 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_26 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_27 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_28 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_29 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_3 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_30 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_4 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_5 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_6 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_7 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_8 = table.Column<string>(type: "TEXT", nullable: true),
                    d_name_9 = table.Column<string>(type: "TEXT", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    PPMH = table.Column<double>(type: "REAL", nullable: false),
                    pass_score = table.Column<double>(type: "REAL", nullable: true),
                    pass_score1 = table.Column<double>(type: "REAL", nullable: true),
                    pass_score2 = table.Column<double>(type: "REAL", nullable: true),
                    pattern = table.Column<string>(type: "text", nullable: true),
                    PieceCount = table.Column<double>(type: "REAL", nullable: false),
                    PieceCount1 = table.Column<double>(type: "REAL", nullable: false),
                    PieceCount2 = table.Column<double>(type: "REAL", nullable: false),
                    PieceWeightMax = table.Column<double>(type: "REAL", nullable: false),
                    PieceWeightMax1 = table.Column<double>(type: "REAL", nullable: false),
                    PieceWeightMax2 = table.Column<double>(type: "REAL", nullable: false),
                    PieceWeightMin = table.Column<double>(type: "REAL", nullable: false),
                    PieceWeightMin1 = table.Column<double>(type: "REAL", nullable: false),
                    PieceWeightMin2 = table.Column<double>(type: "REAL", nullable: false),
                    primary_name = table.Column<string>(type: "TEXT", nullable: true),
                    primary_rate = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.key);
                });
        }
    }
}
