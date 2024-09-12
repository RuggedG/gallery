import "./index.css";
import router from "./router.jsx";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { StateProvider } from "./context/StateContext.jsx";

createRoot(document.getElementById("root")).render(
  <StateProvider>
    <RouterProvider router={router} />
  </StateProvider>
);
