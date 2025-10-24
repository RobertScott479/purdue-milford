using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class qc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<double>(
                name: "c1_d_1",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_10",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_2",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_3",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_4",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_5",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_6",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_7",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_8",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_d_9",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_1",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_10",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_2",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_3",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_4",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_5",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_6",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_7",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_8",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c1_d_name_9",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c1_pass_score",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_1",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_10",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_2",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_3",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_4",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_5",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_6",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_7",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_8",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_d_9",
                table: "products",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_1",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_10",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_2",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_3",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_4",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_5",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_6",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_7",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_8",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "c2_d_name_9",
                table: "products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "c2_pass_score",
                table: "products",
                type: "REAL",
                nullable: true);


        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "c1_d_1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_10",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_2",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_3",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_4",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_5",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_6",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_7",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_8",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_9",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_10",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_2",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_3",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_4",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_5",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_6",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_7",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_8",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_d_name_9",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c1_pass_score",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_10",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_2",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_3",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_4",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_5",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_6",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_7",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_8",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_9",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_1",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_10",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_2",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_3",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_4",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_5",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_6",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_7",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_8",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_d_name_9",
                table: "products");

            migrationBuilder.DropColumn(
                name: "c2_pass_score",
                table: "products");


        }
    }
}
