import React from "react";

function PrimaryButton({ Icon, text, className = "" }: any) {
  return (
    <button className={`btn-primary ${className}`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm lg:text-lg font-bold">{text}</span>
    </button>
  );
}

export default PrimaryButton;
