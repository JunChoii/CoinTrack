using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Models;

namespace ExpenseTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly DatabaseContext _context;

    public ExpensesController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenseItems()
    {
        return await _context.Expenses.ToListAsync();
    }


    [HttpGet("{id}")]
public async Task<ActionResult<Expense>> GetExpenseItem(int id)
{
    var expense = await _context.Expenses.FirstOrDefaultAsync(t => t.Id == id);

    if (expense == null)
    {
        return NotFound(); // Returns a 404 response if the expense is not found
    }

    return expense;
}


    [HttpGet("total")]
    public async Task<IActionResult> GetTotalExpenses()
    {
        var total = await _context.Expenses.SumAsync(t => t.Total);
        return Ok(total);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> PostExpenseItem(Expense Expense)
    {
        _context.Expenses.Add(Expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExpenseItem), new { id = Expense.Id }, Expense);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutExpenseItem(int id, Expense Expense)
    {
        if (id != Expense.Id)
        {
            return BadRequest();
        }

        _context.Entry(Expense).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpenseItem(int id)
    {
        var ExpenseItem = await _context.Expenses.FindAsync(id);
        if (ExpenseItem == null)
        {
            return NotFound();
        }

        try
        {
            _context.Expenses.Remove(ExpenseItem);
            await _context.SaveChangesAsync();

        }
        catch (DbUpdateException)
        {
            return BadRequest();
        }

        return NoContent();
    }
}