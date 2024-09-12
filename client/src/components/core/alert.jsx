import { useState, useEffect } from "react";

const SVG = ({ type }) => {
  return (
    <>
      {type === "success" ? (
        <svg
          className="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
        </svg>
      ) : type === "error" ? (
        <svg
          className="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
        </svg>
      ) : type === "warning" ? (
        <svg
          className="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
};

export const Alert = ({ type, message }) => {
  const [show, setShow] = useState(true);

  const defaultMessage = {
    success: "Success!",
    error: "Error!",
    warning: "Warning!",
    info: "Info!",
  };

  const bgColor = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-orange-500",
    info: "",
  }[type];

  const textColor = {
    success: "text-emerald-500 dark:text-emerald-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-red-500 dark:text-red-400",
    info: "",
  }[type];

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      id={type}
      className="w-screen dark flex justify-center fixed top-2 z-50"
    >
      <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 absolute">
        <div className={`flex items-center justify-center w-12 ${bgColor}`}>
          <SVG type={type} />
        </div>

        <div className="px-4 py-2 -mx-3">
          <div className="mx-3">
            <span className={`font-semibold ${textColor}`}>{type}</span>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {message || defaultMessage[type]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
