import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom"; // ✅ Fixed import
import App from "../App.jsx";

// ... (all your lazy imports remain the same) ...

// Loading component for Suspense
const LoadingSpinner = () => <div>Loading...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LandingLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Landing /> },
          { path: "courses", element: <Courses /> }, // ✅ lowercase for consistency
          { path: "about", element: <About /> }, // ✅ lowercase
          { path: "search-results", element: <SearchResults /> }, // ✅ kebab-case
          { path: "course-details/:id", element: <CourseDetails /> }, // ✅ kebab-case
          { path: "contact-us", element: <ContactUs /> }, // ✅ kebab-case
          { path: "send-feedback", element: <SendFeedback /> }, // ✅ kebab-case
          { path: "terms-of-use", element: <TermsofUse /> }, // ✅ kebab-case
        ],
      },
      {
        path: "auth",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "instructor-register", element: <InstructorRegister /> },
          { path: "forgot-password", element: <ForgetPassword /> },
          { path: "verify-email", element: <VerifyEmail /> },
          { path: "resend-verification", element: <ResendVerification /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
      {
        path: "user",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserLayout />
          </Suspense>
        ),
        children: [
          { path: "help", element: <HelpPage /> },
          { path: "feedback", element: <FeedbackManagement /> },
          { path: "notifications", element: <Notifications /> },
          { path: "settings", element: <SettingPage /> },
          { path: "edit-profile", element: <EditProfile /> },
        ],
      },
      {
        path: "student",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StuStudentLayout />
          </Suspense>
        ),
        children: [
          { path: "dashboard", element: <StuDashboard /> },
          { path: "checkout", element: <StuCheckout /> },
          { path: "profile", element: <StuProfile /> },
          { path: "invoice", element: <StuInvoice /> },
          { path: "certificates", element: <StuMyCertificates /> },
          { path: "quiz/:courseId/:quizId", element: <StuQuizPage /> },
          { path: "quiz-result/:quizId", element: <StuQuizResult /> },
          { path: "course-details/:id", element: <StuCourseDetails /> },
          { path: "saved-courses", element: <StuSavedCourses /> },
          { path: "cart", element: <StuShoppingCart /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "lesson/:courseId/:lessonId", element: <StudentLessonPage /> },
          { path: "live-sessions", element: <LiveSessions /> },
          { path: "final-projects", element: <StuFinalProjects /> },
        ],
      },
      {
        path: "instructor",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <InstructorLayout />
          </Suspense>
        ),
        children: [
          { path: "dashboard", element: <InstrDashboard /> },
          { path: "courses", element: <InstCourses /> },
          { path: "create-course", element: <CreateCourse /> },
          { path: "create-lesson/:courseId", element: <CreateLesson /> },
          { path: "edit-lesson/:lessonId", element: <EditLesson /> },
          { path: "create-quiz/:courseId/:lessonId", element: <CreateQuiz /> },
          { 
            path: "create-questions/:courseId/:lessonId/:quizId", 
            element: <CreateQuestions /> 
          },
          { 
            path: "edit-quiz/:quizId/:courseId/:lessonId", 
            element: <EditQuiz /> 
          },
          // ✅ REMOVED duplicate "CreateCourse/:courseid" route
          {
            path: "course-details/:id",
            element: <InstructorCourseDetails />,
          },
          {
            path: "lesson-details/:id",
            element: <InstructorLessonDetails />,
          },
          {
            path: "quiz-details/:quizId/:courseId/:lessonId",
            element: <InstructorQuizDetails />,
          },
          { path: "students", element: <AllStudents /> },
          { path: "quizzes", element: <QuizManagement /> },
          { path: "lessons", element: <LessonManagement /> },
          { path: "profile", element: <InstrProfile /> },
          { path: "final-projects", element: <InstFinalProjects /> },
          { path: "payments", element: <InstructorPayment /> },
          { path: "live-sessions", element: <InstLiveSessions /> },
        ],
      },
      {
        path: "admin",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "users", element: <UserManagement /> },
          { path: "courses", element: <CourseManagement /> },
          { path: "payments", element: <AdminPayments /> },
          { path: "logs", element: <AdminLogs /> },
        ],
      },
      { path: "*", element: <Error404 /> },
    ],
  },
]);