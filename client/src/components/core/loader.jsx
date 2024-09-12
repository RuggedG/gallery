import { CircleLoader } from "react-spinners";

import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <CircleLoader />
    </div>
  );
}
