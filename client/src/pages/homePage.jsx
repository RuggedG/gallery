import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import ImageUploader from "./imageUploader";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components/core/alert";
import { axiosClient } from "../utils/axiosClient";
import { useStateContext } from "../context/StateContext";

export default function Homepage() {
  const navigate = useNavigate();
  const { token } = useStateContext();
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  const fetchUserImages = async () => {
    try {
      const { data } = await axiosClient.get("/user/images");

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
        message: "Something went wrong",
      });
      setImages([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserImages();
    }
  }, []);

  return (
    <>
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      <main className="container mx-auto px-4 py-8 overflow-x-hidden">
        {showForm && (
          <ImageUploader
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            fetchUserImages={fetchUserImages}
          />
        )}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">Your Images</h1>
          <div
            className="bg-primary-600 text-primary-50 px-4 py-2 rounded-full hover:bg-primary-700 transition-colors flex items-center cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          >
            <Upload size={20} className="mr-2" />
            Upload Image
          </div>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-1 p-4">
          {images && images.length > 0
            ? images.map((image) => (
                <div
                  key={image.id}
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
            : "No images found"}
        </div>
      </main>
    </>
  );
}
