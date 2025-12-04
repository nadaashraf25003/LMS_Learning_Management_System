using Learnify_API.Data.Models;
using Learnify_API.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Learnify_API.Data.Services
{
    public class QuestionService
    {
        private readonly AppDbContext _context;

        public QuestionService(AppDbContext context)
        {
            _context = context;
        }

        // ========================================
        // 1) ADD MULTIPLE QUESTIONS TO QUIZ
        // ========================================
        public async Task<bool> AddQuestionsAsync(QuizQuestionsVM vm)
        {
            var quizExists = await _context.Quizzes.AnyAsync(q => q.QuizId == vm.QuizId);
            if (!quizExists) return false;

            var questions = vm.Questions.Select(q => new Question
            {
                QuizId = vm.QuizId,
                QuestionText = q.Text,
                OptionA = q.Options.FirstOrDefault(o => o.Id == "a")?.Text,
                OptionB = q.Options.FirstOrDefault(o => o.Id == "b")?.Text,
                OptionC = q.Options.FirstOrDefault(o => o.Id == "c")?.Text,
                OptionD = q.Options.FirstOrDefault(o => o.Id == "d")?.Text,
                CorrectOption = char.ToUpper(q.Answer[0])
            }).ToList();

            await _context.Questions.AddRangeAsync(questions);
            await _context.SaveChangesAsync();
            return true;
        }

        // ========================================
        // 2) GET QUESTIONS BY QUIZ
        // ========================================
        public async Task<List<QuestionVM>?> GetQuestionsByQuizIdAsync(int quizId)
        {
            var questions = await _context.Questions
                .Where(q => q.QuizId == quizId)
                .ToListAsync();

            return questions.Select(q => new QuestionVM
            {
                Id = q.QuestionId.ToString(),
                Text = q.QuestionText,
                Options = new List<QuestionOptionVM>
                    {
                        new QuestionOptionVM { Id = "a", Text = q.OptionA ?? ""},
                        new QuestionOptionVM { Id = "b", Text = q.OptionB ?? "" },
                        new QuestionOptionVM { Id = "c", Text = q.OptionC ?? ""},
                        new QuestionOptionVM { Id = "d", Text = q.OptionD ?? ""}
                    }
                    .Where(o => !string.IsNullOrEmpty(o.Text))
                    .ToList(),

                Answer = q.CorrectOption.ToString().ToLower()
            }).ToList();
        }

        // ========================================
        // 3) GET BY ID
        // ========================================
        public async Task<QuestionVM?> GetQuestionByIdAsync(int id)
        {
            var q = await _context.Questions.FindAsync(id);
            if (q == null) return null;

            return new QuestionVM
            {
                Id = q.QuestionId.ToString(),
                Text = q.QuestionText,
                Options = new List<QuestionOptionVM>
                    {
                        new QuestionOptionVM { Id = "a", Text = q.OptionA ?? "" },
                        new QuestionOptionVM { Id = "b", Text = q.OptionB ?? "" },
                        new QuestionOptionVM { Id = "c", Text = q.OptionC ?? ""},
                        new QuestionOptionVM { Id = "d", Text = q.OptionD?? "" }
                    }
                    .Where(o => !string.IsNullOrEmpty(o.Text))
                    .ToList(),

                Answer = q.CorrectOption.ToString().ToLower()
            };
        }

        // ========================================
        // 4) UPDATE QUESTION
        // ========================================
        public async Task<QuestionVM?> UpdateQuestionAsync(int id, QuestionVM vm)
        {
            var q = await _context.Questions.FindAsync(id);
            if (q == null) return null;

            q.QuestionText = vm.Text;
            q.OptionA = vm.Options.FirstOrDefault(o => o.Id == "a")?.Text;
            q.OptionB = vm.Options.FirstOrDefault(o => o.Id == "b")?.Text;
            q.OptionC = vm.Options.FirstOrDefault(o => o.Id == "c")?.Text;
            q.OptionD = vm.Options.FirstOrDefault(o => o.Id == "d")?.Text;

            // FIX: avoid IndexOutOfRange
            if (!string.IsNullOrWhiteSpace(vm.Answer))
            {
                q.CorrectOption = char.ToUpper(vm.Answer[0]);
            }

            await _context.SaveChangesAsync();
            return vm;
        }

        // ========================================
        // 5) DELETE QUESTION
        // ========================================
        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var q = await _context.Questions.FindAsync(id);
            if (q == null) return false;

            _context.Questions.Remove(q);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
