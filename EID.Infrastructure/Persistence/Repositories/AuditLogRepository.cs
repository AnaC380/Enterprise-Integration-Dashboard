using EID.Application.Interfaces.Repositories;
using EID.Domain.Entities;
using EID.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EID.Infrastructure.Persistence.Repositories;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly SqlServerContext _context;

    public AuditLogRepository(SqlServerContext context)
    {
        _context = context;
    }

    public async Task AddAsync(AuditLog auditLog) =>
        await _context.AuditLogs.AddAsync(auditLog);

    public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId) =>
        await _context.AuditLogs.Where(a => a.UserId == userId).ToListAsync();

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}