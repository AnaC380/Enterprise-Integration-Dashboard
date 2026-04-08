using EID.Domain.Entities;
using EID.Infrastructure.Persistence.Mappings;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace EID.Infrastructure.Persistence.Contexts;

public class OracleContext : DbContext
{
    public OracleContext(DbContextOptions<OracleContext> options) : base(options) { }

    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Contract> Contracts => Set<Contract>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new SupplierMapping());
        modelBuilder.ApplyConfiguration(new ContractMapping());
        base.OnModelCreating(modelBuilder);
    }
}