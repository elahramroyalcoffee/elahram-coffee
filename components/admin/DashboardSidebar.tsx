"use client";
import React, { useState } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { dashboardLinks } from "@/lib/dashboardLinks";
import { usePathname } from "next/navigation";
import { VscSignOut } from "react-icons/vsc";
import { signOutAction } from "@/utils/actions";
import { signOut } from "@/utils/auth";

function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileView, setMobileView] = useState(false);

  return (
    <div
      className={`fixed z-10 md:relative min-h-[calc(100vh-2rem)] min-w-[250px] p-6 rounded-lg bg-gradient-to-r from-stone-900 to-stone-950 text-white ${
        mobileView ? "min-w-auto min-h-auto" : ""
      }`}
    >
      <span
        className="block md:hidden cursor-pointer"
        onClick={() => setMobileView(!mobileView)}
      >
        {mobileView ? "تكبير القائمة" : "تصغير القائمة"}
      </span>
      {!mobileView && (
        <>
          <Image
            alt="logo"
            src={logo}
            width={120}
            height={160}
            priority
            className="w-auto h-auto object-cover mx-auto invert-100"
          />

          <ul className="flex items-stretch justify-center flex-col gap-4 mt-12">
            {dashboardLinks.map((route, idx: number) => (
              <li key={idx}>
                <Link
                  href={route.path}
                  className={`flex gap-3 items-center border px-5 py-3 border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition text-sm ${
                    pathname == route.path ? "!bg-orange-950" : ""
                  }`}
                >
                  <span className="[&>svg]:w-4 [&>svg]:h-4">
                    {<route.icon />}
                  </span>
                  {route.name}
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={signOut}
                className={`flex gap-3 items-center border px-5 py-3 border-red-200/10 rounded-lg cursor-pointer hover:bg-white/5 transition mt-4 w-full text-sm`}
              >
                <span className="[&>svg]:w-4 [&>svg]:h-4">
                  <VscSignOut />
                </span>
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default DashboardSidebar;
