import React from "react";

function PrimaryButton({ Icon, text }: any) {
  return (
    <button className="btn-primary">
      <Icon className="w-5 h-5" />
      <span className="text-lg font-bold">{text}</span>
    </button>
  );
}

export default PrimaryButton;
