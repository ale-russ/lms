import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

export function ErrorToast() {
  const { toast } = useToast();
  const { showError, setShowError, toastType } = useContext(AuthContext);

  console.log("ShowError in hook: ", showError);
  console.log("Error Type: ", toastType);

  useEffect(() => {
    toast({
      variant: toastType,
      title: showError.title,
      description: showError.description,
      // action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
    // setTimeout(
    //   () => setShowError({ title: "", description: "", show: false }),
    //   5000
    // );
  }, [showError, toast, toastType, setShowError]);

  return;
}
