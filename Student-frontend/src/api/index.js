import axios from "axios";

const API = axios.create({
      // baseURL: "http://localhost:8000/api/v1",old
      baseURL: import.meta.env.VITE_API_URL + "/api/v1",
})


// Har request mein token add karo
API.interceptors.request.use((config)=>{
  const token = localStorage.getItem("token");
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;

});

//401 ke leye 
API.interceptors.response.use(
  (response)=> response,
  (error)=>{
    if(error.response?.status==401){
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href= "/login";
    }
    return Promise.reject(error);
  }
);

//auth
export const register = (data)=> API.post("/auth/register", data);
export const login = (data)=> API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

//student api
export const getAllStudents = () => API.get("/students");
export const getStudents = getAllStudents;
export const getStudentById = (id) => API.get(`/students/${id}`);
export const  createStudent = (data) => API.post("/students", data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

//  Course
export const getAllCourses = () => API.get("/courses");
export const getCourses = getAllCourses;
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const createCourse = (data)=> API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Enrollments

export const getEnrollments  =() => API.get("/enrollments");
export const  createEnrollment = (data) => API.post("/enrollments", data);
export const getEnrollmentById = (id) => API.get(`/enrollments/${id}`);


// // Documents

export const getStudentDocuments= (id) => API.get(`/documents/${id}`)
export const uploadDocument = (id, formData) =>
  API.post(`/documents/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocument=(id)=> API.delete(`/documents/${id}`)


// logs

export const getAllLogs = () => API.get("/logs");
export const getStudentLogs = (id) => API.get(`/logs/students/${id}`);
export const getCourseLogs = (id) => API.get(`/logs/courses/${id}`);
export const getAllStudentLogs =() => API.get("/logs/students");
export const getAllCourseLogs =() => API.get("/logs/courses");