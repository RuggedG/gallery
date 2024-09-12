import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateContext";
import Header from "../../components/core/header";
import Footer from "../../components/core/footer";

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { token } = useStateContext();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="w-full flex flex-col m-0 p-0 box-border overflow-x-hidden">
      <Header />
      <main className="min-h-[calc(100dvh-58px-58px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
