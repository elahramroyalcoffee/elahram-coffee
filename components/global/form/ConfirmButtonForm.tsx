"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import FormProvider from "./FormProvider";
import SubmitButton from "./SubmitButton";

interface ConfirmButtonProps {
  title: string;
  variant?:
    | "secondary"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | null
    | undefined;
  action: (prevState: any, formData: FormData) => Promise<{ message: string }>;
  children?: React.ReactNode;
  size?: "default" | "lg" | "sm" | "icon" | null | undefined;
  id?: string;
  className?: string;
  onSuccess?: any;
}

function ConfirmButton({
  title,
  variant = "secondary",
  action,
  children,
  size = "lg",
  id = "delete-category-form",
  className = "",
  onSuccess = undefined,
}: ConfirmButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const buttonClick = (e: any) => {
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
    }, 5000);
  };

  return (
    <>
      <FormProvider
        action={action}
        id={id}
        className={className}
        onSuccess={onSuccess}
      >
        {children}
        {!showConfirm && (
          <Button
            variant={variant}
            type="button"
            className="w-full "
            size={size}
            onClick={buttonClick}
          >
            {title}
          </Button>
        )}

        {showConfirm && (
          <SubmitButton
            text={"هل أنت متأكد؟"}
            className="w-full"
            form={id}
            size={size}
          />
        )}
      </FormProvider>
    </>
  );
}

export default ConfirmButton;
