import React, { useState } from "react";
import TButton from "../components/core/TButton";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import { axiosClient } from "../utils/axiosClient";
import { Alert } from "../components/core/alert";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useStateContext();
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setAlert({ type: null, message: null });

    setTimeout(async () => {
      try {
        const { data } = await axiosClient.post("/login", {
          email: formData.email,
          password: formData.password,
        });

        if (!data.success) {
          setAlert({
            type: "error",
            message: data.message || "Something went wrong, please try again",
          });
        } else {
          setAlert({
            type: "success",
            message: data.message,
          });

          localStorage.setItem("token", data.token);
          setToken(data.token);
          setTimeout(() => navigate("/"), 1500);
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: error.message || "Something went wrong, please try again",
        });
      }
    }, 500);
  };
  return (
    <>
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      <div className="flex items-center justify-center">
        <div className="flex max-w-[80%] min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={(ev) => handleSubmit(ev)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    autoComplete="email"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <TButton
                  type="submit"
                  color="indigo"
                  classnames="w-full flex items-center text-center"
                >
                  Sign in
                </TButton>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
