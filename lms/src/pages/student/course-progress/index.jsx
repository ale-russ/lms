import React, { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentStudentCourseProgressService,
  markCurrentLectureAsViewedService,
} from "@/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ReactConfetti from "react-confetti";
import VideoPlayer from "@/components/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

function StudentCourseProgressPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseComplete, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  async function fetchCurrentCourseProgress() {
    try {
      const response = await getCurrentStudentCourseProgressService(
        auth?.user?._id,
        courseId
      );

      console.log("Response: ", response);
      // if (response?.success) {
      //   if (!response?.data?.isPurchased) {
      //     setLockCourse(true);
      //   } else {
      //     setStudentCurrentCourseProgress({
      //       courseDetails: response?.data?.courseDetails,
      //       progress: response?.data?.progress,
      //     });
      //     if (response?.data?.completed) {
      //       setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
      //       setShowCourseCompleteDialog(true);
      //       setShowConfetti(true);

      //       return;
      //     }

      //     if (response?.data?.progress?.length === 0) {
      //       setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
      //       return;
      //     }
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          // for later
          console.log("for later use");
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markCurrentLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id
      );

      console.log("Response: ", response);

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, []);

  useEffect(() => {
    console.log("progressValue: ", currentLecture?.progressValue === 1);

    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 5000);
  }, [showConfetti]);

  console.log("currentLecture: ", currentLecture);

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <ReactConfetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4" size="sm">
          <Button
            variant="ghost"
            className="text-gray-600"
            onClick={() => navigate("/student-courses")}
          >
            <span className="hidden sm:inline"> Back to My Courses Page</span>
            <span className="sm:hidden">Back</span>
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Button>
          <h1 className="text-sm sm:text-lg font-bold truncate max-w-[200px] sm:max-w-none">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden relative ">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="60%"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-3 sm:p-6 bg-[#1c1d1f]">
            <h2 className="text-lg sm:text-2xl font-bold mb-2">
              {currentLecture?.title}
            </h2>
          </div>
        </div>
        <div
          className={`fixed md:static top-[146px] right-0 bottom-0 w-full  md:w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 p-0 h-12 sm:h-14 bg-[#1c1d1f] ">
              <TabsTrigger
                value="content"
                className="bg-white text-gray-700 rounded-none h-full text-sm sm:text-base "
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="bg-white text-gray-700 rounded-none h-full text-sm sm:text-base"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
                    (curriculum) => {
                      return (
                        <div
                          key={curriculum?._id}
                          className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                        >
                          <span>{curriculum?.title}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex- overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About This Course</h2>
                  <p className="text-gray-300">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader asChild>
            <DialogTitle>You Can't view This Page</DialogTitle>
            <DialogDescription>
              Please Purchase This Course To Get Access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseComplete}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Congratulations!!! You Have Successfully Completed The Course
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label> You Have Completed The Course</Label>
              <div className="flex flex-row gap-3">
                <Button>My Courses Page</Button>
                <Button>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentCourseProgressPage;
