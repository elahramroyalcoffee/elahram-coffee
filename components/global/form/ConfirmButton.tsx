"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { createPortal, useFormState, useFormStatus } from "react-dom";
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
  action: any;
}

function ConfirmButton({
  title,
  variant = "secondary",
  action,
}: ConfirmButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        variant={variant}
        type="button"
        className="w-full"
        size="lg"
        disabled={pending}
        onClick={() => (showConfirm ? action() : setShowConfirm(true))}
      >
        {showConfirm ? "Confirm?" : title}
      </Button>
    </>
  );
}

export default ConfirmButton;
