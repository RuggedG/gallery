import React, { useEffect } from "react";
import TButton from "./TButton";
import { useStateContext } from "../../context/StateContext";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { user, token } = useStateContext();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (token) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [token]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const NavLinks = [
    {
      name: "Home",
      to: "/",
    },
    {
      name: "Gallery",
      to: "/gallery",
    },
  ];
  return (
    <header className="flex items-center justify-between w-screen h-[58px] px-4 bg-primary-800 border border-primary-900 sticky">
      <div className="flex items-center">
        <Link to="/" className="text-white font-bold text-3xl mr-2">
          &Gallery
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="ml-10 flex items-baseline space-x-4">
          {NavLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-primary-900 text-white"
                    : "text-gray-300 hover:bg-primary-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      {isOpen ? (
        <div className="flex items-center">
          <TButton to="/login">Login</TButton>
          <TButton
            classnames="ml-2 bg-transparent hover:bg-transparent focus:bg-transparent focus:ring-0 focus:border-none text-white"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </TButton>
        </div>
      ) : (
        <TButton
          color="red"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </TButton>
      )}
    </header>
  );
}
