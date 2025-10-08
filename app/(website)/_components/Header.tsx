import React from "react";
import logo from "@/public/brownLogo.svg";
import cart from "@/public/icons/ShoppingCartSimple.svg";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

async function Header() {
  return (
    <>
      {/* lg screens header */}
      <header className="container bg-beige-100 px-8 py-1 rounded-full max-w-[90%] fixed left-center top-4 flex-between z-20 hidden lg:flex">
        <Link href={"/"}>
          <Image
            src={logo}
            alt="logo"
            width={77}
            height={77}
            className="h-auto"
          />
        </Link>

        <Navbar />

        <div>
          {/* search */}
          {/* cart */}
          <Link
            href={"/cart"}
            className="bg-beige-200 rounded-full w-10 h-10 flex-center cursor-pointer hover:bg-brown-600 group transition"
          >
            <Image
              src={cart}
              alt="logo"
              width={24}
              height={24}
              className="h-auto group-hover:invert-100 transition"
            />
          </Link>
        </div>
      </header>
      {/* small screens header */}
      <header className="container bg-beige-100 px-8 py-1 rounded-full fixed left-center top-4 max-w-[90%] flex-between z-20 lg:hidden flex">
        <Link href={"/"}>
          <Image
            src={logo}
            alt="logo"
            width={64}
            height={120}
            className="!h-auto"
          />
        </Link>

        {/* <Navbar /> */}

        <div className="flex-center gap-4">
          {/* cart */}
          <Link
            href={"/cart"}
            className="bg-beige-200 rounded-full w-10 h-10 flex-center cursor-pointer hover:bg-brown-600 group transition"
          >
            <Image
              src={cart}
              alt="logo"
              width={24}
              height={24}
              className="h-auto group-hover:invert-100 transition"
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
