using Microsoft.EntityFrameworkCore.Migrations;

namespace dg_foods_api.Migrations
{
    public partial class cutnew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductCuts");

            migrationBuilder.RenameColumn(
                name: "pieceWeightMin",
                table: "Cuts",
                newName: "wtConfidence");

            migrationBuilder.RenameColumn(
                name: "pieceWeightMax",
                table: "Cuts",
                newName: "weightMinimum");

            migrationBuilder.RenameColumn(
                name: "pieceCount",
                table: "Cuts",
                newName: "weightMaximum");

            migrationBuilder.RenameColumn(
                name: "passScore",
                table: "Cuts",
                newName: "sampleSize");

            migrationBuilder.RenameColumn(
                name: "demerits9",
                table: "Cuts",
                newName: "question9");

            migrationBuilder.RenameColumn(
                name: "demerits8",
                table: "Cuts",
                newName: "question8");

            migrationBuilder.RenameColumn(
                name: "demerits7",
                table: "Cuts",
                newName: "question7");

            migrationBuilder.RenameColumn(
                name: "demerits6",
                table: "Cuts",
                newName: "question6");

            migrationBuilder.RenameColumn(
                name: "demerits5",
                table: "Cuts",
                newName: "question5");

            migrationBuilder.RenameColumn(
                name: "demerits4",
                table: "Cuts",
                newName: "question4");

            migrationBuilder.RenameColumn(
                name: "demerits3",
                table: "Cuts",
                newName: "question3");

            migrationBuilder.RenameColumn(
                name: "demerits2",
                table: "Cuts",
                newName: "question2");

            migrationBuilder.RenameColumn(
                name: "demerits10",
                table: "Cuts",
                newName: "question10");

            migrationBuilder.RenameColumn(
                name: "demerits1",
                table: "Cuts",
                newName: "question1");

            migrationBuilder.RenameColumn(
                name: "demeritDescription9",
                table: "Cuts",
                newName: "q9Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription8",
                table: "Cuts",
                newName: "q8Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription7",
                table: "Cuts",
                newName: "q7Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription6",
                table: "Cuts",
                newName: "q6Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription5",
                table: "Cuts",
                newName: "q5Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription4",
                table: "Cuts",
                newName: "q4Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription3",
                table: "Cuts",
                newName: "q3Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription2",
                table: "Cuts",
                newName: "q2Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription10",
                table: "Cuts",
                newName: "q1Confidence");

            migrationBuilder.RenameColumn(
                name: "demeritDescription1",
                table: "Cuts",
                newName: "q10Confidence");

            migrationBuilder.AddColumn<string>(
                name: "pattern",
                table: "Cuts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "pattern",
                table: "Cuts");

            migrationBuilder.RenameColumn(
                name: "wtConfidence",
                table: "Cuts",
                newName: "pieceWeightMin");

            migrationBuilder.RenameColumn(
                name: "weightMinimum",
                table: "Cuts",
                newName: "pieceWeightMax");

            migrationBuilder.RenameColumn(
                name: "weightMaximum",
                table: "Cuts",
                newName: "pieceCount");

            migrationBuilder.RenameColumn(
                name: "sampleSize",
                table: "Cuts",
                newName: "passScore");

            migrationBuilder.RenameColumn(
                name: "question9",
                table: "Cuts",
                newName: "demerits9");

            migrationBuilder.RenameColumn(
                name: "question8",
                table: "Cuts",
                newName: "demerits8");

            migrationBuilder.RenameColumn(
                name: "question7",
                table: "Cuts",
                newName: "demerits7");

            migrationBuilder.RenameColumn(
                name: "question6",
                table: "Cuts",
                newName: "demerits6");

            migrationBuilder.RenameColumn(
                name: "question5",
                table: "Cuts",
                newName: "demerits5");

            migrationBuilder.RenameColumn(
                name: "question4",
                table: "Cuts",
                newName: "demerits4");

            migrationBuilder.RenameColumn(
                name: "question3",
                table: "Cuts",
                newName: "demerits3");

            migrationBuilder.RenameColumn(
                name: "question2",
                table: "Cuts",
                newName: "demerits2");

            migrationBuilder.RenameColumn(
                name: "question10",
                table: "Cuts",
                newName: "demerits10");

            migrationBuilder.RenameColumn(
                name: "question1",
                table: "Cuts",
                newName: "demerits1");

            migrationBuilder.RenameColumn(
                name: "q9Confidence",
                table: "Cuts",
                newName: "demeritDescription9");

            migrationBuilder.RenameColumn(
                name: "q8Confidence",
                table: "Cuts",
                newName: "demeritDescription8");

            migrationBuilder.RenameColumn(
                name: "q7Confidence",
                table: "Cuts",
                newName: "demeritDescription7");

            migrationBuilder.RenameColumn(
                name: "q6Confidence",
                table: "Cuts",
                newName: "demeritDescription6");

            migrationBuilder.RenameColumn(
                name: "q5Confidence",
                table: "Cuts",
                newName: "demeritDescription5");

            migrationBuilder.RenameColumn(
                name: "q4Confidence",
                table: "Cuts",
                newName: "demeritDescription4");

            migrationBuilder.RenameColumn(
                name: "q3Confidence",
                table: "Cuts",
                newName: "demeritDescription3");

            migrationBuilder.RenameColumn(
                name: "q2Confidence",
                table: "Cuts",
                newName: "demeritDescription2");

            migrationBuilder.RenameColumn(
                name: "q1Confidence",
                table: "Cuts",
                newName: "demeritDescription10");

            migrationBuilder.RenameColumn(
                name: "q10Confidence",
                table: "Cuts",
                newName: "demeritDescription1");

            migrationBuilder.CreateTable(
                name: "ProductCuts",
                columns: table => new
                {
                    code = table.Column<string>(type: "TEXT", nullable: false),
                    cut1 = table.Column<string>(type: "TEXT", nullable: false),
                    cut2 = table.Column<string>(type: "TEXT", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    nugget = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCuts", x => x.code);
                });
        }
    }
}
