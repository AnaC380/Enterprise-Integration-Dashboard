using EID.Domain.Entities;

namespace EID.Application.Interfaces.Repositories;

public interface ISupplierRepository
{
    Task<Supplier?> GetByIdAsync(int id);
    Task<IEnumerable<Supplier>> GetAllAsync();
    Task AddAsync(Supplier supplier);
    Task UpdateAsync(Supplier supplier);
    Task SaveChangesAsync();
}