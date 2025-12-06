using Microsoft.AspNetCore.Mvc;

[Route("api/admin/transactions")]
[ApiController]
public class AdminFinanceController : ControllerBase
{
    private readonly AdminFinanceService _service;

    public AdminFinanceController(AdminFinanceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllPayoutRequestsAsync());
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        return Ok(await _service.GetFinanceStatsAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetPayoutRequestByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var updated = await _service.UpdatePayoutStatusAsync(id, status);
        return updated ? Ok("Status updated") : BadRequest("Cannot update status");
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export()
    {
        var csv = await _service.ExportPayoutsToCsvAsync();
        return File(csv, "text/csv", "payouts.csv");
    }
}
