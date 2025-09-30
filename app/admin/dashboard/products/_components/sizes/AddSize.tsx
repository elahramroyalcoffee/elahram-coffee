"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import SizeItem from "./SizeItem";

function AddSize({ onSuccess }: any) {
  const [isAdding, setIsAdding] = useState(false);

  // Create a fresh initial size each time
  const getInitialSize = () => ({
    weight: 250,
    size: "gm" as const,
  });

  const handleStartAdding = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleSuccess = () => {
    setIsAdding(false);
    onSuccess();
    // You might want to trigger a refresh of the parent component here
    // or handle success notification
  };

  return (
    <div>
      {isAdding ? (
        <SizeItem
          key="adding-new-size" // Ensure fresh component instance
          // @ts-ignore
          size={getInitialSize()}
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
          + إضافة حجم جديد
        </Button>
      )}
    </div>
  );
}

export default AddSize;
