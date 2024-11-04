import React, { useContext, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import MediaProgressbar from "@/components/common-form/media-progress";
import VideoPlayer from "@/components/video-player";
import { Upload } from "lucide-react";

const CourseCurriculum = () => {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadPercentage,
    setMediaUploadPercentage,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const bulkUploadRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    const videoFormData = new FormData();
    if (selectedFile) {
      videoFormData.append("file", selectedFile);
    }

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        videoFormData,
        setMediaUploadPercentage
      );

      if (response.success) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
          ...cpyCourseCurriculumFormData[currentIndex],
          videoUrl: response?.data?.url,
          public_id: response?.data?.public_id,
        };

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    setMediaUploadProgress(false);
  }

  function isCourseCurriculumDataValid() {
    return courseCurriculumFormData.every((item) => {
      const isValid =
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== "" &&
        item.freePreview !== undefined;

      return isValid;
    });
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentVideoPublicId, "video");

    if (response?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function handleOpenBulkUpload() {
    bulkUploadRef.current?.click();
  }

  function isCurriculumFormDataEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleBulkUpload(event) {
    event.preventDefault();
    const selectedFiles = Array.from(event.target.files);
    console.log("selectedFiles: ", selectedFiles);

    const bulkFormData = new FormData();
    selectedFiles.forEach((fileItem) => {
      console.log("FileItem: ", fileItem);
      bulkFormData.append("files", fileItem);
    });

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadPercentage
      );
      console.log("Bulk upload: ", response);
      if (response?.success) {
        let cpyCourseCurriculumFormData = isCurriculumFormDataEmpty(
          courseCurriculumFormData
        )
          ? []
          : [...courseCurriculumFormData];

        cpyCourseCurriculumFormData = [
          ...cpyCourseCurriculumFormData,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormData.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    console.log("Current course id: ", currentEditedCourseId);
    console.log("Index: ", currentIndex);
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    console.log("data: ", cpyCourseCurriculumFormData[currentIndex]);
    const response = await mediaDeleteService(
      currentEditedCourseId,
      cpyCourseCurriculumFormData[currentIndex].public_id,
      "video"
    );
    console.log("Response: ", response);
    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        Create Course Curriculum
        <div>
          <Input
            className="hidden"
            id="bulk-upload"
            type="file"
            name="files"
            accept="video/*"
            multiple
            ref={bulkUploadRef}
            onChange={handleBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadPercentage ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadPercentage}
          />
        ) : null}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div className="border p-2 lg:p-5 rounded-md" key={index}>
              <div className="flex flex-wrap gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>

                <Input
                  name={`title -${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={curriculumItem?.title}
                />
                <div className="flex item-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={curriculumItem?.freePreview}
                    id={`freePreview -${index + 1}`}
                  />
                  <Label htmlFor={`freePreview -${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {curriculumItem?.videoUrl ? (
                  <div className="flex flex-col-reverse lg:flex-row  lg:justify-between items-start gap-4">
                    <div className="w-full ">
                      <VideoPlayer
                        url={curriculumItem?.videoUrl}
                        height="400px"
                        // width="450px"
                      />
                    </div>
                    <div className="flex gap-2 lg:flex-col lg:items-end">
                      <Button onClick={() => handleReplaceVideo(index)}>
                        Replace Video
                      </Button>
                      <Button
                        className="bg-red-700"
                        onClick={() => handleDeleteLecture(index)}
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    className="mb-4"
                    onChange={(event) => handleSingleUpload(event, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
