import { createContext, useContext, useState } from "react";

import {
  courseLandingInitialFormData,
  courseCurriculumInitialFormData,
} from "@/config";
import { fetchInstructorCoursesService } from "@/services";
import { AuthContext } from "../auth-context";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadPercentage, setMediaUploadPercentage] = useState(0);
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  const fetchCourses = async () => {
    const response = await fetchInstructorCoursesService(auth?.user?._id);

    if (response?.success) {
      setInstructorCourses(response.data);
    }
  };

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        courseCurriculumFormData,
        mediaUploadProgress,
        mediaUploadPercentage,
        instructorCourses,
        currentEditedCourseId,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        setMediaUploadProgress,
        setMediaUploadPercentage,
        setInstructorCourses,
        setCurrentEditedCourseId,
        fetchCourses,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
