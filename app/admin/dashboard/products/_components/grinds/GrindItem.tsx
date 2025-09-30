"use client";
import ConfirmButton from "@/components/global/form/ConfirmButtonForm";
import { GrindTypes } from "@/lib/types";
import {
  addGrindAction,
  deleteGrindAction,
  editGrindAction,
} from "@/utils/actions";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * GrindItem Component - Similar to SizeItem but for grinds
 *
 * Features:
 * 1. Clear separation between add/edit modes
 * 2. Proper callback handling for success/cancel operations
 * 3. Unique IDs to prevent button conflicts
 * 4. Cancel functionality to reset state
 * 5. Fixed data format for server actions
 */

interface GrindItemProps {
  grind: GrindTypes;
  mode: "edit" | "add";
  onSuccess?: () => void;
  onCancel?: () => void;
}

function GrindItem({ grind, mode, onSuccess, onCancel }: GrindItemProps) {
  const [currGrind, setCurrGrind] = useState({
    name: grind.name,
  });

  // Reset state when grind prop changes (useful for edit mode)
  // Only reset if in edit mode to prevent interference with add mode
  useEffect(() => {
    if (mode === "edit") {
      setCurrGrind({
        name: grind.name,
      });
    }
  }, [grind.name, mode]);

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
      setCurrGrind({
        name: grind.name,
      });
    }
  };

  return (
    <li className="flex justify-between items-stretch gap-2 p-2 border border-primary/10 rounded-md">
      <div className="flex gap-2 flex-1">
        <input
          type="text"
          className="flex-1 border border-primary/10 text-center rounded px-2"
          value={currGrind.name}
          onChange={(e) => setCurrGrind({ ...currGrind, name: e.target.value })}
          placeholder="اسم الطحنة"
        />
      </div>

      <div className="flex gap-2">
        {mode === "edit" && (
          <>
            <ConfirmButton
              action={editGrindAction}
              title="تعديل"
              size="sm"
              id={`confirm-edit-grind-${grind.id}`}
              onSuccess={handleSuccess}
              variant="default"
              key={`edit-${grind.id}-${currGrind.name}`} // Force re-render when currGrind changes
            >
              <input
                type="text"
                name="grind_id"
                defaultValue={JSON.stringify(grind.id)}
                hidden
              />
              <input
                type="text"
                name="new_grind"
                hidden
                defaultValue={JSON.stringify(currGrind)}
              />
            </ConfirmButton>

            <ConfirmButton
              action={deleteGrindAction}
              title="مسح"
              size="sm"
              id={`confirm-delete-grind-${grind.id}`}
              onSuccess={handleSuccess}
              variant="destructive"
            >
              <input
                type="text"
                name="grind_id"
                defaultValue={JSON.stringify(grind.id)}
                hidden
              />
            </ConfirmButton>
          </>
        )}

        {mode === "add" && (
          <>
            <ConfirmButton
              action={addGrindAction}
              title="حفظ"
              size="sm"
              id="confirm-add-grind"
              onSuccess={handleSuccess}
              variant="default"
              key={`add-${currGrind.name}`} // Force re-render when currGrind changes
            >
              <input
                type="text"
                name="new_grind"
                hidden
                defaultValue={JSON.stringify(currGrind)}
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

export default GrindItem;
