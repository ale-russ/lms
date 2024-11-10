import { useEffect, useState } from "react";

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext } from "react";
import { checkAuthService, loginUser, registerUser } from "@/services";
import Loader from "@/components/loader";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [showError, setShowError] = useState({
    title: "",
    description: "",
    show: false,
  });
  const [toastType, setToastType] = useState("");
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser(signUpFormData);
    } catch (err) {
      console.log("Error: ", err);
      setShowError({
        title: "Login Error",
        description: err,
        show: true,
      });
      setToastType("destructive");
    } finally {
      setSignUpFormData(initialSignUpFormData);
      setLoading(false);
    }
  }

  async function handleLoginUser(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(signInFormData);
      if (data?.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({ authenticate: true, user: data.data.user });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (err) {
      console.log("Error in login: ", err);
      setShowError({
        title: "Login Error",
        description: err,
        show: true,
      });
      setToastType("destructive");
      setAuth({ authenticate: false, user: null });
    } finally {
      setSignInFormData(initialSignInFormData);
      setLoading(false);
    }
  }

  //check auth user
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();

      if (data?.success) {
        setAuth({ authenticate: true, user: data.data.user });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (error) {
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
    sessionStorage.removeItem("accessToken");
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        signUpFormData,
        setSignInFormData,
        setSignUpFormData,
        showError,
        setShowError,
        toastType,
        setToastType,
        loading,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
}
