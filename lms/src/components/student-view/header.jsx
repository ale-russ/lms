import React, { useContext } from "react";
import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

function StudentHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const handleLogout = () => {
    resetCredentials();
  };
  return (
    <div className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center hover:text-black">
          <GraduationCap className="h-8 w-8 mr-4 " />
          <span className="hidden md:block font-extrabold md:text-xl text-[14px]">
            LMS Learn
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="text-[14px] md:[16px] font-medium"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/student-courses")}
          >
            <span className="hidden md:block font-extrabold md:text-xl text-[14px]">
              My Courses
            </span>
            <TvMinimalPlay className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <Button onClick={handleLogout}>Sign Out</Button>
      </div>
    </div>
  );
}

export default StudentHeader;
