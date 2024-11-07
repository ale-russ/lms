import React, { useContext, useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/video-player";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";

function StudentCourseDetailsPage() {
  const {
    studentCourseDetails,
    setStudentCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [purchasedCourseId, setPurchasedCourseId] = useState(null);

  const params = useParams();
  const location = useLocation();

  async function fetchStudentCourseDetails(courseId) {
    try {
      setLoadingState(true);
      const response = await fetchStudentCourseDetailsService(
        courseId,
        auth?.user?._id
      );

      if (response?.success && response?.purchasedCourseId) {
        setPurchasedCourseId(response?.purchasedCourseId);
        navigate(`/course-progress/${response.purchasedCourseId}`, {
          replace: true,
        });
        return;
      }

      // Only set course details if course is not purchased
      setCurrentCourseDetailsId(courseId);
      setStudentCourseDetails(response?.data);
    } catch (err) {
      setStudentCourseDetails(null);
    } finally {
      setTimeout(() => setLoadingState(false), 300);
    }
  }

  function handleSetFreePreview(item) {
    setDisplayCurrentVideoFreePreview(item?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethods: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentCourseDetails?.instructorId,
      instructorName: studentCourseDetails?.instructorName,
      courseId: studentCourseDetails?._id,
      courseTitle: studentCourseDetails?.title,
      coursePricing: `${studentCourseDetails?.pricing}`,
      courseImage: studentCourseDetails?.image?.url,
    };

    const response = await createPaymentService(paymentPayload);

    if (response?.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );

      window.location.replace(response?.data?.approvalUrl);
    } else {
      console.log("Error response: ", response);
      showErrorToast({
        title: "Payment Error",
        description: response?.message,
        tryAgin: false,
      });
    }
  }

  useEffect(() => {
    if (params?.id && params.id !== currentCourseDetailsId) {
      setCurrentCourseDetailsId(params.id);
      fetchStudentCourseDetails(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (!location.pathname.includes("/course/details")) {
      setCurrentCourseDetailsId(null);
      setStudentCourseDetails(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  const getIndexOfFreePreviewUrl =
    studentCourseDetails !== null
      ? studentCourseDetails?.curriculum?.findIndex((item) => item.freePreview)
      : -1;

  if (loadingState || !studentCourseDetails) return <Loader />;

  if (purchasedCourseId !== null) {
    return <Navigate to={`/course-progress/${purchasedCourseId}`} replace />;
  }
  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentCourseDetails?.subtitle}</p>
        <div className=" flex items-center flex-wrap space-x-4  mt-2 text-sm">
          <p>
            Created By{" "}
            <span className="capitalize font-semibold">
              {" "}
              {studentCourseDetails?.instructorName}
            </span>
          </p>
          <p>
            Created At
            <span className="capitalize font-semibold">
              {" "}
              {studentCourseDetails?.date.split("T")[0]}
            </span>
          </p>
          <p>
            Created At
            <span className="capitalize font-semibold">
              {" "}
              {studentCourseDetails?.date.split("T")[0]}
            </span>
          </p>
          <p className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            <span className="capitalize font-semibold">
              {" "}
              {studentCourseDetails?.primaryLanguage}
            </span>
          </p>
          <p>
            <span className="capitalize font-semibold">
              {" "}
              {studentCourseDetails?.students?.length}{" "}
              {studentCourseDetails?.students?.length <= 1
                ? "Student"
                : "Students"}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentCourseDetails?.objectives
                  ?.split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentCourseDetails?.description}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentCourseDetails?.curriculum?.map((curriculumItem) => (
                <li
                  key={curriculumItem?._id}
                  className={`${
                    curriculumItem?.freePreview
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  } flex items-center mb-4`}
                  onClick={() =>
                    curriculumItem?.freePreview
                      ? handleSetFreePreview(curriculumItem)
                      : {}
                  }
                >
                  {curriculumItem?.freePreview ? (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  <span>{curriculumItem?.title}</span>
                </li>
              ))}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px] ">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1 &&
                    studentCourseDetails?.curriculum[getIndexOfFreePreviewUrl]
                      ?.videoUrl
                  }
                  //   width="450px"
                  //   height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${studentCourseDetails?.pricing}
                </span>
              </div>
              <Button className="w-full" onClick={handleCreatePayment}>
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setDisplayCurrentVideoFreePreview(null);
          setShowFreePreviewDialog(false);
        }}
      >
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>

          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              //   width="450px"
              //   height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            {studentCourseDetails?.curriculum
              ?.filter((item) => item?.freePreview)
              .map((filteredItem) => {
                return (
                  <p
                    key={filteredItem._id}
                    className="cursor-pointer text-[16px] font-medium"
                    onClick={() => {
                      handleSetFreePreview(filteredItem);
                    }}
                  >
                    {filteredItem?.title}
                  </p>
                );
              })}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <ErrorToast
        title={showErrorToast.title}
        description={showErrorToast.description}
        action={{ text: "", onClick: () => {} }}
      /> */}
    </div>
  );
}

export default StudentCourseDetailsPage;
