using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class pieceCounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "PieceCount",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceCount1",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceCount2",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceWeightMax",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceWeightMax1",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceWeightMax2",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceWeightMin",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceWeightMin1",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PieceWeightMin2",
                table: "products",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PieceCount",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceCount1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceCount2",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceWeightMax",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceWeightMax1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceWeightMax2",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceWeightMin",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceWeightMin1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "PieceWeightMin2",
                table: "products");
        }
    }
}
