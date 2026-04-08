using EID.Domain.Enums;

namespace EID.Domain.Entities;

public class Contract
{
    public int Id { get; set; }
    public int SupplierId { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ContractStatus Status { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Supplier Supplier { get; set; } = null!;
}