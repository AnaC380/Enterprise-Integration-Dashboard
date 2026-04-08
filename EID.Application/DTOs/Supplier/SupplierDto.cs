namespace EID.Application.DTOs.Supplier;

public class SupplierDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}