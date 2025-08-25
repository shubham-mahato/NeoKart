import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ProfileIcon from "../../../assets/svgs/profile-icon";
import HeartIcon from "../../../assets/svgs/heart-icon";
import CartIcon from "../../../assets/svgs/cart-icon";
import HeaderBottom from "./header-bottom";
const Header = () => {
  return (
    <div>
      <div className="w-full bg-white">
        <div className="w-[80%] py-5 m-auto flex items-center justify-between">
          <div>
            <Link href="/">
              <span className="text-2xl font-[500]">NeoKart</span>
            </Link>
          </div>
          <div className="w-full md:w-[50%] relative">
            <input
              type="text"
              placeholder="Search for products"
              className="w-full px-4 py-2 font-Poppins font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="w-[60px] cursor-pointer flex items-center justify-center h-full absolute top-0 right-0">
              <Search color="black" />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href={"/login"} aria-label="User Profile">
              <ProfileIcon />
            </Link>

            <Link href={"/wishlist"} className="relative" aria-label="Wishlist">
              <HeartIcon />
            </Link>

            <Link href={"/cart"} className="relative" aria-label="Shopping Cart">
              <CartIcon />
            </Link>
          </div>
        </div>
        <div className="border-b border-b-gray-200">
          <HeaderBottom />
        </div>
      </div>
    </div>
  );
};

export default Header;
