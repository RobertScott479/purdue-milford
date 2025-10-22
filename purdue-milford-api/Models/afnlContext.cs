using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using weightech_api.Models;

namespace weightech_api.Models
{
    public partial class afnlContext : DbContext
    {
        //private readonly string sqliteConnection;
        public afnlContext()
        {

        }

        public afnlContext(DbContextOptions<afnlContext> options) : base(options)
        {
            // sqliteConnection = configuration["sqliteConnection"];
        }

        public virtual DbSet<HopperTableModel> Hopper { get; set; }

        public virtual DbSet<FloorscaleTableModel> Floorscale { get; set; }

        public virtual DbSet<SizerTableModel> Sizer { get; set; }
        public virtual DbSet<CaseweigherTableModel> Caseweigher { get; set; }
        public virtual DbSet<StatusName> StatusNames { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // if (!optionsBuilder.IsConfigured)
            // {
            //     optionsBuilder.UseSqlite("DataSource=Data/afnl.db");
            // }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CaseweigherTableModel>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("caseweigher");

                entity.HasIndex(e => new { e.Timestamp }, "IX_caseweigher_timestamp");


                // entity.Property(e => e.High_limit).HasColumnName("high");

                // entity.Property(e => e.Low_limit).HasColumnName("low");

                // entity.Property(e => e.Serial).HasColumnName("serial");

                // entity.Property(e => e.Status).HasColumnName("status");

                // entity.Property(e => e.Timestamp).HasColumnName("timestamp");

                // entity.Property(e => e.Net_lb).HasColumnName("weight");
            });

            modelBuilder.Entity<StatusName>(entity =>
            {
                entity.HasKey(e => e.StatusIndex);

                entity.ToTable("status_names");

                entity.HasIndex(e => new { e.StatusIndex, e.Status }, "IX_status_names_status_index_status")
                    .IsUnique();

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.StatusIndex).HasColumnName("status_index");
            });

            modelBuilder.Entity<SizerTableModel>(entity =>
           {
               entity.HasKey(e => e.Id);

               entity.ToTable("sizer");

               entity.HasIndex(e => new { e.Scale, e.Timestamp }, "IX_sizer_scale_timestamp");


               entity.HasIndex(e => new { e.Scale, e.Gate, e.Timestamp }, "index_scale_gate_timestamp");

               //    entity.Property(e => e.Gate).HasColumnName("gate");

               //    entity.Property(e => e.Net_g).HasColumnName("net_g");

               //    entity.Property(e => e.Scale).HasColumnName("scale");

               //    entity.Property(e => e.Serial).HasColumnName("serial");

               //    entity.Property(e => e.Timestamp).HasColumnName("timestamp");
           });

            modelBuilder.Entity<HopperTableModel>(entity =>
          {

              entity.HasKey("Id");

              entity.ToTable("hopper");

              entity.HasIndex(e => new { e.ServerGroup, e.Gate, e.Timestamp }, "IX_hopper_server_group_gate_timestamp")
                    .IsUnique();

              entity.HasIndex(e => e.Timestamp, "index_hopper_timestamp");

              //   entity.Property(e => e.ServerGroup).HasColumnName("serverIndex");

              //   entity.Property(e => e.ServerGroup).HasColumnName("serverGroup");

              //   entity.Property(e => e.Gate).HasColumnName("gate");

              //   entity.Property(e => e.Weight_lb).HasColumnName("net_lb");

              //   entity.Property(e => e.Serial).HasColumnName("serial");

              //   entity.Property(e => e.Timestamp).HasColumnName("timestamp");
          });

            modelBuilder.Entity<FloorscaleTableModel>(entity =>
                    {
                        entity.HasKey("Id");

                        entity.ToTable("floorscale");

                        entity.HasIndex(e => new { e.ServerGroup, e.Gate, e.Timestamp }, "IX_floorscale_server_group_gate_timestamp")
                              .IsUnique();

                        entity.HasIndex(e => new { e.ServerGroup, e.Timestamp }, "IX_floorscale_server_group_timestamp");

                        entity.HasIndex(e => e.Timestamp, "index_floorscale_timestamp");

                        // entity.Property(e => e.ServerGroup).HasColumnName("serverIndex");

                        // entity.Property(e => e.ServerGroup).HasColumnName("serverGroup");

                        // entity.Property(e => e.Gate).HasColumnName("gate");

                        // entity.Property(e => e.Weight_lb).HasColumnName("net_lb");

                        // entity.Property(e => e.Serial).HasColumnName("serial");

                        // entity.Property(e => e.Timestamp).HasColumnName("timestamp");
                    });




            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
