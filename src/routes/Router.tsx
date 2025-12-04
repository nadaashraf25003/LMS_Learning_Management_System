import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App.jsx";

// Lazy-loaded dashboards
const InstrDashboard = lazy(() => import("@/views/Instructor/InstrDashboard.jsx"));

// Admin Views
const UserManagement = lazy(() => import("@/views/Admin/UserManagement.jsx"));
const AdminDashboard = lazy(() => import("@/views/Admin/AdminDashboard.jsx"));
const CourseManagement = lazy(() => import("@/views/Admin/CourseManagement.jsx"));
const AdminLayout = lazy(() => import("@/components/AdminLayout/AdminLayout.jsx"));
const AdminProfile = lazy(() => import("@/views/Admin/AdminProfile.jsx"));
const AdminPayments = lazy(() => import("@/views/Admin/AdminPayments.jsx"));
const AdminLogs = lazy(() => import("@/views/Admin/AdminLogs.jsx"));

// Instructor Views
const InstructorLayout = lazy(() => import("@/components/InstructorLayout/InstructorLayout.jsx"));
const InstCourses = lazy(() => import("@/views/Instructor/InstCourses.jsx"));
const AllStudents = lazy(() => import("@/views/Instructor/AllStudents.jsx"));
const QuizManagement = lazy(() => import("@/views/Instructor/QuizManagement.jsx"));
const LessonManagement = lazy(() => import("@/views/Instructor/LessonManagement.jsx"));
const InstrProfile = lazy(() => import("@/views/Instructor/InstrProfile.jsx"));
const CreateCourse = lazy(() => import("@/views/Instructor/CreateCourse.jsx"));
const CreateLesson = lazy(() => import("@/views/Instructor/CreateLesson.jsx"));
const CreateQuiz = lazy(() => import("@/views/Instructor/CreateQuiz.jsx"));
const CreateQuestions = lazy(() => import("@/views/Instructor/CreateQuestions.jsx"));
const InstructorCourseDetails = lazy(() => import("@/views/Instructor/InstructorCourseDetails.jsx"));
const InstructorLessonDetails = lazy(() => import("@/views/Instructor/InstructorLessonDetails.jsx"));
const EditLesson = lazy(() => import("@/views/Instructor/EditLesson.jsx"));
const InstructorQuizDetails = lazy(() => import("@/views/Instructor/InstructorQuizDetails.jsx"));
const EditQuiz = lazy(() => import("@/views/Instructor/EditQuiz.jsx"));
const InstFinalProjects = lazy(() => import("@/views/Instructor/InstFinalProjects.jsx"));
const InstructorPayment = lazy(() => import("@/views/Instructor/InstructorPayment.jsx"));
const InstLiveSessions = lazy(() => import("@/views/Instructor/InstLiveSessions.jsx"));

// Student Views
const StuDashboard = lazy(() => import("@/views/Student/StuDashboard.jsx"));
const StuStudentLayout = lazy(() => import("@/components/StudentLayout/StudentLayout.jsx"));
const StuCheckout = lazy(() => import("@/views/Student/StuCheckout.jsx"));
const StuCourseDetails = lazy(() => import("@/views/Student/StuCourseDetails.jsx"));
const StuProfile = lazy(() => import("@/views/Student/StuProfile.jsx"));
const StuInvoice = lazy(() => import("@/views/Student/StuInvoice.jsx"));
const StuMyCertificates = lazy(() => import("@/views/Student/StuMyCertificates.jsx"));
const StuQuizPage = lazy(() => import("@/views/Student/StuQuizPage.jsx"));
const StuQuizResult = lazy(() => import("@/views/Student/StuQuizResult.jsx"));
const StuSavedCourses = lazy(() => import("@/views/Student/StuSavedCourses.jsx"));
const StuShoppingCart = lazy(() => import("@/views/Student/StuShoppingCart.jsx"));
const MyCourses = lazy(() => import("@/views/Student/MyCourses.jsx"));
const StudentLessonPage = lazy(() => import("@/views/Student/StudentLessonPage.jsx"));
const LiveSessions = lazy(() => import("@/views/Student/LiveSessions.jsx"));
const StuFinalProjects = lazy(() => import("@/views/Student/StuFinalProjects.jsx"));

// Others
const UserLayout = lazy(() => import("@/components/UserLayout/UserLayout.jsx"));
const ContactUs = lazy(() => import("@/views/Others/ContactUs.jsx"));
const HelpPage = lazy(() => import("@/views/Others/HelpPage.jsx"));
const Notifications = lazy(() => import("@/views/Others/Notifications.jsx"));
const SearchResults = lazy(() => import("@/views/Others/SearchResults/SearchResults.jsx"));
const SendFeedback = lazy(() => import("@/views/Others/SendFeedback.jsx"));
const SettingPage = lazy(() => import("@/views/Others/SettingPage.jsx"));
const TermsofUse = lazy(() => import("@/views/Others/TermsofUse.jsx"));
const EditProfile = lazy(() => import("@/views/Others/EditProfile.jsx"));
const FeedbackManagement = lazy(() => import("@/views/Admin/FeedbackManagement.jsx"));
const CourseDetails = lazy(() => import("@/views/Others/SearchResults/CourseDetails.jsx"));

// Landing Views
const LandingLayout = lazy(() => import("@/components/Landing/LandingLayout/LandingLayout.jsx"));
const Landing = lazy(() => import("@/views/Landing/Landing.jsx"));
const Courses = lazy(() => import("@/views/Landing/Courses.jsx"));
const About = lazy(() => import("@/views/Landing/About.jsx"));

