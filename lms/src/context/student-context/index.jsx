import { fetchAllStudentCoursesService } from "@/services";
import { createContext, useState } from "react";

export const StudentContext = createContext();

export default function StudentProvider({ children }) {
  const [loadingState, setLoadingState] = useState(false);
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentCourseDetails, setStudentCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");

  async function fetchAllStudentCourses() {
    try {
      setLoadingState(true);
      const response = await fetchAllStudentCoursesService();

      if (response?.success) {
        setStudentCourses(response?.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoadingState(false);
    }
  }

  async function fetchAllFilteredStudentCourses(filters, sort) {
    setLoadingState(true);
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    try {
      const response = await fetchAllStudentCoursesService(query);

      if (response?.success) {
        setStudentCourses(response?.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoadingState(false);
    }
  }

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function createSearchParamsHelper(filtersParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filtersParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  }

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
        filters,
        setFilters,
        sort,
        setSort,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
        fetchAllStudentCourses,
        handleFilterOnChange,
        createSearchParamsHelper,
        fetchAllFilteredStudentCourses,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
