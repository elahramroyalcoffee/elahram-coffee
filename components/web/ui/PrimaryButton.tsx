import React from "react";

function PrimaryButton({
  Icon,
  text,
  className = "",
  onClick = undefined,
}: any) {
  return (
    <button onClick={onClick} className={`btn-primary ${className}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="text-xs sm:text-sm lg:text-lg font-bold ">{text}</span>
    </button>
  );
}

export default PrimaryButton;
