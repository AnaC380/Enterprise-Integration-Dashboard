using EID.Application.Interfaces.Repositories;
using EID.Application.DTOs.Contract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EID.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContractController : ControllerBase
{
    private readonly IContractRepository _contractRepository;

    public ContractController(IContractRepository contractRepository)
    {
        _contractRepository = contractRepository;
    }

    /// <summary>Lista todos os contratos (Oracle).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ContractDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var contracts = await _contractRepository.GetAllAsync();
        var result = contracts.Select(c => new ContractDto
        {
            Id = c.Id,
            SupplierId = c.SupplierId,
            SupplierName = c.Supplier?.CompanyName ?? string.Empty,
            Title = c.Title,
            Value = c.Value,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            Status = c.Status,
            Description = c.Description
        });
        return Ok(result);
    }

    /// <summary>Lista contratos por fornecedor (Oracle).</summary>
    [HttpGet("supplier/{supplierId}")]
    [ProducesResponseType(typeof(IEnumerable<ContractDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBySupplier(int supplierId)
    {
        var contracts = await _contractRepository.GetBySupplierIdAsync(supplierId);
        var result = contracts.Select(c => new ContractDto
        {
            Id = c.Id,
            SupplierId = c.SupplierId,
            SupplierName = c.Supplier?.CompanyName ?? string.Empty,
            Title = c.Title,
            Value = c.Value,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            Status = c.Status,
            Description = c.Description
        });
        return Ok(result);
    }
}