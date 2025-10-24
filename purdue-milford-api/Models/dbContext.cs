using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace dg_foods_api.Models
{
    public partial class DatabaseContext : DbContext
    {
        public DatabaseContext()
        {
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Bank> Banks { get; set; }
        public virtual DbSet<Banks2> Banks2s { get; set; }
        public virtual DbSet<Checker> Checkers { get; set; }
        public virtual DbSet<Dump> Dumps { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        //public virtual DbSet<Product> Products { get; set; }
        //  public virtual DbSet<ProductCutsModel> ProductCuts { get; set; }
        public virtual DbSet<CutModel> Cuts { get; set; }
        public virtual DbSet<QcResult> QcResults { get; set; }
        public virtual DbSet<StationModel> Stations { get; set; }
        public virtual DbSet<QaLogModel> qalog { get; set; }
        public virtual DbSet<BreakAdjustmentModel> BreakAdjustments { get; set; }
        public virtual DbSet<UserModel> Users { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // if (!optionsBuilder.IsConfigured)
            // {

            //      #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
            //       optionsBuilder.UseSqlite("DataSource=Data/purdue-milford.db");
            // }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Bank>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("banks");

                entity.Property(e => e.Code)
                    .HasColumnType("text")
                    .HasColumnName("code");

                entity.Property(e => e.Vector).HasColumnName("vector");
            });

            modelBuilder.Entity<Banks2>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("banks2");

                entity.Property(e => e.Code).HasColumnName("code");

                entity.Property(e => e.NewCode).HasColumnName("new_code");

                entity.Property(e => e.Vector).HasColumnName("vector");
            });

            modelBuilder.Entity<Checker>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.ToTable("checkers");

                entity.Property(e => e.Name).HasColumnName("name");
            });

            modelBuilder.Entity<Dump>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("dumps");

                entity.Property(e => e.Cut).HasColumnName("cut");

                entity.Property(e => e.Station).HasColumnName("station");

                entity.Property(e => e.Timestamp).HasColumnName("timestamp");

                entity.Property(e => e.Vector).HasColumnName("vector");

                entity.Property(e => e.Weight).HasColumnName("weight");
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(c => c.Cutter_number);

                entity.ToTable("employees");

                entity.Property(e => e.Enabled).HasColumnName("enabled");

                entity.Property(e => e.Name).HasColumnName("name");

                entity.Property(e => e.Shift).HasColumnName("shift");

                entity.Property(e => e.Cutter_number).HasColumnName("cutter_number");
                entity.Property(e => e.EmployeeCategory).HasColumnName("employee_category");
                entity.Property(e => e.HireDate).HasColumnName("hire_date");
            });

            // modelBuilder.Entity<Product>(entity =>
            // {
            //     entity.HasKey(c => c.Key);

            //     entity.Property(e => e.Key)
            //        .HasColumnType("text")
            //        .HasColumnName("key");

            //     entity.ToTable("products");

            //     entity.Property(e => e.Code)
            //         .HasColumnType("text")
            //         .HasColumnName("code");

            //     entity.Property(e => e.Description)
            //    .HasColumnType("text")
            //    .HasColumnName("description");

            //     entity.Property(e => e.Pattern)
            //    .HasColumnType("text")
            //    .HasColumnName("pattern");

            //     entity.Property(e => e.PrimaryRate).HasColumnName("primary_rate"); //; //.HasDefaultValue(0).IsRequired(true);


            //     entity.Property(e => e.Cut1Name).HasColumnName("cut_1_name");
            //     entity.Property(e => e.Cut2Name).HasColumnName("cut_2_name");
            //     entity.Property(e => e.PrimaryName).HasColumnName("primary_name");

            //     entity.Property(e => e.Cut1Rate).HasColumnName("cut_1_rate"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.Cut2Rate).HasColumnName("cut_2_rate"); //.HasDefaultValue(0).IsRequired(true);


            //     //PRIMARY
            //     entity.Property(e => e.PassScore).HasColumnName("pass_score"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D1).HasColumnName("d_1"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D10).HasColumnName("d_10"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D2).HasColumnName("d_2"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D3).HasColumnName("d_3"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D4).HasColumnName("d_4"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D5).HasColumnName("d_5"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D6).HasColumnName("d_6"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D7).HasColumnName("d_7"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D8).HasColumnName("d_8"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D9).HasColumnName("d_9"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.DName1).HasColumnName("d_name_1"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName10).HasColumnName("d_name_10"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName2).HasColumnName("d_name_2"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName3).HasColumnName("d_name_3"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName4).HasColumnName("d_name_4"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName5).HasColumnName("d_name_5"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName6).HasColumnName("d_name_6"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName7).HasColumnName("d_name_7"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName8).HasColumnName("d_name_8"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName9).HasColumnName("d_name_9"); //.HasDefaultValue("N/A");




            //     //CUT 1
            //     entity.Property(e => e.PassScore1).HasColumnName("pass_score1"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D11).HasColumnName("d_11"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D20).HasColumnName("d_20"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D12).HasColumnName("d_12"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D13).HasColumnName("d_13"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D14).HasColumnName("d_14"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D15).HasColumnName("d_15"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D16).HasColumnName("d_16"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D17).HasColumnName("d_17"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D18).HasColumnName("d_18"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D19).HasColumnName("d_19"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.DName11).HasColumnName("d_name_11"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName20).HasColumnName("d_name_20"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName12).HasColumnName("d_name_12"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName13).HasColumnName("d_name_13"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName14).HasColumnName("d_name_14"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName15).HasColumnName("d_name_15"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName16).HasColumnName("d_name_16"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName17).HasColumnName("d_name_17"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName18).HasColumnName("d_name_18"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName19).HasColumnName("d_name_19"); //.HasDefaultValue("N/A");



            //     //CUT 2
            //     entity.Property(e => e.PassScore2).HasColumnName("pass_score2"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D21).HasColumnName("d_21"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D30).HasColumnName("d_30"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D22).HasColumnName("d_22"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D23).HasColumnName("d_23"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D24).HasColumnName("d_24"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D25).HasColumnName("d_25"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D26).HasColumnName("d_26"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D27).HasColumnName("d_27"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D28).HasColumnName("d_28"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.D29).HasColumnName("d_29"); //.HasDefaultValue(0).IsRequired(true);

            //     entity.Property(e => e.DName21).HasColumnName("d_name_21"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName30).HasColumnName("d_name_30"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName22).HasColumnName("d_name_22"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName23).HasColumnName("d_name_23"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName24).HasColumnName("d_name_24"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName25).HasColumnName("d_name_25"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName26).HasColumnName("d_name_26"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName27).HasColumnName("d_name_27"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName28).HasColumnName("d_name_28"); //.HasDefaultValue("N/A");

            //     entity.Property(e => e.DName29).HasColumnName("d_name_29"); //.HasDefaultValue("N/A");




            // });



            modelBuilder.Entity<QcResult>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("qc_results");

                entity.Property(e => e.Bank).HasColumnName("bank");

                entity.Property(e => e.Canceled).HasColumnName("canceled");

                entity.Property(e => e.CheckerName).HasColumnName("checker_name");

                entity.Property(e => e.Cut).HasColumnName("cut");

                entity.Property(e => e.Cycle).HasColumnName("cycle");

                entity.Property(e => e.Defect0).HasColumnName("defect_0");

                entity.Property(e => e.Defect1).HasColumnName("defect_1");

                entity.Property(e => e.Defect10).HasColumnName("defect_10");

                entity.Property(e => e.Defect2).HasColumnName("defect_2");

                entity.Property(e => e.Defect3).HasColumnName("defect_3");

                entity.Property(e => e.Defect4).HasColumnName("defect_4");

                entity.Property(e => e.Defect5).HasColumnName("defect_5");

                entity.Property(e => e.Defect6).HasColumnName("defect_6");

                entity.Property(e => e.Defect7).HasColumnName("defect_7");

                entity.Property(e => e.Defect8).HasColumnName("defect_8");

                entity.Property(e => e.Defect9).HasColumnName("defect_9");

                entity.Property(e => e.Failed).HasColumnName("failed");

                entity.Property(e => e.Passed).HasColumnName("passed");

                entity.Property(e => e.Product).HasColumnName("product");

                entity.Property(e => e.Station).HasColumnName("station");

                entity.Property(e => e.Timestamp).HasColumnName("timestamp");

                entity.Property(e => e.Weight).HasColumnName("weight");
            });

            modelBuilder.Entity<StationModel>(entity =>
            {
                entity.HasKey(c => c.Station);

                entity.ToTable("stations");

                entity.Property(e => e.Enabled).HasColumnName("enabled");
            });


            modelBuilder.Entity<UserModel>(entity =>
          {
              entity.HasKey(c => c.username);
          });


            modelBuilder.Entity<BreakAdjustmentModel>(entity =>
          {
              entity.HasKey(c => c.bank);
              entity.Property(c => c.bank).ValueGeneratedNever();
          });


            modelBuilder.Entity<CutModel>(entity =>
         {
             entity.HasKey(c => c.code);
             entity.Property(c => c.aqlScoreStandard).HasDefaultValue(0);
             entity.Property(c => c.weightScoreStandard).HasDefaultValue(0);
             entity.Property(c => c.standardPrimaryYield).HasDefaultValue(0);
         });



            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
