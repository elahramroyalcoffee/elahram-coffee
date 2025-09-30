"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import AddOnItem from "./AddOnItem";
import { AddOnTypes } from "@/lib/types";

interface AddAddOnProps {
  onSuccess?: () => void;
}

function AddAddOn({ onSuccess }: AddAddOnProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Create a fresh initial add-on each time
  const getInitialAddOn = (): AddOnTypes => ({
    id: 0, // Temporary ID for new add-on
    name: "",
    price: 0,
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
        <AddOnItem
          key="adding-new-addon" // Ensure fresh component instance
          addOn={getInitialAddOn()}
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
          + إضافة إضافة جديدة
        </Button>
      )}
    </div>
  );
}

export default AddAddOn;
