import React from "react";
import { MdDeleteOutline } from "react-icons/md";

function DeleteIcon({ onClick }: { onClick: any }) {
  return (
    <MdDeleteOutline
      onClick={onClick}
      className="absolute inset-4 bg-red-500 text-white rounded-full w-7 h-7 p-1 cursor-pointer"
    />
  );
}

export default DeleteIcon;
