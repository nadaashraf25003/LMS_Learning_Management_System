using Learnify_API.Data.Services;
using Learnify_API.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Learnify_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _service;

        public QuestionController(QuestionService service)
        {
            _service = service;
        }

        // ==================== ADD MULTIPLE ====================
        [HttpPost("add")]
        public async Task<ActionResult> AddQuestions([FromBody] QuizQuestionsVM vm)
        {
            var result = await _service.AddQuestionsAsync(vm);
            if (!result) return BadRequest("Quiz not found");

            return Ok(new { Message = "Questions added successfully" });
        }

        // ==================== GET BY QUIZ ====================
        [HttpGet("quiz/{quizId}")]
        public async Task<ActionResult> GetByQuiz(int quizId)
        {
            var result = await _service.GetQuestionsByQuizIdAsync(quizId);
            return Ok(result);
        }

        // ==================== GET BY ID ====================
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var result = await _service.GetQuestionByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // ==================== UPDATE ====================
        [HttpPut("update/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] QuestionVM vm)
        {
            var result = await _service.UpdateQuestionAsync(id, vm);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // ==================== DELETE ====================
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteQuestionAsync(id);
            if (!deleted) return NotFound();
            return Ok(new { Message = "Deleted successfully" });
        }
    }
}
