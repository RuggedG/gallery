import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-800 w-full h-[58px] bottom-0 sticky text-center flex items-center justify-center px-4 md:px-6 lg:px-8 xl:px-12 text-primary-100">
      <span className="text-sm text-gray-500 text-center dark:text-gray-400 gap-x-2">
        © {year}{" "}
        <Link to="/" className="hover:underline">
          &Gallery™
        </Link>
        . All Rights Reserved.
      </span>
    </footer>
  );
}
