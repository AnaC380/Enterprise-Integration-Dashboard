using EID.Application.Interfaces.Repositories;
using EID.Domain.Entities;
using EID.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EID.Infrastructure.Persistence.Repositories;

public class ContractRepository : IContractRepository
{
    private readonly OracleContext _context;

    public ContractRepository(OracleContext context)
    {
        _context = context;
    }

    public async Task<Contract?> GetByIdAsync(int id) =>
        await _context.Contracts.FindAsync(id);

    public async Task<IEnumerable<Contract>> GetAllAsync() =>
        await _context.Contracts.ToListAsync();

    public async Task<IEnumerable<Contract>> GetBySupplierIdAsync(int supplierId) =>
        await _context.Contracts.Where(c => c.SupplierId == supplierId).ToListAsync();

    public async Task AddAsync(Contract contract) =>
        await _context.Contracts.AddAsync(contract);

    public Task UpdateAsync(Contract contract)
    {
        _context.Contracts.Update(contract);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}