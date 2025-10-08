"use client";
import { websiteLinks } from "@/lib/websiteLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";

function MobileNavbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  console.log(pathname);

  const isActivePath = (link: any) => {
    return link.path == "/"
      ? pathname == link.path
      : pathname.includes(link.path);
  };
  return (
    <div>
      <LuMenu
        size={28}
        className="text-brown-600 cursor-pointer"
        onClick={() => setOpenMenu(!openMenu)}
      />

      {openMenu && (
        <nav
          onClick={() => setOpenMenu(false)}
          className="fixed  bg-beige-100 z-20 w-[80vw]  p-4 top-20 animate-move-down left-center overflow-hidden shadow-lg rounded-lg"
        >
          <ul className="flex flex-col  gap-4">
            {websiteLinks.map((link, idx) => (
              <li
                key={idx}
                className={`border-r-4 hover:border-brown-300 transition  ${
                  isActivePath(link) ? "border-brown-300" : ""
                }`}
              >
                <Link
                  href={link.path}
                  className={`text-black/60 hover:text-brown-600 text-xl xl:text-lg transition p-4 select-none w-full block
                      ${isActivePath(link) ? "text-brown-600" : ""}
                      `}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default MobileNavbar;
