using EID.Application.Interfaces.Repositories;
using EID.Domain.Entities;
using EID.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EID.Infrastructure.Persistence.Repositories;

public class SupplierRepository : ISupplierRepository
{
    private readonly OracleContext _context;

    public SupplierRepository(OracleContext context)
    {
        _context = context;
    }

    public async Task<Supplier?> GetByIdAsync(int id) =>
        await _context.Suppliers.FindAsync(id);

    public async Task<IEnumerable<Supplier>> GetAllAsync() =>
        await _context.Suppliers.ToListAsync();

    public async Task AddAsync(Supplier supplier) =>
        await _context.Suppliers.AddAsync(supplier);

    public Task UpdateAsync(Supplier supplier)
    {
        _context.Suppliers.Update(supplier);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}