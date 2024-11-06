import React, { useContext, useEffect } from "react";

import { StudentContext } from "@/context/student-context";
import { AuthContext } from "@/context/auth-context";
import { fetchStudentBoughtCoursesService } from "@/services";

function StudentCourses() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);

  async function fetchStudentBoughtCourses() {
    try {
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
      console.log("Response: ", response);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);
  return <div></div>;
}

export default StudentCourses;
