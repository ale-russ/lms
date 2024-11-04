import { createContext, useState } from "react";

export const StudentContext = createContext();

export default function StudentProvider({ children }) {
  const [studentCourses, setStudentCourses] = useState([]);
  return (
    <StudentContext.Provider value={{ studentCourses, setStudentCourses }}>
      {children}
    </StudentContext.Provider>
  );
}
