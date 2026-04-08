using EID.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EID.Infrastructure.Persistence.Mappings;

public class SupplierMapping : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.ToTable("SUPPLIERS");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.CompanyName).IsRequired().HasMaxLength(200);
        builder.Property(x => x.TaxId).IsRequired().HasMaxLength(20);
        builder.HasIndex(x => x.TaxId).IsUnique();
        builder.Property(x => x.ContactEmail).IsRequired().HasMaxLength(200);
        builder.Property(x => x.ContactPhone).HasMaxLength(20);
        builder.HasMany(x => x.Contracts)
               .WithOne(x => x.Supplier)
               .HasForeignKey(x => x.SupplierId);
    }
}