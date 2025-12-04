import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App.jsx";

// Lazy-loaded dashboards
const InstrDashboard = lazy(
  () => import("@/views/Instructor/InstrDashboard.jsx")
);

// Admin Views
const UserManagement = lazy(() => import("@/views/Admin/UserManagement.jsx"));
const AdminDashboard = lazy(() => import("@/views/Admin/AdminDashboard.jsx"));
const CourseManagement = lazy(
  () => import("@/views/Admin/CourseManagement.jsx")
);
const AdminLayout = lazy(
  () => import("@/components/AdminLayout/AdminLayout.jsx")
);
const AdminProfile = lazy(() => import("@/views/Admin/AdminProfile.jsx"));
const AdminPayments = lazy(() => import("@/views/Admin/AdminPayments.jsx"));
const AdminLogs = lazy(() => import("@/views/Admin/AdminLogs.jsx"));

// Instructor Views
const InstructorLayout = lazy(
  () => import("@/components/InstructorLayout/InstructorLayout.jsx")
);
const InstCourses = lazy(() => import("@/views/Instructor/InstCourses.jsx"));
const AllStudents = lazy(() => import("@/views/Instructor/AllStudents.jsx"));
const QuizManagement = lazy(
  () => import("@/views/Instructor/QuizManagement.jsx")
);
const LessonManagement = lazy(
  () => import("@/views/Instructor/LessonManagement.jsx")
);
const InstrProfile = lazy(() => import("@/views/Instructor/InstrProfile.jsx"));
const CreateCourse = lazy(() => import("@/views/Instructor/CreateCourse.jsx"));
const CreateLesson = lazy(() => import("@/views/Instructor/CreateLesson"));
const CreateQuiz = lazy(() => import("@/views/Instructor/CreateQuiz.jsx"));
const CreateQuestions = lazy(() => import("@/views/Instructor/CreateQuestions.jsx"));
const InstructorCourseDetails = lazy(
  () => import("@/views/Instructor/InstructorCourseDetails.jsx")
);
const InstructorLessonDetails = lazy(
  () => import("@/views/Instructor/InstructorLessonDetails.jsx")
);
const EditLesson = lazy(() => import("@/views/Instructor/EditLesson.jsx"));
const InstructorQuizDetails = lazy(
  () => import("@/views/Instructor/InstructorQuizDetails.jsx")
);
const EditQuiz = lazy(() => import("@/views/Instructor/EditQuiz.jsx"));
const InstFinalProjects = lazy(() => import("@/views/Instructor/InstFinalProjects.jsx"));
const InstructorPayment = lazy(() => import("@/views/Instructor/InstructorPayment.jsx"));
const InstLiveSessions = lazy(() => import("@/views/Instructor/InstLiveSessions.jsx"));

// Student Views
const StuDashboard = lazy(() => import("@/views/Student/StuDashboard.jsx"));
const StuStudentLayout = lazy(
  () => import("@/components/StudentLayout/StudentLayout.jsx")
);
const StuCheckout = lazy(() => import("@/views/Student/StuCheckout.jsx"));
const StuCourseDetails = lazy(
  () => import("@/views/Student/StuCourseDetails.jsx")
);
const StuProfile = lazy(() => import("@/views/Student/StuProfile.jsx"));
const StuInvoice = lazy(() => import("@/views/Student/StuInvoice.jsx"));
const StuMyCertificates = lazy(
  () => import("@/views/Student/StuMyCertificates.jsx")
);
const StuQuizPage = lazy(() => import("@/views/Student/StuQuizPage.jsx"));
const StuQuizResult = lazy(() => import("@/views/Student/StuQuizResult.jsx"));
const StuSavedCourses = lazy(
  () => import("@/views/Student/StuSavedCourses.jsx")
);
const StuShoppingCart = lazy(
  () => import("@/views/Student/StuShoppingCart.jsx")
);
const MyCourses = lazy(() => import("@/views/Student/MyCourses.jsx"));
const StudentLessonPage = lazy(
  () => import("@/views/Student/StudentLessonPage.jsx")
);
const LiveSessions = lazy(() => import("@/views/Student/LiveSessions.jsx"));
const StuFinalProjects = lazy(() => import("@/views/Student/StuFinalProjects.jsx"));

