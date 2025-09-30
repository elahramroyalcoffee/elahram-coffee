"use client";
import ConfirmButton from "@/components/global/form/ConfirmButtonForm";
import { AddOnTypes } from "@/lib/types";
import {
  addAddOnAction,
  deleteAddOnAction,
  editAddOnAction,
} from "@/utils/actions";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AddOnItemProps {
  addOn: AddOnTypes;
  mode: "edit" | "add";
  onSuccess?: () => void;
  onCancel?: () => void;
}

function AddOnItem({ addOn, mode, onSuccess, onCancel }: AddOnItemProps) {
  const [currAddOn, setCurrAddOn] = useState({
    name: addOn.name,
    price: addOn.price,
  });

  // Reset state when addOn prop changes (useful for edit mode)
  // Only reset if in edit mode to prevent interference with add mode
  useEffect(() => {
    if (mode === "edit") {
      setCurrAddOn({
        name: addOn.name,
        price: addOn.price,
      });
    }
  }, [addOn.name, addOn.price, mode]);

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
      setCurrAddOn({
        name: addOn.name,
        price: addOn.price,
      });
    }
  };

  return (
    <li className="flex justify-between items-stretch gap-2 p-2 border border-primary/10 rounded-md">
      <div className="flex gap-2 flex-1">
        <input
          type="text"
          className="flex-1 border border-primary/10 text-center rounded px-2"
          value={currAddOn.name}
          onChange={(e) => setCurrAddOn({ ...currAddOn, name: e.target.value })}
          placeholder="اسم الإضافة"
        />
        <input
          type="text"
          className="flex-1 border border-primary/10 text-center rounded px-2"
          value={currAddOn.price}
          onChange={(e) =>
            setCurrAddOn({ ...currAddOn, price: +e.target.value })
          }
          placeholder="السعر"
          required
        />
      </div>

      <div className="flex gap-2">
        {mode === "edit" && (
          <>
            <ConfirmButton
              action={editAddOnAction}
              title="تعديل"
              size="sm"
              id={`confirm-edit-addon-${addOn.id}`}
              onSuccess={handleSuccess}
              variant="default"
              key={`edit-${addOn.id}-${currAddOn.name}-${currAddOn.price}`} // Force re-render when currAddOn changes
            >
              <input
                type="text"
                name="addon_id"
                defaultValue={JSON.stringify(addOn.id)}
                hidden
              />
              <input
                type="text"
                name="new_addon"
                hidden
                defaultValue={JSON.stringify(currAddOn)}
              />
            </ConfirmButton>

            <ConfirmButton
              action={deleteAddOnAction}
              title="مسح"
              size="sm"
              id={`confirm-delete-addon-${addOn.id}`}
              onSuccess={handleSuccess}
              variant="destructive"
            >
              <input
                type="text"
                name="addon_id"
                defaultValue={JSON.stringify(addOn.id)}
                hidden
              />
            </ConfirmButton>
          </>
        )}

        {mode === "add" && (
          <>
            <ConfirmButton
              action={addAddOnAction}
              title="حفظ"
              size="sm"
              id="confirm-add-addon"
              onSuccess={handleSuccess}
              variant="default"
              key={`add-${currAddOn.name}-${currAddOn.price}`} // Force re-render when currAddOn changes
            >
              <input
                type="text"
                name="new_addon"
                hidden
                defaultValue={JSON.stringify(currAddOn)}
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

export default AddOnItem;
