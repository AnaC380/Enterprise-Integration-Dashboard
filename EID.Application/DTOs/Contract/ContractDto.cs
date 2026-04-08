using EID.Domain.Enums;

namespace EID.Application.DTOs.Contract;

public class ContractDto
{
    public int Id { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ContractStatus Status { get; set; }
    public string? Description { get; set; }
}