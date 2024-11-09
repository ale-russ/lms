import React, { useContext, useEffect } from "react";

import banner from "../../../../public/lms.jpg";
import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
import Loader from "@/components/loader";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

const StudentHomePage = () => {
  const navigate = useNavigate();
  const {
    studentCourses,
    fetchAllStudentCourses,
    studentDataLoading,
    handleNavigateCourse,
  } = useContext(StudentContext);

  function handleNavigateToCoursesPage(categoryId) {
    console.log(categoryId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [categoryId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  useEffect(() => {
    fetchAllStudentCourses();
  }, []);

  return (
    <>
      {studentDataLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-white">
          <section className="flex flex-col lg:flex-row items-center justify-between py-4 md:py-8 px-4 md:lg:px-8">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Create Your Feature With Our Courses{" "}
              </h1>
              <p className="text-lg md:text-xl mb-4 font-semibold">
                Skill for your present and your future.
              </p>
            </div>
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <img
                src={banner}
                alt="banner"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg border"
              />
            </div>
          </section>
          <section className="py-6 md:py-8 px-4 lg:px-8 bg-gray-100">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              Course Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {courseCategories.map((category) => (
                <Button
                  className="justify-start"
                  variant="outline"
                  key={category.id}
                  onClick={() => handleNavigateToCoursesPage(category?.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </section>
          <section className="py-8 md:py-12 px-4 lg:px-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              Feature Courses
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {studentCourses && studentCourses.length > 0 ? (
                studentCourses.map((course) => (
                  <Card
                    key={course?._id}
                    className="border rounded-lg overflow-hidden shadow cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleNavigateCourse(course?._id)}
                  >
                    <CardContent className="p-4 flex-grow">
                      <img
                        src={course?.image?.secure_url}
                        alt="Course"
                        className="w-full h-32 sm:h-40 md:h-52 object-cover rounded-md mb-3 md:mb-4"
                      />
                      <div className="p-2">
                        <h3 className="font-bold mb-1 text-sm md:text-base truncate">
                          {course?.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-700 mb-2 capitalize font-semibold">
                          {course?.instructorName}
                        </p>
                        <p className="font-bold text-sm md:text-base">
                          ${course?.pricing}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <h1>No Courses Found</h1>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default StudentHomePage;
