"use client";
import React, { useActionState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface FormProviderProps {
  action: (prevState: any, formData: FormData) => Promise<{ message: string }>;
  children: React.ReactNode;
  onSuccess?: () => void;
  id?: string;
  className?: string;
}

const initState = {
  message: "",
};

function FormProvider({
  action,
  children,
  onSuccess,
  id,
  className,
}: FormProviderProps) {
  const [state, formAction] = useActionState(action, initState);

  useEffect(() => {
    if (state?.message) {
      toast(state.message);
      onSuccess && onSuccess();
    }
  }, [state]);

  return (
    <form action={formAction} id={id} className={className}>
      {children}
      {/* <Toaster /> */}
    </form>
  );
}

export default FormProvider;
