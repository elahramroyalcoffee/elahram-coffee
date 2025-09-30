"use client";
import DeleteIcon from "@/components/global/ui/DeleteIcon";
import Image from "next/image";
import React, { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { MdDeleteForever, MdDeleteOutline } from "react-icons/md";

function ImageInput({
  defaultValue,
  className = "",
}: {
  defaultValue?: string;
  className?: string;
}) {
  const [uploaded, setUploaded] = useState<string | null>(
    defaultValue ? defaultValue : null
  );

  const uploadFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploaded(URL.createObjectURL(file));
  };

  return (
    <div className={`${className} mb-8 block`}>
      <label htmlFor="image">
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          required={!uploaded}
          onChange={uploadFileChange}
          className="text-white"
        />

        {!uploaded && (
          <>
            <div className="w-[350px]  h-[200px] p-8 rounded border-primary text-primary  hover:bg-gray-100 transition-all border duration-500 cursor-pointer flex-center gap-2 flex-col font-semibold animate-fade-in ">
              <LuImagePlus size={40} />
              <span className="text-sm">رفع صورة</span>
            </div>
          </>
        )}
      </label>

      {uploaded && (
        <div
          className="relative animate-fade-in"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          <Image
            alt="uploaded-image"
            src={uploaded}
            width={350}
            height={130}
            className="w-[350px]  h-[200px]  object-cover object-center"
          />
          <DeleteIcon
            onClick={(e: any) => {
              e.stopPropagation();
              setTimeout(() => {
                setUploaded(null);
              }, 100);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageInput;
