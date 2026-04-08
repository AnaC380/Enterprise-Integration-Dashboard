using EID.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EID.Infrastructure.Persistence.Mappings;

public class ContractMapping : IEntityTypeConfiguration<Contract>
{
    public void Configure(EntityTypeBuilder<Contract> builder)
    {
        builder.ToTable("CONTRACTS");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Title).IsRequired().HasMaxLength(300);
        builder.Property(x => x.Value).IsRequired().HasColumnType("NUMBER(18,2)");
        builder.Property(x => x.Status).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(1000);
    }
}