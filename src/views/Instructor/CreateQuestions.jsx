import React, { useState } from "react";
import useQuestion from "@/hooks/useQuestion";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const CreateQuestionsPage = () => {
    const {courseid ,lessonId ,   quizid: quizId } = useParams();
  const { addQuestionsMutation } = useQuestion(quizId);

  const [questions, setQuestions] = useState([
    { text: "", options: [{ id: "a", text: "" }, { id: "b", text: "" }], answer: "" },
  ]);

  // Handle question text change
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  // Handle option text change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  // Handle correct answer change
  const handleAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answer = value;
    setQuestions(newQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: [{ id: "a", text: "" }, { id: "b", text: "" }], answer: "" },
    ]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);  
    setQuestions(newQuestions);
  };

  // Add an option to a question
  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    const nextId = String.fromCharCode(97 + newQuestions[qIndex].options.length); // 'a','b','c'...
    newQuestions[qIndex].options.push({ id: nextId, text: "" });
    setQuestions(newQuestions);
  };

  // Submit all questions
  const handleSubmit = (e) => {
    e.preventDefault();
  const payload = {
    QuizId: quizId,
    Questions: questions,
  };
    addQuestionsMutation.mutate(payload, {
      onSuccess: () =>   toast.success("✔ Questions added successfully!"),
      onError: (err) =>  toast.error("❌ Error adding questions!")  ,
    });
  };

  return (
  <div className="p-6 max-w-4xl mx-auto">
  <Toaster position="top-right" />
  
  {/* Header Section */}
  <div className="text-center mb-8 animate-fade-in-up">
    <h1 className="text-3xl font-bold text-text-primary mb-2">Create Questions</h1>
    <p className="text-text-secondary">Build your quiz with multiple choice questions</p>
  </div>

  <form onSubmit={handleSubmit} className="space-y-6">
    {questions.map((q, qIndex) => (
      <div 
        key={qIndex} 
        className="card border border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
      >
        {/* Question Header */}
        <div className="flex justify-between items-center mb-4 p-4 border-b border-border bg-surface rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-semibold">
              {qIndex + 1}
            </div>
            <h2 className="font-semibold text-text-primary text-lg">Question {qIndex + 1}</h2>
          </div>
          <button
            type="button"
            className="btn-secondary bg-destructive text-destructive-foreground px-3 py-1 rounded-lg text-sm font-medium transition-colors hover:bg-destructive/90"
            onClick={() => removeQuestion(qIndex)}
          >
            Remove Question
          </button>
        </div>

        {/* Question Input */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Question Text
            </label>
            <input
              type="text"
              placeholder="Enter your question here..."
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full border border-input bg-background text-text-primary px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Options Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Answer Options
            </label>
            {q.options.map((opt, oIndex) => (
              <div 
                key={oIndex} 
                className={`flex items-center space-x-3 p-3 border border-border rounded-lg transition-all duration-200 ${
                  q.answer === opt.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface'
                }`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full font-medium text-sm ${
                  q.answer === opt.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {opt.id.toUpperCase()}
                </div>
                
                <input
                  type="text"
                  placeholder={`Option ${opt.id.toUpperCase()}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="flex-1 border border-input bg-background text-text-primary px-3 py-2 rounded-md focus:ring-1 focus:ring-primary focus:border-transparent"
                  required
                />
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`answer-${qIndex}`}
                    checked={q.answer === opt.id}
                    onChange={() => handleAnswerChange(qIndex, opt.id)}
                    className="w-4 h-4 text-primary focus:ring-primary border-border"
                  />
                  <span className="text-sm font-medium text-text-secondary">Correct</span>
                </label>
              </div>
            ))}
            
            {/* Add Option Button */}
            {q.options.length < 4 && (
              <button
                type="button"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors mt-2"
                onClick={() => addOption(qIndex)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Option</span>
              </button>
            )}
          </div>
        </div>
      </div>
    ))}

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-border">
      <button
        type="button"
        className="btn btn-secondary bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold btn-hover flex items-center space-x-2"
        onClick={addQuestion}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add New Question</span>
      </button>
      
      <button 
        type="submit" 
        className="btn btn-primary bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold btn-hover flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Submit All Questions</span>
      </button>
    </div>
  </form>

  {/* Empty State */}
  {questions.length === 0 && (
    <div className="text-center py-12 animate-fade-in-up">
      <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">No Questions Yet</h3>
      <p className="text-text-secondary mb-6">Start building your quiz by adding the first question</p>
      <button
        type="button"
        className="btn btn-primary bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold btn-hover"
        onClick={addQuestion}
      >
        Create First Question
      </button>
    </div>
  )}
</div>
  );
};

export default CreateQuestionsPage;
