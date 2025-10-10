"use client";
import React, { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const scrollY = (e: Event) => {
      if (window.scrollY > 150) {
        document.querySelector(".scroll-to-top")?.classList.remove("hidden");
      } else {
        document.querySelector(".scroll-to-top")?.classList.add("hidden");
      }
    };

    window.addEventListener("scroll", scrollY);

    return () => {
      window.removeEventListener("scroll", scrollY);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top animate-fade-up fixed bottom-[6%] left-[5%] w-14 h-14 bg-brown-600 rounded-full shadow-xl flex-center cursor-pointer hover:scale-[1.05] active:scale-[0.90] focus:scale-[0.90] duration-300 transition"
    >
      <FaArrowUp className="text-2xl text-white" />
    </button>
  );
}

export default BackToTop;
