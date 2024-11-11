import { useEffect, useState } from "react";
import { toast } from "sonner";

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext } from "react";
import { checkAuthService, loginUser, registerUser } from "@/services";
import Loader from "@/components/loader";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
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
      toast.success(
        "Registration Successful. Please Login With Your Credentials"
      );
    } catch (err) {
      console.log("Error: ", err);
      toast.error(err || "Registration Failed. Please Try Again");
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
        toast.error("Login Failed");
      }
    } catch (err) {
      console.log("Error in login: ", err);
      toast.error(err || "Failed to login");
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
