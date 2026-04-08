using EID.Domain.Entities;

namespace EID.Application.Interfaces.Repositories;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog auditLog);
    Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId);
    Task SaveChangesAsync();
}