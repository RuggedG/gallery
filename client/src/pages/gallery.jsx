import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/core/header";
import { axiosClient } from "../utils/axiosClient";
import { Alert } from "../components/core/alert";
import Footer from "../components/core/footer";
// import Pagination from "../components/pagination";

export default function Gallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  const fetchPublicImages = async () => {
    try {
      const { data } = await axiosClient.get("/public");

      if (!data.success) {
        setAlert({
          type: "error",
          message: data.message || "Something went wrong",
        });
      } else {
        setImages(data.images);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Something went wrong",
      });
      setImages([]);
    }
  };

  useEffect(() => {
    fetchPublicImages();
  }, []);
  return (
    <div className="w-full flex flex-col m-0 p-0 box-border overflow-x-hidden">
      <Header />
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      <div className="min-h-[calc(100dvh-58px-58px)] columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-1 p-4">
        {images && images.length > 0 ? (
          images.map((image, ind) => (
            <div
              key={ind}
              className="break-inside-avoid mb-4 cursor-pointer"
              onClick={() => navigate(`/image/${image.id}`)}
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={image.imageUrl}
                  alt={image.name}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                  <p className="text-white p-2 truncate">{image.name}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-2xl font-semibold text-primary-900 my-5">
            No public images available yet
          </div>
        )}
      </div>
      {/* TODO: Add pagination */}
      {/* <Pagination /> */}
      <Footer />
    </div>
  );
}
