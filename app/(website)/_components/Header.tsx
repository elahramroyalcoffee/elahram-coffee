import React from "react";
import logo from "@/public/brownLogo.svg";
import cart from "@/public/icons/ShoppingCartSimple.svg";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

async function Header() {
  return (
    <header className="container bg-beige-100 px-8 py-2 rounded-full fixed left-center top-4 flex-between">
      <Link href={"/"}>
        <Image
          src={logo}
          alt="logo"
          width={75}
          height={75}
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
  );
}

export default Header;
