import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";
import React from "react";

const InstructorDashboard = ({ courses }) => {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = courses.reduce(
      (acc, course) => {
        const studentCount = course?.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course?.pricing * studentCount;

        course.students?.forEach((student) => {
          acc.studentList.push({
            // studentId: student.studentId,
            studentName: student?.studentName,
            studentEmail: student?.studentEmail,
            paidAmount: student?.paidAmount,
            courseId: course?._id,
            courseTitle: course?.title,
            coursePricing: course?.pricing,
          });
        });
        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );
    return { totalStudents, totalProfit, studentList };
  }

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: calculateTotalStudentsAndProfit().totalProfit,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item?.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item?.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Students Enrolled in Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Course Pricing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateTotalStudentsAndProfit().studentList.map(
                  (student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>{student.studentEmail}</TableCell>
                      <TableCell>${student.paidAmount}</TableCell>
                      <TableCell>{student.courseTitle}</TableCell>
                      <TableCell>${student.coursePricing}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InstructorDashboard;
