import { useEffect, useState } from "react";

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext } from "react";
import { checkAuthService, loginUser, registerUser } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

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
    await registerUser(signUpFormData);
  }

  async function handleLoginUser(e) {
    e.preventDefault();
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
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
