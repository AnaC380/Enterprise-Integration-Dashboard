using EID.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EID.Infrastructure.Persistence.Mappings;

public class AuditLogMapping : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("AuditLogs");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Action).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Resource).IsRequired().HasMaxLength(100);
        builder.Property(x => x.IpAddress).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Details).HasMaxLength(1000);
    }
}