import React from "react";

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="page-header w-full h-[510px]  ">
      <div className="w-full h-full flex flex-col justify-center pr-[10%]">
        <h1 className="text-[44px] font-bold text-white">{title}</h1>
        <p className="text-[28px] text-white/80 mt-4">{description}</p>
      </div>
    </section>
  );
}

export default PageHeader;
