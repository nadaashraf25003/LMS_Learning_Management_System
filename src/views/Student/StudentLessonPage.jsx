import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useLesson from "@/hooks/useLesson";
import { Toaster, toast } from "react-hot-toast";

export default function StudentLessonPage() {
  const { lessonId, courseid } = useParams();
  const navigate = useNavigate();
  const [videoCompleted, setVideoCompleted] = useState(false);
  
  const {
    getLessonForStudent,
    getStudentcourseProgress,
    completeLessonForStudent,
  } = useLesson(lessonId);

  const { data: lesson, isLoading } = getLessonForStudent(lessonId);
  const { data: progressData } = getStudentcourseProgress(courseid);

  useEffect(() => {
    if (lesson && lesson.isCompleted) {
      toast.success("You have already completed this lesson 🎉");
    }
  }, [lesson]);

  const handleCompleteLesson = () => {
    completeLessonForStudent.mutate(lesson.lessonId, {
      onSuccess: () => {
        toast.success("Lesson marked as completed! 🎉");
        setVideoCompleted(true);
      },
      onError: () => toast.error("Failed to complete lesson"),
    });
  };

  const handleVideoEnd = () => {
    if (!lesson.isCompleted && !videoCompleted) {
      setVideoCompleted(true);
      toast.success("Video completed! Mark the lesson as complete.", {
        duration: 4000,
      });
    }
  };

  const handleTakeQuiz = (quiz) => {
    // Navigate to quiz page
    navigate(`/quiz/${quiz.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in-up card p-8 text-center max-w-md">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Loading Lesson</h3>
          <p className="text-text-secondary">Preparing your learning experience...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Lesson Not Found</h2>
          <p className="text-text-secondary mb-6">The lesson you're looking for doesn't exist or you don't have access to it.</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn bg-primary text-white px-6 py-3 rounded-lg font-semibold btn-hover"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          className: 'dark:bg-surface dark:text-text-primary',
        }}
      />

      <div className="custom-container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="card p-8 space-y-6 card-hover border border-border">
            <div className="space-y-4">
              {/* Lesson Meta */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Lesson {lesson.order || 1}
                </span>
                {lesson.duration && (
                  <span className="px-3 py-1 bg-muted text-text-secondary rounded-full font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.duration} mins
                  </span>
                )}
                {lesson.isFreePreview && (
                  <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Free Preview
                  </span>
                )}
                {lesson.difficulty && (
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    lesson.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600' :
                    lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {lesson.difficulty}
                  </span>
                )}
              </div>

              {/* Lesson Title & Description */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-text-primary">
                  {lesson.title}
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            </div>

            {/* Progress & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border">
              {/* Course Progress */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <div className="font-medium text-text-primary">Course Progress</div>
                    {/* <div className="text-text-secondary">{progressData?.completedItems || 0} of {progressData?.totalItems || 0} completed</div> */}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-muted rounded-full h-3 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-700 ease-out relative"
                        style={{ width: `${progressData?.progressPercent ?? 0}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold min-w-12 transition-all duration-700 ${
                      progressData?.progressPercent === 100 ? "text-green-500 scale-110" : "text-text-primary"
                    }`}>
                      {progressData?.progressPercent ?? 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {!lesson.isCompleted ? (
                  <button
                    onClick={handleCompleteLesson}
                    disabled={completeLessonForStudent.isLoading}
                    className="btn bg-primary text-white px-8 py-4 rounded-lg font-semibold btn-hover flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {completeLessonForStudent.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Marking...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark as Complete
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 text-green-600 dark:text-green-400 font-semibold rounded-lg border border-green-500/30">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Completed </span>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-3 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Previous Lesson"
                  >
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate(1)}
                    className="p-3 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Next Lesson"
                  >
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Video & Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Section */}
              {lesson.videoUrl && (
                <div className="card p-2 card-hover border border-border">
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                    <video
                      src={lesson.videoUrl}
                      controls
                      className="w-full h-full rounded-xl"
                      poster={lesson.thumbnailUrl}
                      onEnded={handleVideoEnd}
                    >
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Overlay Info */}
                    <div className="absolute top-4 left-4">
                      {videoCompleted && !lesson.isCompleted && (
                        <div className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Video Watched
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Video Controls Info */}
                  <div className="p-4 text-sm text-text-secondary flex items-center justify-between">
                    <span>Click the complete button above to mark this lesson as finished</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tip
                    </span>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              {lesson.content && (
                <div className="card p-8 card-hover border border-border">
                  <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Lesson Content
                  </h3>
                  <div className="prose max-w-none dark:prose-invert text-text-secondary leading-relaxed">
                    {lesson.content}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Resources & Quizzes */}
            <div className="space-y-8">
              {/* Attachment */}
              {lesson.attachmentUrl && (
                <div className="card p-6 card-hover border border-border">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Resources
                  </h3>
                  <a
                    href={lesson.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                        Download Materials
                      </div>
                      <div className="text-sm text-text-secondary">
                        Supplemental resources for this lesson
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Quizzes */}
              {lesson.quizzes && lesson.quizzes.length > 0 && (
                <div className="card p-6 card-hover border border-border">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quizzes ({lesson.quizzes.length})
                  </h3>
                  <div className="space-y-4">
                    {lesson.quizzes.map((quiz, index) => (
                      <div 
                        key={quiz.id} 
                        className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition-all duration-200 group"
                        onClick={() => handleTakeQuiz(quiz)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                <span className="text-secondary font-bold text-sm">Q{index + 1}</span>
                              </div>
                              <h4 className="font-semibold text-text-primary group-hover:text-secondary transition-colors duration-200">
                                {quiz.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {quiz.totalQuestions} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {quiz.duration} mins
                              </span>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-text-secondary group-hover:text-secondary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-sm text-text-secondary">
                            Passing score: <strong className="text-text-primary">{quiz.passingScore}%</strong>
                          </span>
                          {quiz.isCompleted && (
                            <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Notes */}
              <div className="card p-6 card-hover border border-border">
                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Take Notes
                </h3>
                <textarea
                  placeholder="Add your notes for this lesson..."
                  className="w-full h-32 p-3 border border-border rounded-lg bg-background text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="w-full mt-3 py-2 bg-primary text-white font-semibold rounded-lg btn-hover">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}