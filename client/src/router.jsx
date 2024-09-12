import { lazy, Suspense } from "react";
import Loader from "./components/core/loader";
import { createBrowserRouter } from "react-router-dom";

const Gallery = lazy(() => import("./pages/gallery"));
const Homepage = lazy(() => import("./pages/homePage"));
const ImageView = lazy(() => import("./pages/imageView"));
const LoginPage = lazy(() => import("./pages/loginPage"));
const RegisterPage = lazy(() => import("./pages/registerPage"));
const GuestLayout = lazy(() => import("./pages/layout/GuestLayout"));
const DefaultLayout = lazy(() => import("./pages/layout/DefaultLayout"));

const router = createBrowserRouter([
  {
    path: "/gallery",
    element: (
      <Suspense fallback={<Loader />}>
        <Gallery />
      </Suspense>
    ),
  },
  {
    path: "/image/:id",
    element: (
      <Suspense fallback={<Loader />}>
        <ImageView />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <DefaultLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <GuestLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
