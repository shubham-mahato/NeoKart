"use client";
import { navItems } from "apps/user-ui/src/configs/constants";
import { AlignLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handelScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handelScroll);
    return () => window.removeEventListener("scroll", handelScroll);
  });
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky
          ? "fixed top-0 left-0 z-[100] bg-white border-b border-gray-200"
          : "relative"
      }`}
    >
      <div className="w-[80%] relative m-auto flex items-center justify-between">
        {/*All Dropdowns */}
        <div
          className="w-[260px] cursor-pointer flex items-center justify-between px-5 h-[50px]"
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="black" />
            <span className="text-black font-medium">All Departments</span>
          </div>
          <ChevronDown color="black" />
        </div>

        {/*Dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              isSticky ? "top-[50px]" : "top-[50px]"
            } w-[260px] h-[400px] bg-white shadow-md`}
          ></div>
        )}
        {/*Navigation Links*/}
        <div className="flex items-center">
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link
              key={index}
              className="px-5 font-medium text-base hover:text-blue-500"
              href={i.href}
            >
              {i.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
