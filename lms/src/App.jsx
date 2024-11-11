import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

import "./App.css";

import AuthPage from "./pages/auth";
import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentCoursesViewPage from "./pages/student/courses";
import StudentCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCourses from "./pages/student/student-courses";
import StudentCourseProgressPage from "./pages/student/course-progress";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentCoursesViewPage />} />
          <Route
            path="course/details/:id"
            element={<StudentCourseDetailsPage />}
          />
          <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
          <Route path="student-courses" element={<StudentCourses />} />
          <Route
            path="course-progress/:courseId"
            element={<StudentCourseProgressPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
