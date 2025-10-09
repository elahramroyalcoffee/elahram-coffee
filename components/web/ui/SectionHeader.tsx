import React from "react";

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="flex-center mb-[64px] text-[44px] text-black font-bold text-center font-tajawal">
      {title}
    </h3>
  );
}

export default SectionHeader;
