import { createContext, useState } from "react";

export const StudentContext = createContext();

export default function StudentProvider({ children }) {
  const [loadingState, setLoadingState] = useState(false);
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentCourseDetails, setStudentCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  return (
    <StudentContext.Provider
      value={{
        studentCourses,
        setStudentCourses,
        loadingState,
        setLoadingState,
        studentCourseDetails,
        setStudentCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
