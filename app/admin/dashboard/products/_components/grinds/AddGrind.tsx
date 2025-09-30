"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import GrindItem from "./GrindItem";
import { GrindTypes } from "@/lib/types";

interface AddGrindProps {
  onSuccess?: () => void;
}

function AddGrind({ onSuccess }: AddGrindProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Create a fresh initial grind each time
  const getInitialGrind = (): GrindTypes => ({
    id: 0, // Temporary ID for new grind
    name: "",
  });

  const handleStartAdding = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleSuccess = () => {
    setIsAdding(false);
    // Trigger parent component refresh
    onSuccess?.();
  };

  return (
    <div>
      {isAdding ? (
        <GrindItem
          key="adding-new-grind" // Ensure fresh component instance
          grind={getInitialGrind()}
          mode="add"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <Button
          className="mt-4 w-full"
          onClick={handleStartAdding}
          variant="outline"
        >
          + إضافة طحنة جديدة
        </Button>
      )}
    </div>
  );
}

export default AddGrind;
