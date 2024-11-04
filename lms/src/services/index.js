import axiosInstance from "@/api/axiosInstance";
import { progress } from "framer-motion";

export async function registerUser(formData) {
  try {
    await axiosInstance.post("/auth/register", formData);
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function loginUser(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/login", formData);

    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function checkAuthService() {
  try {
    const { data } = await axiosInstance.get("/auth/check-auth");
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function mediaUploadService(formData, onProgressCallback) {
  try {
    const { data } = await axiosInstance.post("/media/upload", formData, {
      onUploadProgress: (ProgressEvent) => {
        const percentCompleted = Math.round(
          (ProgressEvent.loaded * 100) / ProgressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function mediaBulkUploadService(formData, onProgressCallback) {
  try {
    const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
      onUploadProgress: (ProgressEvent) => {
        const percentCompleted = Math.round(
          (ProgressEvent.loaded * 100) / ProgressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function mediaDeleteService(courseId, videoId, type = "image") {
  try {
    const { data } = await axiosInstance.delete(`media/delete/${videoId}`, {
      data: { courseId, type },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchInstructorCoursesService() {
  try {
    const { data } = await axiosInstance.get(`/instructor/courses/get`, {});
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function addNewCoursesService(formData) {
  try {
    const { data } = await axiosInstance.post(
      `/instructor/courses/add`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchInstructorCourseDetailsService(id) {
  try {
    const { data } = await axiosInstance.get(
      `/instructor/courses/get/details/${id}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCourseService(id, formData) {
  try {
    const { data } = await axiosInstance.put(
      `/instructor/courses/update/${id}`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAllStudentCoursesService() {
  try {
    const { data } = await axiosInstance.get(`/student/courses/get`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchStudentCourseDetailsService(courseId) {
  try {
    const { data } = await axiosInstance.get(
      `/student/courses/get/details/${courseId}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}