// Others
const UserLayout = lazy(() => import("@/components/UserLayout/UserLayout.jsx"));
const ContactUs = lazy(() => import("@/views/Others/ContactUs.jsx"));
const HelpPage = lazy(() => import("@/views/Others/HelpPage.jsx"));
const Notifications = lazy(() => import("@/views/Others/Notifications.jsx"));
const SearchResults = lazy(
  () => import("@/views/Others/SearchResults/SearchResults.jsx")
);
const SendFeedback = lazy(() => import("@/views/Others/SendFeedback.jsx"));
const SettingPage = lazy(() => import("@/views/Others/SettingPage.jsx"));
const TermsofUse = lazy(() => import("@/views/Others/TermsofUse.jsx"));
const EditProfile = lazy(() => import("@/views/Others/EditProfile.jsx"));
const FeedbackManagement = lazy(
  () => import("@/views/Admin/FeedbackManagement.jsx")
);
const CourseDetails = lazy(
  () => import("@/views/Others/SearchResults/CourseDetails.jsx")
);

// Landing Views
const LandingLayout = lazy(
  () => import("@/components/Landing/LandingLayout/LandingLayout.js")
);
const Landing = lazy(() => import("../views/Landing/Landing.jsx"));
const Courses = lazy(() => import("../views/Landing/Courses.jsx"));
const About = lazy(() => import("../views/Landing/About.jsx"));

// Auth Views
const AuthLayout = lazy(
  () => import("@/components/Auth/AuthLayout/AuthLayout.js")
);
const Login = lazy(() => import("../views/Auth/Login.jsx"));
const Register = lazy(() => import("../views/Auth/Register/Register.jsx"));
const ForgetPassword = lazy(() => import("../views/Auth/ForgetPassword.jsx"));
const ResetPassword = lazy(() => import("../views/Auth/ResetPassword.jsx"));
const InstructorRegister = lazy(
  () => import("../views/Auth/InstructorRegister.jsx")
);
const VerifyEmail = lazy(() => import("../views/Auth/VerifyEmail.jsx"));
const ResendVerification = lazy(() => import("../views/Auth/ResendVerification.jsx"));

// Error Views
const Error404 = lazy(() => import("../views/Error404.jsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        element: <LandingLayout />,
        children: [
          { index: true, element: <Landing /> },
          { path: "courses", element: <Courses /> },
          { path: "about", element: <About /> },
          { path: "search", element: <SearchResults /> },
          { path: "course/:id", element: <CourseDetails /> },
          { path: "contact", element: <ContactUs /> },
          { path: "feedback", element: <SendFeedback /> },
          { path: "terms", element: <TermsofUse /> },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
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
        element: <UserLayout />,
        children: [
          { path: "help", element: <HelpPage /> },
          { path: "notifications", element: <Notifications /> },
          { path: "settings", element: <SettingPage /> },
          { path: "edit-profile", element: <EditProfile /> },
        ],
      },
      {
        path: "student",
        element: <StuStudentLayout />,
        children: [
          { path: "dashboard", element: <StuDashboard /> },
          { path: "checkout", element: <StuCheckout /> },
          { path: "profile", element: <StuProfile /> },
          { path: "invoice", element: <StuInvoice /> },
          { path: "certificates", element: <StuMyCertificates /> },
          { path: "quiz/:courseid/:quizid", element: <StuQuizPage /> },
          { path: "quiz-result/:quizId", element: <StuQuizResult /> },
          { path: "course/:id", element: <StuCourseDetails /> },
          { path: "saved-courses", element: <StuSavedCourses /> },
          { path: "cart", element: <StuShoppingCart /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "lesson/:courseid/:lessonId", element: <StudentLessonPage /> },
          { path: "live-sessions", element: <LiveSessions /> },
          { path: "final-projects", element: <StuFinalProjects /> },
        ],
      },
      {
        path: "instructor",
        element: <InstructorLayout />,
        children: [
          { path: "dashboard", element: <InstrDashboard /> },
          { path: "courses", element: <InstCourses /> },
          { path: "create-course", element: <CreateCourse /> },
          { path: "edit-course/:courseid", element: <CreateCourse /> },
          { path: "create-lesson/:courseid", element: <CreateLesson /> },
          { path: "edit-lesson/:lessonid", element: <EditLesson /> },
          { path: "create-quiz/:courseid/:lessonId", element: <CreateQuiz /> },
          { path: "create-questions/:courseid/:lessonId/:quizid", element: <CreateQuestions /> },
          { path: "edit-quiz/:quizid/:courseId/:lessonId", element: <EditQuiz /> },
          { path: "course/:id", element: <InstructorCourseDetails /> },
          { path: "lesson/:id", element: <InstructorLessonDetails /> },
          { path: "quiz/:quizid/:courseId/:lessonId", element: <InstructorQuizDetails /> },
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
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "users", element: <UserManagement /> },
          { path: "courses", element: <CourseManagement /> },
          { path: "payments", element: <AdminPayments /> },
          { path: "logs", element: <AdminLogs /> },
          { path: "feedback", element: <FeedbackManagement /> },
        ],
      },
      { path: "*", element: <Error404 /> },
    ],
  },
]);