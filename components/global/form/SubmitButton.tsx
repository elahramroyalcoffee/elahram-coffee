"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon" | null | undefined;
  form?: string;
  varient?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

function SubmitButton({
  text,
  className,
  size = "lg",
  form,
  varient,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      form={form}
      type="submit"
      size={size}
      disabled={pending}
      className={className ? className : ""}
      variant={varient}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          برجاء الإنتظار
        </div>
      ) : (
        text
      )}
    </Button>
  );
}

export default SubmitButton;
