import { useState, useCallback } from "react";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function useErrorToast() {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  const showErrorToast = useCallback(
    ({ title, description, action }) => {
      if (!isVisible) {
        setIsVisible(true);
        toast({
          variant: "destructive",
          title: title,
          description: description,
          action: action ? (
            <ToastAction altText="Try again">{action.text}</ToastAction>
          ) : null,
          onOpenChange: (open) => {
            if (!open) setIsVisible(false);
          },
        });
      }
    },
    [toast, isVisible]
  );

  return showErrorToast;
}

export function ErrorToast({ title, description, action }) {
  const showErrorToast = useErrorToast();

  return (
    <button
      className="sr-only"
      onClick={() => showErrorToast({ title, description, action })}
    >
      Show Error Toast
    </button>
  );
}
