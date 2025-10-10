"use client";
import React, { useEffect, useState } from "react";
import logo from "@/public/brownLogo.svg";
import cart from "@/public/icons/ShoppingCartSimple.svg";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

function Header() {
  // const [y, setY] = useState(0);

  useEffect(() => {
    const scrollY = (e: Event) => {
      if (window.scrollY > 100) {
        document
          .querySelectorAll("header")
          ?.forEach((header) => header?.classList.add("sticky-header"));
      } else {
        document
          .querySelectorAll("header")
          ?.forEach((header) => header?.classList.remove("sticky-header"));
      }
      // setY(window.scrollY);
    };

    window.addEventListener("scroll", scrollY);

    return () => {
      window.removeEventListener("scroll", scrollY);
    };
  }, []);

  return (
    <>
      {/* lg screens header */}
      <header className="container bg-beige-600/98 px-8 py-0 rounded-full duration-400 max-w-[90%] transition-all fixed left-center top-4 flex-between z-20 hidden lg:flex">
        <Link href={"/"}>
          <Image src={logo} alt="logo" width={66.99} height={65} className="" />
        </Link>

        <Navbar />

        <div>
          {/* search */}
          {/* cart */}
          <Link
            href={"/cart"}
            className=" rounded-full  w-10 h-10 flex-center cursor-pointer bg-brown-400 hover:bg-brown-500 group transition duration-100"
          >
            <Image
              src={cart}
              alt="logo"
              width={20}
              height={20}
              className="h-auto invert-100 transition duration-100"
            />
          </Link>
        </div>
      </header>
      {/* small screens header */}
      <header className="container bg-beige-600/98 px-8 py-1 rounded-full duration-400 transition-all fixed left-center top-4 max-w-[90%] flex-between z-20 lg:hidden flex">
        <Link href={"/"}>
          <Image src={logo} alt="logo" width={66.99} height={65} className="" />
        </Link>

        {/* <Navbar /> */}

        <div className="flex-center gap-4">
          {/* cart */}
          <Link
            href={"/cart"}
            className=" rounded-full w-10 h-10 flex-center cursor-pointer bg-brown-400 group transition"
          >
            <Image
              src={cart}
              alt="logo"
              width={24}
              height={24}
              className="h-auto invert-100 transition"
            />
          </Link>
          {/* Mobile navbar */}
          <MobileNavbar />
        </div>
      </header>
    </>
  );
}

export default Header;
