import { useEffect, useState } from "react";

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext } from "react";
import { checkAuthService, loginUser, registerUser } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/loader";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
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
      // console.log("Error: ", error);

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
