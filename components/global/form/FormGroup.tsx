import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface FormGroupProps {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  isTextArea?: boolean;
  onChange?: any;
}

function FormGroup({
  name,
  label,
  type,
  required = false,
  placeholder,
  defaultValue,
  isTextArea,
  onChange,
}: FormGroupProps) {
  const inputProps = {
    id: name,
    type: type,
    name: name,
    required: required,
    onChange: onChange,
    placeholder: placeholder,
    defaultValue: defaultValue,
    autoComplete:
      type === "email"
        ? "username"
        : type === "password"
        ? "current-password"
        : "off",
    "data-lpignore": "true", // LastPass ignore
    "data-1p-ignore": "true", // 1Password ignore
  };

  return (
    <div className="mt-4">
      <Label htmlFor={name} className="block text-sm mb-1">
        {label}
        {required && <span className="text-black/40">*</span>}
      </Label>
      {!isTextArea && <Input {...inputProps} />}
      {isTextArea && <textarea {...inputProps} />}
    </div>
  );
}

export default FormGroup;
