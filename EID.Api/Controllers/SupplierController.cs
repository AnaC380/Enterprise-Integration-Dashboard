using EID.Application.Interfaces.Repositories;
using EID.Application.DTOs.Supplier;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EID.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SupplierController : ControllerBase
{
    private readonly ISupplierRepository _supplierRepository;

    public SupplierController(ISupplierRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    /// <summary>Lista todos os fornecedores (Oracle).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SupplierDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var suppliers = await _supplierRepository.GetAllAsync();
        var result = suppliers.Select(s => new SupplierDto
        {
            Id = s.Id,
            CompanyName = s.CompanyName,
            TaxId = s.TaxId,
            ContactEmail = s.ContactEmail,
            ContactPhone = s.ContactPhone,
            IsActive = s.IsActive
        });
        return Ok(result);
    }

    /// <summary>Busca fornecedor por ID (Oracle).</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SupplierDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var supplier = await _supplierRepository.GetByIdAsync(id);
        if (supplier is null) return NotFound();

        return Ok(new SupplierDto
        {
            Id = supplier.Id,
            CompanyName = supplier.CompanyName,
            TaxId = supplier.TaxId,
            ContactEmail = supplier.ContactEmail,
            ContactPhone = supplier.ContactPhone,
            IsActive = supplier.IsActive
        });
    }
}