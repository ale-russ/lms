import React, { useContext } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaDeleteService, mediaUploadService } from "@/services";
import MediaProgressbar from "@/components/common-form/media-progress";
import { Button } from "@/components/ui/button";

const CourseSettings = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadPercentage,
    setMediaUploadPercentage,
  } = useContext(InstructorContext);

  async function handleImageUpload(event) {
    const selectedImage = event.target.files[0];

    const imageFormData = new FormData();
    if (selectedImage) {
      imageFormData.append("file", selectedImage);
    }
    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        imageFormData,
        setMediaUploadPercentage
      );
      if (response.success) {
        setCourseLandingFormData({
          ...courseLandingFormData,
          image: response.data,
        });
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    setMediaUploadProgress(false);
  }

  const handleReplaceImage = async (image) => {
    let cpyCourseCurriculumFormData = { ...courseLandingFormData };

    const response = await mediaDeleteService(image?.public_id);
    if (response?.success) {
      cpyCourseCurriculumFormData = {
        ...cpyCourseCurriculumFormData,
        image: {
          asset_id: "",
          displayName: "",
          format: "",
          public_id: "",
          url: "",
        },
      };
      setCourseLandingFormData(cpyCourseCurriculumFormData);
    }
  };

  return (
    <Card>
      <CardHeader>Course Setting</CardHeader>
      {mediaUploadPercentage ? (
        <MediaProgressbar
          isMediaUploading={mediaUploadProgress}
          progress={mediaUploadPercentage}
        />
      ) : null}
      <CardContent>
        {courseLandingFormData?.image?.url ? (
          <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4 md:gap-6">
            <div className="w-full h-auto ">
              <img
                src={courseLandingFormData.image.url}
                alt="Course Image"
                className="w-full h-72 sm:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <Button
                onClick={() => handleReplaceImage(courseLandingFormData.image)}
                className="text-center md:w-auto"
              >
                Replace Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUpload}
              type="file"
              accept="image/*"
              className="mb-4"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
