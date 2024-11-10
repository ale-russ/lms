import axiosInstance from "@/api/axiosInstance";
import { progress } from "framer-motion";

export async function registerUser(formData) {
  try {
    await axiosInstance.post("/auth/register", formData);
  } catch (error) {
    throw error?.response?.data?.message;
  }
}

export async function loginUser(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/login", formData);

    return data;
  } catch (error) {
    console.log("Error: ", error);
    throw error?.response?.data?.message;
  }
}

export async function checkAuthService() {
  try {
    const { data } = await axiosInstance.get("/auth/check-auth");
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
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
    throw error?.response?.data?.message;
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
    throw error?.response?.data?.message;
  }
}
export async function mediaDeleteService(courseId, videoId, type = "image") {
  try {
    const { data } = await axiosInstance.delete(`media/delete/${videoId}`, {
      data: { courseId, type },
    });
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
  }
}

export async function fetchInstructorCoursesService() {
  try {
    const { data } = await axiosInstance.get(`/instructor/courses/get`, {});
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
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
    throw error?.response?.data?.message;
  }
}

export async function fetchInstructorCourseDetailsService(id) {
  try {
    const { data } = await axiosInstance.get(
      `/instructor/courses/get/details/${id}`
    );
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
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
    throw error?.response?.data?.message;
  }
}

export async function fetchAllStudentCoursesService(query) {
  try {
    const { data } = await axiosInstance.get(`/student/courses/get?${query}`);
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
  }
}

export async function fetchStudentCourseDetailsService(id) {
  try {
    const { data } = await axiosInstance.get(
      `/student/courses/get/details/${id}`
    );
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
  }
}
export async function checkCoursePurchaseInfoService(courseId, studentId) {
  try {
    const { data } = await axiosInstance.get(
      `/student/courses/purchase-info/${courseId}/${studentId}`
    );
    return data;
  } catch (error) {
    throw error?.response?.data?.message;
  }
}

export async function createPaymentService(paymentPayload) {
  try {
    const { data } = await axiosInstance.post(
      `/student/order/create`,
      paymentPayload
    );

    return data;
  } catch (err) {
    console.log("Error create payments: ", err);
    return err.response?.data;
  }
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  try {
    const { data } = await axiosInstance.post(`/student/order/capture`, {
      paymentId,
      payerId,
      orderId,
    });
    return data;
  } catch (err) {
    console.log("Error: ", err);
  }
}

export async function fetchStudentBoughtCoursesService(studentId) {
  try {
    const { data } = await axiosInstance.get(
      `/student/courses-bought/get/${studentId}`
    );
    return data;
  } catch (err) {
    console.log("Error: ", err);
  }
}
export async function getCurrentStudentCourseProgressService(
  studentId,
  courseId
) {
  try {
    const { data } = await axiosInstance.get(
      `/student/course-progress/get/${studentId}/${courseId}`
    );
    return data;
  } catch (err) {
    console.log("Error: ", err);
  }
}

export async function markCurrentLectureAsViewedService(
  userId,
  courseId,
  lectureId
) {
  try {
    const { data } = await axiosInstance.post(
      `/student/course-progress/mark-lecture-viewed`,
      { userId, courseId, lectureId }
    );
    return data;
  } catch (err) {
    console.log("Error: ", err);
  }
}

export async function resetCurrentCourseProgressService(userId, courseId) {
  try {
    const { data } = await axiosInstance.post(
      `/student/course-progress/reset-progress`,
      { userId, courseId }
    );
    return data;
  } catch (err) {
    console.log("Error: ", err);
  }
}
