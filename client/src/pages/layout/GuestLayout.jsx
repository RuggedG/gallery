import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateContext";
import Header from "../../components/core/header";

export default function GuestLayout() {
  const navigate = useNavigate();
  const { token } = useStateContext();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="w-full flex flex-col m-0 p-0 box-border overflow-x-hidden">
      <Header />
      <Outlet />
    </div>
  );
}