// Auth Views
const AuthLayout = lazy(() => import("@/components/Auth/AuthLayout/AuthLayout.jsx"));
const Login = lazy(() => import("@/views/Auth/Login.jsx"));
const Register = lazy(() => import("@/views/Auth/Register/Register.jsx"));
const ForgetPassword = lazy(() => import("@/views/Auth/ForgetPassword.jsx"));
const ResetPassword = lazy(() => import("@/views/Auth/ResetPassword.jsx"));
const InstructorRegister = lazy(() => import("@/views/Auth/InstructorRegister.jsx"));
const VerifyEmail = lazy(() => import("@/views/Auth/VerifyEmail.jsx"));
const ResendVerification = lazy(() => import("@/views/Auth/ResendVerification.jsx"));

// Error Views
const Error404 = lazy(() => import("@/views/Error404.jsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <LandingLayout />,
        children: [
          { index: true, element: <Landing /> },
          { path: "Courses", element: <Courses /> },
          { path: "About", element: <About /> },
          { path: "SearchResults", element: <SearchResults /> },
          { path: "CourseDetails/:id", element: <CourseDetails /> },
          { path: "ContactUs", element: <ContactUs /> },
          { path: "SendFeedback", element: <SendFeedback /> },
          { path: "TermsofUse", element: <TermsofUse /> },
        ],
      },
      {
        path: "User",
        element: <AuthLayout />,
        children: [
          { path: "Login", element: <Login /> },
          { path: "Register", element: <Register /> },
          { path: "InstructorRegister", element: <InstructorRegister /> },
          { path: "ForgetPassword", element: <ForgetPassword /> },
          { path: "verify-email", element: <VerifyEmail /> },
          { path: "resend-verification", element: <ResendVerification /> },
          { path: "ResetPassword", element: <ResetPassword /> },
        ],
      },
      {
        path: "UserLayout",
        element: <UserLayout />,
        children: [
          { path: "HelpPage", element: <HelpPage /> },
          { path: "AllFeedback", element: <FeedbackManagement /> },
          { path: "Notifications", element: <Notifications /> },
          { path: "SettingPage", element: <SettingPage /> },
          { path: "EditProfile", element: <EditProfile /> },
        ],
      },
      {
        path: "StudentLayout",
        element: <StuStudentLayout />,
        children: [
          { path: "StuCheckout", element: <StuCheckout /> },
          { path: "StuProfile", element: <StuProfile /> },
          { path: "StuDashboard", element: <StuDashboard /> },
          { path: "StuInvoice", element: <StuInvoice /> },
          { path: "StuMyCertificates", element: <StuMyCertificates /> },
          { path: "StuQuizPage/:courseid/:quizid", element: <StuQuizPage /> },
          { path: "StuQuizResult/:quizId", element: <StuQuizResult /> },
          { path: "StuCourseDetails/:id", element: <StuCourseDetails /> },
          { path: "StuSavedCourses", element: <StuSavedCourses /> },
          { path: "StuShoppingCart", element: <StuShoppingCart /> },
          { path: "MyCourses", element: <MyCourses /> },
          { path: "StudentLessonPage/:courseid/:lessonId", element: <StudentLessonPage /> },
          { path: "LiveSessions", element: <LiveSessions /> },
          { path: "StuFinalProjects", element: <StuFinalProjects /> },
        ],
      },
      {
        path: "InstructorLayout",
        element: <InstructorLayout />,
        children: [
          { path: "InstrDashboard", element: <InstrDashboard /> },
          { path: "MyCourses", element: <InstCourses /> },
          { path: "CreateCourse", element: <CreateCourse /> },
          { path: "CreateLesson/:courseid", element: <CreateLesson /> },
          { path: "EditLesson/:lessonid", element: <EditLesson /> },
          { path: "CreateQuiz/:courseid/:lessonId", element: <CreateQuiz /> },
          { path: "CreateQuestions/:courseid/:lessonId/:quizid", element: <CreateQuestions /> },
          { path: "EditQuiz/:quizid/:courseId/:lessonId", element: <EditQuiz /> },
          { path: "CreateCourse/:courseid", element: <CreateCourse /> },
          {
            path: "InstCourseDetails/:id",
            element: <InstructorCourseDetails />,
          },
          {
            path: "InstLessonDetails/:id",
            element: <InstructorLessonDetails />,
          },
          {
            path: "InstQuizDetails/:quizid/:courseId/:lessonId",
            element: <InstructorQuizDetails />,
          },
          { path: "AllStudents", element: <AllStudents /> },
          { path: "QuizManagement", element: <QuizManagement /> },
          { path: "LessonManagement", element: <LessonManagement /> },
          { path: "InstrProfile", element: <InstrProfile /> },
          { path: "InstFinalProjects", element: <InstFinalProjects /> },
          { path: "InstructorPayment", element: <InstructorPayment /> },
          { path: "InstLiveSessions", element: <InstLiveSessions /> },
        ],
      },
      {
        path: "AdminLayout",
        element: <AdminLayout />,
        children: [
          { path: "AdminDashboard", element: <AdminDashboard /> },
          { path: "AdminProfile", element: <AdminProfile /> },
          { path: "UserManagement", element: <UserManagement /> },
          { path: "CourseManagement", element: <CourseManagement /> },
          { path: "AdminPayments", element: <AdminPayments /> },
          { path: "AdminLogs", element: <AdminLogs /> },
        ],
      },
      { path: "*", element: <Error404 /> },
    ],
  },
]);