using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EID.Infrastructure.Persistence.Migrations.Oracle
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SUPPLIERS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    CompanyName = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    TaxId = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    ContactEmail = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    ContactPhone = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(type: "NUMBER(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SUPPLIERS", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CONTRACTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    SupplierId = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    Title = table.Column<string>(type: "NVARCHAR2(300)", maxLength: 300, nullable: false),
                    Value = table.Column<decimal>(type: "NUMBER(18,2)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    Status = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    Description = table.Column<string>(type: "NVARCHAR2(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CONTRACTS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CONTRACTS_SUPPLIERS_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "SUPPLIERS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CONTRACTS_SupplierId",
                table: "CONTRACTS",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_SUPPLIERS_TaxId",
                table: "SUPPLIERS",
                column: "TaxId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CONTRACTS");

            migrationBuilder.DropTable(
                name: "SUPPLIERS");
        }
    }
}
