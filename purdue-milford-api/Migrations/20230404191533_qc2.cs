using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class qc2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "c2_pass_score",
                table: "products",
                newName: "pass_score2");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_9",
                table: "products",
                newName: "d_name_30");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_8",
                table: "products",
                newName: "d_name_29");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_7",
                table: "products",
                newName: "d_name_28");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_6",
                table: "products",
                newName: "d_name_27");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_5",
                table: "products",
                newName: "d_name_26");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_4",
                table: "products",
                newName: "d_name_25");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_3",
                table: "products",
                newName: "d_name_24");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_2",
                table: "products",
                newName: "d_name_23");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_10",
                table: "products",
                newName: "d_name_22");

            migrationBuilder.RenameColumn(
                name: "c2_d_name_1",
                table: "products",
                newName: "d_name_21");

            migrationBuilder.RenameColumn(
                name: "c2_d_9",
                table: "products",
                newName: "pass_score1");

            migrationBuilder.RenameColumn(
                name: "c2_d_8",
                table: "products",
                newName: "d_30");

            migrationBuilder.RenameColumn(
                name: "c2_d_7",
                table: "products",
                newName: "d_29");

            migrationBuilder.RenameColumn(
                name: "c2_d_6",
                table: "products",
                newName: "d_28");

            migrationBuilder.RenameColumn(
                name: "c2_d_5",
                table: "products",
                newName: "d_27");

            migrationBuilder.RenameColumn(
                name: "c2_d_4",
                table: "products",
                newName: "d_26");

            migrationBuilder.RenameColumn(
                name: "c2_d_3",
                table: "products",
                newName: "d_25");

            migrationBuilder.RenameColumn(
                name: "c2_d_2",
                table: "products",
                newName: "d_24");

            migrationBuilder.RenameColumn(
                name: "c2_d_10",
                table: "products",
                newName: "d_23");

            migrationBuilder.RenameColumn(
                name: "c2_d_1",
                table: "products",
                newName: "d_22");

            migrationBuilder.RenameColumn(
                name: "c1_pass_score",
                table: "products",
                newName: "d_21");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_9",
                table: "products",
                newName: "d_name_20");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_8",
                table: "products",
                newName: "d_name_19");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_7",
                table: "products",
                newName: "d_name_18");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_6",
                table: "products",
                newName: "d_name_17");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_5",
                table: "products",
                newName: "d_name_16");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_4",
                table: "products",
                newName: "d_name_15");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_3",
                table: "products",
                newName: "d_name_14");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_2",
                table: "products",
                newName: "d_name_13");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_10",
                table: "products",
                newName: "d_name_12");

            migrationBuilder.RenameColumn(
                name: "c1_d_name_1",
                table: "products",
                newName: "d_name_11");

            migrationBuilder.RenameColumn(
                name: "c1_d_9",
                table: "products",
                newName: "d_20");

            migrationBuilder.RenameColumn(
                name: "c1_d_8",
                table: "products",
                newName: "d_19");

            migrationBuilder.RenameColumn(
                name: "c1_d_7",
                table: "products",
                newName: "d_18");

            migrationBuilder.RenameColumn(
                name: "c1_d_6",
                table: "products",
                newName: "d_17");

            migrationBuilder.RenameColumn(
                name: "c1_d_5",
                table: "products",
                newName: "d_16");

            migrationBuilder.RenameColumn(
                name: "c1_d_4",
                table: "products",
                newName: "d_15");

            migrationBuilder.RenameColumn(
                name: "c1_d_3",
                table: "products",
                newName: "d_14");

            migrationBuilder.RenameColumn(
                name: "c1_d_2",
                table: "products",
                newName: "d_13");

            migrationBuilder.RenameColumn(
                name: "c1_d_10",
                table: "products",
                newName: "d_12");

            migrationBuilder.RenameColumn(
                name: "c1_d_1",
                table: "products",
                newName: "d_11");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "pass_score2",
                table: "products",
                newName: "c2_pass_score");

            migrationBuilder.RenameColumn(
                name: "pass_score1",
                table: "products",
                newName: "c2_d_9");

            migrationBuilder.RenameColumn(
                name: "d_name_30",
                table: "products",
                newName: "c2_d_name_9");

            migrationBuilder.RenameColumn(
                name: "d_name_29",
                table: "products",
                newName: "c2_d_name_8");

            migrationBuilder.RenameColumn(
                name: "d_name_28",
                table: "products",
                newName: "c2_d_name_7");

            migrationBuilder.RenameColumn(
                name: "d_name_27",
                table: "products",
                newName: "c2_d_name_6");

            migrationBuilder.RenameColumn(
                name: "d_name_26",
                table: "products",
                newName: "c2_d_name_5");

            migrationBuilder.RenameColumn(
                name: "d_name_25",
                table: "products",
                newName: "c2_d_name_4");

            migrationBuilder.RenameColumn(
                name: "d_name_24",
                table: "products",
                newName: "c2_d_name_3");

            migrationBuilder.RenameColumn(
                name: "d_name_23",
                table: "products",
                newName: "c2_d_name_2");

            migrationBuilder.RenameColumn(
                name: "d_name_22",
                table: "products",
                newName: "c2_d_name_10");

            migrationBuilder.RenameColumn(
                name: "d_name_21",
                table: "products",
                newName: "c2_d_name_1");

            migrationBuilder.RenameColumn(
                name: "d_name_20",
                table: "products",
                newName: "c1_d_name_9");

            migrationBuilder.RenameColumn(
                name: "d_name_19",
                table: "products",
                newName: "c1_d_name_8");

            migrationBuilder.RenameColumn(
                name: "d_name_18",
                table: "products",
                newName: "c1_d_name_7");

            migrationBuilder.RenameColumn(
                name: "d_name_17",
                table: "products",
                newName: "c1_d_name_6");

            migrationBuilder.RenameColumn(
                name: "d_name_16",
                table: "products",
                newName: "c1_d_name_5");

            migrationBuilder.RenameColumn(
                name: "d_name_15",
                table: "products",
                newName: "c1_d_name_4");

            migrationBuilder.RenameColumn(
                name: "d_name_14",
                table: "products",
                newName: "c1_d_name_3");

            migrationBuilder.RenameColumn(
                name: "d_name_13",
                table: "products",
                newName: "c1_d_name_2");

            migrationBuilder.RenameColumn(
                name: "d_name_12",
                table: "products",
                newName: "c1_d_name_10");

            migrationBuilder.RenameColumn(
                name: "d_name_11",
                table: "products",
                newName: "c1_d_name_1");

            migrationBuilder.RenameColumn(
                name: "d_30",
                table: "products",
                newName: "c2_d_8");

            migrationBuilder.RenameColumn(
                name: "d_29",
                table: "products",
                newName: "c2_d_7");

            migrationBuilder.RenameColumn(
                name: "d_28",
                table: "products",
                newName: "c2_d_6");

            migrationBuilder.RenameColumn(
                name: "d_27",
                table: "products",
                newName: "c2_d_5");

            migrationBuilder.RenameColumn(
                name: "d_26",
                table: "products",
                newName: "c2_d_4");

            migrationBuilder.RenameColumn(
                name: "d_25",
                table: "products",
                newName: "c2_d_3");

            migrationBuilder.RenameColumn(
                name: "d_24",
                table: "products",
                newName: "c2_d_2");

            migrationBuilder.RenameColumn(
                name: "d_23",
                table: "products",
                newName: "c2_d_10");

            migrationBuilder.RenameColumn(
                name: "d_22",
                table: "products",
                newName: "c2_d_1");

            migrationBuilder.RenameColumn(
                name: "d_21",
                table: "products",
                newName: "c1_pass_score");

            migrationBuilder.RenameColumn(
                name: "d_20",
                table: "products",
                newName: "c1_d_9");

            migrationBuilder.RenameColumn(
                name: "d_19",
                table: "products",
                newName: "c1_d_8");

            migrationBuilder.RenameColumn(
                name: "d_18",
                table: "products",
                newName: "c1_d_7");

            migrationBuilder.RenameColumn(
                name: "d_17",
                table: "products",
                newName: "c1_d_6");

            migrationBuilder.RenameColumn(
                name: "d_16",
                table: "products",
                newName: "c1_d_5");

            migrationBuilder.RenameColumn(
                name: "d_15",
                table: "products",
                newName: "c1_d_4");

            migrationBuilder.RenameColumn(
                name: "d_14",
                table: "products",
                newName: "c1_d_3");

            migrationBuilder.RenameColumn(
                name: "d_13",
                table: "products",
                newName: "c1_d_2");

            migrationBuilder.RenameColumn(
                name: "d_12",
                table: "products",
                newName: "c1_d_10");

            migrationBuilder.RenameColumn(
                name: "d_11",
                table: "products",
                newName: "c1_d_1");
        }
    }
}
