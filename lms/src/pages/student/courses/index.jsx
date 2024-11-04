import React, { useContext, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { filterOptions, sortOptions } from "@/config";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentContext } from "@/context/student-context";
import { fetchAllStudentCoursesService } from "@/services";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

function StudentCoursesViewPage() {
  const [sort, setSort] = useState("");
  const { studentCourses, setStudentCourses } = useContext(StudentContext);

  async function fetchAllStudentCourses() {
    const response = await fetchAllStudentCoursesService();
    console.log("Response: ", response);
    if (response?.success) {
      setStudentCourses(response?.data);
    }
  }

  useEffect(() => {
    fetchAllStudentCourses();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className="p-4 space-y-4">
            <div className=" space-y-4">
              {Object.keys(filterOptions).map((keyItem, index) => (
                <div className="p-4 space-y-4" key={index}>
                  <h3 className="font-bold mb-3">
                    {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                  </h3>
                  <div className="grid gap-2 mt-2">
                    {filterOptions[keyItem].map((option) => (
                      <Label
                        className="flex font-medium items-center gap-3"
                        key={option.id}
                      >
                        <Checkbox
                          checked={false}
                          //   onCheckedChange={() =>
                          //     handleFilterOnChange(keyItem, option.id)
                          //   }
                        />
                        {option.label}
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
                <DropdownMenuContent aline="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value)}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        key={sortItem.id}
                        value={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenuTrigger>
            </DropdownMenu>
            <span className="text-sm text-gray-600 font-bold">
              10 Result Found
            </span>
          </div>
          <div className="space-y-4">
            {studentCourses && studentCourses.length > 0 ? (
              studentCourses.map((course) => (
                <Card key={course._id} className="cursor-pointer">
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={course?.image?.secure_url}
                        alt={course?.image.public_id}
                        className="w-full h-full object-cover rounded-md shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {course?.title}
                      </CardTitle>

                      <p className="text-sm text-gray-600 mb-1 capitalize font-semibold">
                        Created By{" "}
                        <span className="font-bold">
                          {" "}
                          {course?.instructorName}
                        </span>
                      </p>
                      <p className="text-base text-gray-600 font-semibold mt-3 mb-2 capitalize">
                        {`  ${course?.curriculum?.length} ${
                          course?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        }  - 
                        ${course?.level.toUpperCase()}`}
                      </p>
                      <p className="font-bold text-lg">${course?.pricing}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h1>No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentCoursesViewPage;
