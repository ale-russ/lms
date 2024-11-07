import { useContext, useEffect } from "react";
import { Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import Loader from "@/components/loader";

function StudentCourses() {
  const { auth } = useContext(AuthContext);
  const {
    studentBoughtCoursesList,
    setStudentBoughtCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    setLoadingState(true);
    try {
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
      if (response?.success) {
        setStudentBoughtCoursesList(response?.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  if (loadingState) return <Loader />;
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => {
            return (
              <Card key={course.id} className="flex flex-col">
                <CardContent className="p-4 flex-grow">
                  <img
                    src={course?.courseImage}
                    alt={course?.title}
                    className="h-52 w-full object-cover rounded-md mb-4"
                  />
                  <h3 className="font-bold mb-1">{course?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {course?.instructorName}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      navigate(`/course-progress/${course?.courseId}`)
                    }
                    className="flex-1"
                  >
                    <Watch className="mr-2 h-4 w-4" />
                    Start Watching
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCourses;