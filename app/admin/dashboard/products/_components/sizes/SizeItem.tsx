"use client";
import ConfirmButton from "@/components/global/form/ConfirmButtonForm";
import { SizeTypes } from "@/lib/types";
import { addSizeAction, deleteSizeAction, editSizeAction } from "@/utils/actions";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";


interface SizeItemProps {
  size: SizeTypes;
  mode: "edit" | "add";
  onSuccess?: () => void;
  onCancel?: () => void;
}

function SizeItem({ size, mode, onSuccess, onCancel }: SizeItemProps) {
  const [currSize, setCurrSize] = useState({
    weight: size.weight,
    size: size.size,
  });
  
  useEffect(() => {
    if (mode === "edit") {
      setCurrSize({
        weight: size.weight,
        size: size.size,
      });
    }
  }, [size.weight, size.size, mode]);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleCancel = () => {
    if (mode === "add" && onCancel) {
      onCancel();
    } else if (mode === "edit") {
      // Reset to original values for edit mode
      setCurrSize({
        weight: size.weight,
        size: size.size,
      });
    }
  };

  return (
    <li className="flex justify-between items-stretch gap-2 p-2 border border-primary/10 rounded-md">
      <div className="flex gap-2">
        <input
          type="number"
          className="w-24 border border-primary/10 text-center rounded"
          value={currSize.weight}
          onChange={(e) =>
            setCurrSize({ ...currSize, weight: parseInt(e.target.value) || 0 })
          }
        />
        <select
          name="size"
          className="flex-1"
          value={currSize.size}
          onChange={(e) =>
            setCurrSize({ ...currSize, size: e.target.value })
          }
        >
          <option value="gm">جرام</option>
          <option value="kg">كيلو</option>
        </select>
      </div>

      <div className="flex gap-2">
        {mode === "edit" && (
          <>
            <ConfirmButton
              action={editSizeAction}
              title="تعديل"
              size="sm"
              id={`confirm-edit-size-${size.id}`}
              onSuccess={handleSuccess}
              variant="default"
              key={`edit-${size.id}-${currSize.weight}-${currSize.size}`} // Force re-render when currSize changes
            >
              <input
                type="text"
                name="size_id"
                defaultValue={JSON.stringify(size.id)}
                hidden
              />
              <input
                type="text"
                name="new_size"
                hidden
                defaultValue={JSON.stringify(currSize)}
              />
            </ConfirmButton>

            <ConfirmButton
              action={deleteSizeAction}
              title="مسح"
              size="sm"
              id={`confirm-delete-size-${size.id}`}
              onSuccess={handleSuccess}
              variant="destructive"
            >
              <input
                type="text"
                name="size_id"
                defaultValue={JSON.stringify(size.id)}
                hidden
              />
            </ConfirmButton>
          </>
        )}

        {mode === "add" && (
          <>
            <ConfirmButton
              action={addSizeAction}
              title="حفظ"
              size="sm"
              id="confirm-add-size"
              onSuccess={handleSuccess}
              variant="default"
              key={`add-${currSize.weight}-${currSize.size}`} // Force re-render when currSize changes
            >
              <input
                type="text"
                name="new_size"
                hidden
                defaultValue={JSON.stringify(currSize)}
              />
            </ConfirmButton>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              إلغاء
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

export default SizeItem;
