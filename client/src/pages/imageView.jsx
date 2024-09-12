import { TrashIcon, XIcon, ZoomIn } from "lucide-react";
import Header from "../components/core/header";
import Footer from "../components/core/footer";
import { Alert } from "../components/core/alert";
import { axiosClient } from "../utils/axiosClient";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import TButton from "../components/core/TButton";

export default function ImageView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useStateContext();
  const [data, setData] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  const handleDelete = async () => {
    setAlert({ type: null, message: null });
    setTimeout(async () => {
      try {
        const { data } = await axiosClient.delete(`/image/${id}`);
        debugger;
        if (!data.success) {
          setAlert({
            type: "error",
            message: data.message || "Something went wrong",
          });
        } else {
          setAlert({
            type: "success",
            message: "Image deleted successfully",
          });
          navigate("/");
        }
      } catch (error) {
        debugger;
        setAlert({
          type: "error",
          message: error.message || "Something went wrong",
        });
      }
    }, 500);
  };

  const fetchData = async () => {
    try {
      const { data } = await axiosClient.get(`/image/${id}`);
      if (!data.success) {
        setAlert({
          type: "error",
          message: data.message || "Something went wrong",
        });
      } else {
        setData(data.image);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Something went wrong",
      });
      setData(null);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosClient.get(`/download/${id}`, {
        responseType: "blob",
      });

      const fileType = response.headers["content-type"].split(";")[0];
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        `${data.name}.${fileType.split("/")[1]}` ||
        `image.${fileType.split("/")[1]}`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setAlert({
        type: "success",
        message: "Image downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      setAlert({
        type: "error",
        message:
          error.message || "Something went wrong, Unable to download image",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="w-full min-h-screen flex flex-col m-0 p-0 box-border overflow-x-hidden bg-primary-50">
      <Header />
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      <main className="min-h-[calc(100dvh-58px-58px)]">
        {data ? (
          <div className="max-w-7xl mx-auto p-4 mt-8 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 relative group aspect-auto">
              <img
                src={data.imageUrl}
                alt={data.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setShowFullImage(true)}
                  className="bg-primary-800 text-primary-50 p-2 rounded-full hover:bg-primary-700 transition-colors"
                >
                  <ZoomIn size={24} />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-900 mb-4">
                  {data.name}
                </h1>
                <p className="text-primary-600 mb-4">{data.description}</p>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-300 rounded-full mr-3">
                    <img
                      src={
                        data.user.avatar ||
                        `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${data.user.name}`
                      }
                      alt={data.user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-800">
                      {data.user.name}
                    </p>
                    <p className="text-sm text-primary-500">
                      {formatDate(data.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-x-3">
                <button
                  className="bg-primary-600 text-primary-50 px-6 py-2 rounded-full hover:bg-primary-700 transition-colors"
                  type="button"
                  onClick={handleDownload}
                >
                  Download
                </button>
                {user.id === data.user_id && (
                  <TButton onClick={handleDelete} circle link color="red">
                    <TrashIcon className="w-5 h-5" />
                  </TButton>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {showFullImage && (
          <div className="fixed inset-0 bg-primary-900 bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={data.imageUrl}
                alt={data.name}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4 bg-primary-800 hover:text-primary-200 text-primary-50 p-2 rounded-full hover:bg-primary-700 transition-colors"
              >
                <XIcon size={24} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-3">
          {/* More like this */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-1 p-4">
            {data
              ? data?.related.length > 0 &&
                data.related.map((image, ind) => (
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
              : "No related images found"}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
