import React, { useContext, useEffect } from "react";

import banner from "../../../../public/lms.jpg";
import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
import Loader from "@/components/loader";

const StudentHomePage = () => {
  const { studentCourses, fetchAllStudentCourses, studentDataLoading } =
    useContext(StudentContext);

  useEffect(() => {
    fetchAllStudentCourses();
  }, []);

  return (
    <>
      {studentDataLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-white">
          <section className="flex flex-col lg:flex-row items-center justify-between py-8 lg:px-8">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl font-bold mb-4">
                Create Your Feature With Our Courses{" "}
              </h1>
              <p className="text-xl">Skill for your present and your future.</p>
            </div>
            <div className="lg:w-full mb-8 lg:mb0">
              <img
                src={banner}
                alt="banner"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </section>
          <section className="py-8 px-4 lg:px-8 bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
            <div className="grid grid-col-2 sm:grid-col-3 md:grid-cols-4 gap-4">
              {courseCategories.map((category) => (
                <Button
                  className="justify-start"
                  variant="outline"
                  key={category.id}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </section>
          <section className="py-12 px-4 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Feature Courses</h2>
            <div className="grid grid-cols-2 sm:grid-cols lg:grid-cols-4 gap-6">
              {studentCourses && studentCourses.length > 0 ? (
                studentCourses.map((course) => (
                  <div
                    key={course?._id}
                    className="border rounded-lg overflow-hidden shadow cursor-pointer"
                  >
                    <img
                      src={course?.image?.secure_url}
                      alt="Course"
                      className="w-full h-52 object-cover rounded-md mb-4"
                    />

                    <div className="p-4">
                      <h3 className="font-bold mb-2">{course?.title}</h3>
                      <p className="text-sm text-gray-700 mb-2 capitalize font-semibold">
                        {course?.instructorName}
                      </p>
                      <p className="font-bold text-[16px]">
                        ${course?.pricing}
                      </p>
                    </div>
                  </div>
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
