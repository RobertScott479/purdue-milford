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

        public virtual DbSet<HopperModel> Hopper { get; set; }

        public virtual DbSet<FloorscaleModel> Floorscale { get; set; }

        public virtual DbSet<SizerTray> Sizer { get; set; }
        public virtual DbSet<Bag> Bags { get; set; }
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
            modelBuilder.Entity<Bag>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("bags");

                entity.HasIndex(e => new { e.Net_lb, e.Timestamp, e.Serial }, "IX_bags_weight_timestamp_serial")
                    .IsUnique();

                // entity.Property(e => e.High_limit).HasColumnName("high");

                // entity.Property(e => e.Low_limit).HasColumnName("low");

                // entity.Property(e => e.Serial).HasColumnName("serial");

                // entity.Property(e => e.Status).HasColumnName("status");

                // entity.Property(e => e.Timestamp).HasColumnName("timestamp");

                // entity.Property(e => e.Net_lb).HasColumnName("weight");
            });

            modelBuilder.Entity<StatusName>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("status_names");

                entity.HasIndex(e => new { e.StatusIndex, e.Status }, "IX_status_names_status_index_status")
                    .IsUnique();

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.StatusIndex).HasColumnName("status_index");
            });

            modelBuilder.Entity<SizerTray>(entity =>
           {
               entity.HasNoKey();

               entity.ToTable("sizer");

               entity.HasIndex(e => new { e.Serial, e.Timestamp }, "IX_sizer_serial_timestamp")
                   .IsUnique();

               entity.HasIndex(e => e.Timestamp, "index_timestamp");

               //    entity.Property(e => e.Gate).HasColumnName("gate");

               //    entity.Property(e => e.Net_g).HasColumnName("net_g");

               //    entity.Property(e => e.Scale).HasColumnName("scale");

               //    entity.Property(e => e.Serial).HasColumnName("serial");

               //    entity.Property(e => e.Timestamp).HasColumnName("timestamp");
           });

            modelBuilder.Entity<HopperModel>(entity =>
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

            modelBuilder.Entity<FloorscaleModel>(entity =>
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
