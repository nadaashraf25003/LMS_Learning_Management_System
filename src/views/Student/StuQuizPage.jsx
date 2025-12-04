import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQuiz from "@/hooks/useQuiz";
import api from "@/API/Config";
import { Toaster, toast } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";

const AnswersEndPoint = "studentanswers";

// ---------------- Timer Component ----------------
function Timer({ initialSeconds = 3600, onTimeUp }) {
  const [secs, setSecs] = useState(initialSeconds);
    const [isWarning, setIsWarning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (secs === 300 && !isWarning) { // 5 minutes warning
      setIsWarning(true);
      toast.error("Only 5 minutes remaining! ⏰", { duration: 5000 });
    }
    if (secs === 60) { // 1 minute warning
      toast.error("Hurry! Only 1 minute left! 🚨", { duration: 3000 });
    }
    if (secs === 0 && !finished) {
      setFinished(true);
      onTimeUp(); // run only once
    }
  }, [secs, isWarning, finished, onTimeUp]);

  const handleTimeUp = () => {
  toast.error("Time's up! Submitting your quiz automatically...");
  handleSubmit();
};
 useEffect(() => {
    if (finished) return; // stop timer completely when done

    const timer = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  return (
    <div className={`card border border-border p-6 text-center transition-all duration-300 ${
      isWarning ? 'bg-red-500/10 border-red-500/30' : 'bg-background'
    }`}>
      <h3 className="font-semibold text-lg mb-3 text-text-primary flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Time Remaining
      </h3>
      <div className={`text-3xl font-bold font-mono ${
        isWarning ? 'text-red-600 animate-pulse' : 'text-primary'
      }`}>
        {hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ''}
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      {isWarning && (
        <p className="text-sm text-red-600 mt-2 font-medium">Time is running out!</p>
      )}
    </div>
  );
}

// ---------------- Question Card ----------------
function QuestionCard({ question, index, selected, onSelect, isAnswered }) {
  return (
    <div className="card border border-border p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
            isAnswered ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'
          }`}>
            {index + 1}
          </div>
          <h3 className="font-semibold text-lg text-text-primary">Question {index + 1}</h3>
        </div>
        {isAnswered && (
          <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
            Answered
          </span>
        )}
      </div>
      
      <p className="text-text-primary text-lg mb-6 leading-relaxed">{question.text}</p>
      
      <div className="space-y-3">
        {question.options.map((opt, optIndex) => {
          const isSelected = selected === opt.id;
          const letters = ['A', 'B', 'C', 'D'];
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-4 cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                  : 'border-border hover:bg-muted hover:border-primary/20'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                isSelected 
                  ? 'bg-primary border-primary' 
                  : 'border-text-secondary'
              }`}>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <span className="font-medium text-text-primary">
                  {letters[optIndex]}. {opt.text}
                </span>
              </div>
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={isSelected}
                onChange={() => onSelect(question.id, opt.id)}
                className="hidden"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Question Navigation ----------------
function QuestionNavigation({ questions, answers, currentQuestion, onQuestionClick }) {
  return (
    <div className="card border border-border p-6">
      <h3 className="font-semibold text-lg mb-4 text-text-primary flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Question Navigation
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {questions.map((q, index) => {
          const isAnswered = answers[q.id];
          const isCurrent = index === currentQuestion;
          return (
            <button
              key={q.id}
              onClick={() => onQuestionClick(index)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-200 ${
                isCurrent
                  ? 'bg-primary text-white shadow-lg scale-110'
                  : isAnswered
                  ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                  : 'bg-muted text-text-secondary border border-border hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/10 border border-green-500/30 rounded"></div>
          <span className="text-sm text-text-secondary">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-muted border border-border rounded"></div>
          <span className="text-sm text-text-secondary">Unanswered</span>
        </div>
      </div>
    </div>
  );
}

// ---------------- Questions List ----------------
function QuestionsList({ questions, answers, onAnswerChange, currentQuestion, onQuestionChange }) {
    if (!questions || questions.length === 0 || currentQuestion >= questions.length || currentQuestion < 0) {
    return <div className="text-center text-text-secondary">No questions available</div>;
  }
  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <QuestionCard
        key={currentQ.id}
        question={currentQ}
        index={currentQuestion}
        selected={answers[currentQ.id]}
        onSelect={onAnswerChange}
        isAnswered={answers[currentQ.id]}
      />
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onQuestionChange(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className="btn bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        <div className="text-text-secondary font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <button
          onClick={() => onQuestionChange(currentQuestion + 1)}
          disabled={currentQuestion === questions.length - 1}
          className="btn bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---------------- Main Student Quiz Page ----------------
export default function StuQuizPage() {
  const {courseid, quizid: quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizForStudentById , submitQuizMutation } = useQuiz();

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quiz for student
  const { data: quizInfo, isLoading } = getQuizForStudentById(quizId);

  // Handle answer selection
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Handle time up
  const handleTimeUp = () => {
    toast.error("Time's up! Submitting your quiz automatically...");
    handleSubmit();
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / (quizInfo?.questions?.length || 1)) * 100;

  // Submit quiz answers
 const handleSubmit = () => {
  setIsSubmitting(true);
  const endTime = new Date();

  submitQuizMutation.mutate(
    {
      quizId: quizId,
      answers,
    },
    {
      onSuccess: (data) => {
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationMinutes = Math.floor(durationMs / 1000 / 60);
        const durationSeconds = Math.floor((durationMs / 1000) % 60);

        toast.success(
          `Quiz submitted successfully! 🎉\nScore: ${data.score} | Duration: ${durationMinutes}m ${durationSeconds}s`,
          { duration: 5000 }
        );

        setTimeout(() => {
          navigate("/StudentLayout/StuQuizResult/" + quizId);
        }, 2000);
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to submit quiz. Please try again.");
        setIsSubmitting(false);
      },
    }
  );
};


  const confirmSubmit = () => {
    const unansweredCount = (quizInfo?.questions?.length || 0) - answeredCount;
    
    toast.custom((t) => (
      <ConfirmToast
        message={
          <div>
            <p className="font-semibold mb-2">Submit your quiz?</p>
            <p className="text-sm text-text-secondary">
              {answeredCount} questions answered ({unansweredCount} unanswered)
            </p>
            {unansweredCount > 0 && (
              <p className="text-sm text-red-600 mt-1">
                You have {unansweredCount} unanswered questions.
              </p>
            )}
          </div>
        }
        onConfirm={handleSubmit}
        onCancel={() => toast.dismiss(t.id)}
        confirmText="Submit Anyway"
        cancelText="Review Questions"
      />
    ));
  };

  if (isLoading || !quizInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card p-8 text-center max-w-md">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Loading Quiz</h3>
          <p className="text-text-secondary">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="card border-b border-border rounded-none">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6">
            <div className="space-y-2">
              <nav className="text-sm text-text-secondary">
                <span
                  onClick={() => navigate("/StudentLayout/StuDashboard")}
                  className="cursor-pointer hover:text-primary transition-colors"
                >
                  Dashboard
                </span>
                <span className="mx-2">/</span>
                <span
                  onClick={() => navigate(-1)}
                  className="cursor-pointer hover:text-primary transition-colors"
                >
                  Courses
                </span>
                <span className="mx-2">/</span>
                <span className="text-primary">Quiz</span>
              </nav>
              <h1 className="text-3xl font-bold text-text-primary">{quizInfo.title}</h1>
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="text-right">
                <div className="font-semibold text-text-primary">
                  {answeredCount} / {quizInfo.questions.length} Answered
                </div>
                <div className="text-sm text-text-secondary">Progress</div>
              </div>
              <div className="w-32 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="custom-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Quiz Info */}
              <div className="card border border-border p-6">
                <h2 className="text-xl font-semibold mb-4 text-text-primary flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Quiz Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Questions</span>
                    <span className="font-semibold text-text-primary">{quizInfo.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-semibold text-text-primary">{quizInfo.duration} mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Total Marks</span>
                    <span className="font-semibold text-text-primary">{quizInfo.totalMarks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Passing Score</span>
                    <span className="font-semibold text-primary">{quizInfo.passingScore}%</span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <Timer 
                initialSeconds={quizInfo.duration * 60} 
                onTimeUp={handleTimeUp}
              />

              {/* Question Navigation */}
              <QuestionNavigation
                questions={quizInfo.questions}
                answers={answers}
                currentQuestion={currentQuestion}
                onQuestionClick={setCurrentQuestion}
              />

              {/* Submit Button */}
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="w-full btn bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Questions Area */}
          <div className="lg:col-span-3">
            <QuestionsList
              questions={quizInfo.questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              currentQuestion={currentQuestion}
              onQuestionChange={setCurrentQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}