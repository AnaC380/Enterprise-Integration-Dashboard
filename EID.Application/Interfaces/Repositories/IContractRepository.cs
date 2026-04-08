using EID.Domain.Entities;

namespace EID.Application.Interfaces.Repositories;

public interface IContractRepository
{
    Task<Contract?> GetByIdAsync(int id);
    Task<IEnumerable<Contract>> GetAllAsync();
    Task<IEnumerable<Contract>> GetBySupplierIdAsync(int supplierId);
    Task AddAsync(Contract contract);
    Task UpdateAsync(Contract contract);
    Task SaveChangesAsync();
}