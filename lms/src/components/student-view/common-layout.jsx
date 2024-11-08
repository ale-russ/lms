import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentHeader from "./header";

const StudentViewCommonLayout = () => {
  const location = useLocation();

  return (
    <div>
      {!location?.pathname?.includes("course-progress") ? (
        <StudentHeader />
      ) : (
        <div className="hidden" />
      )}
      <Outlet />
    </div>
  );
};

export default StudentViewCommonLayout;
