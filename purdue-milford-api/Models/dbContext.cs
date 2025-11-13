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
        public virtual DbSet<CutModel> Cuts { get; set; }
        public virtual DbSet<QcResults> QcResults { get; set; }
        public virtual DbSet<StationTableModel> Stations { get; set; }
        public virtual DbSet<QaLogModel> qalog { get; set; }
        public virtual DbSet<BreakAdjustmentModel> BreakAdjustments { get; set; }
        public virtual DbSet<UserModel> Users { get; set; }
        public virtual DbSet<Punches> Punches { get; set; }


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




            modelBuilder.Entity<QcResults>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.ToTable("qc_results");

                entity.Property(e => e.checker_cutter_number).HasColumnName("checker_cutter_number");

                entity.Property(e => e.product).HasColumnName("product");

                entity.Property(e => e.bank).HasColumnName("bank");

                entity.Property(e => e.cut).HasColumnName("cut");

                entity.Property(e => e.cutter_number).HasColumnName("cutter_number");

                entity.Property(e => e.cycle).HasColumnName("cycle");

                entity.Property(e => e.station).HasColumnName("station");

                entity.Property(e => e.timestamp).HasColumnName("timestamp");

                entity.Property(e => e.weight).HasColumnName("weight");

                entity.Property(e => e.defect_0).HasColumnName("defect_0");

                entity.Property(e => e.defect_1).HasColumnName("defect_1");

                entity.Property(e => e.defect_2).HasColumnName("defect_2");

                entity.Property(e => e.defect_3).HasColumnName("defect_3");

                entity.Property(e => e.defect_4).HasColumnName("defect_4");

                entity.Property(e => e.defect_5).HasColumnName("defect_5");

                entity.Property(e => e.defect_6).HasColumnName("defect_6");

                entity.Property(e => e.defect_7).HasColumnName("defect_7");

                entity.Property(e => e.defect_8).HasColumnName("defect_8");

                entity.Property(e => e.defect_9).HasColumnName("defect_9");

                entity.Property(e => e.inspect_time).HasColumnName("inspect_time");

                entity.Property(e => e.pass).HasColumnName("pass");

                entity.Property(e => e.fail).HasColumnName("fail");

                entity.Property(e => e.cancel).HasColumnName("cancel");

                entity.Property(e => e.pieces).HasColumnName("pieces");

                entity.Property(e => e.finished_po).HasColumnName("finished_po");
            });

            modelBuilder.Entity<StationTableModel>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.ToTable("stations");
                entity.Property(e => e.Enabled).HasColumnName("enabled");
                // entity.Property(e => e.Cutter_number).HasColumnName("cutter_number").HasDefaultValue(0);
                // //entity.Property(e => e.AlternateCutterNumber).HasColumnName("alternate_cutter_number").HasDefaultValue(0);
                // entity.Property(e => e.Shift).HasColumnName("shift").HasDefaultValue(1);
                // entity.HasIndex(e => new { e.Station, e.Shift }).IsUnique();
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


            modelBuilder.Entity<Punches>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.ToTable("punches");

                // entity.Property(e => e.Id).HasColumnName("id");

                // entity.Property(e => e.ProductionDate).HasColumnName("production_date");
                // entity.Property(e => e.Shift).HasColumnName("shift");

                // entity.Property(e => e.Cutter_number).HasColumnName("cutter_number");

                // entity.Property(e => e.Station).HasColumnName("station");

                // entity.Property(e => e.PunchIn).HasColumnName("punch_in");

                // entity.Property(e => e.PunchOut).HasColumnName("punch_out");

                // entity.Property(e => e.Notes).HasColumnName("notes");

                // entity.Property(e => e.updateBy).HasColumnName("update_by");

                // entity.Property(e => e.updateAt).HasColumnName("update_at");
            });


            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
