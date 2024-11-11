import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/auth-context";
import InstructorProvider from "./context/instructor-context";
import StudentProvider from "./context/student-context";
import { ToastProvider } from "./components/ui/toast";
// import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ToastProvider> */}
    <Toaster richColors />
    <BrowserRouter>
      <AuthProvider>
        <InstructorProvider>
          <StudentProvider>
            <App />
            <Toaster />
          </StudentProvider>
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
    {/* </ToastProvider> */}
  </StrictMode>
);
