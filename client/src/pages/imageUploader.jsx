import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Upload, Check } from "lucide-react";
import { Alert } from "../components/core/alert";
import { axiosClient } from "../utils/axiosClient";

export default function ImageUploader({ isOpen, onClose, fetchUserImages }) {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    description: "",
    isPublic: true,
    prevImage: null,
    file: null,
  });
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formData.file = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, prevImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert({ type: null, message: null });

    try {
      if (!formData.file) {
        throw new Error("No file selected");
      }

      const imageBase64 = await readFileAsBase64(formData.file);

      setTimeout(async () => {
        const payload = {
          name: formData.name,
          image: imageBase64,
          description: formData.description,
          isPublic: formData.isPublic,
        };

        try {
          const { data } = await axiosClient.post("/upload", payload);

          if (!data.success) {
            setAlert({ type: "error", message: data.message });
          } else {
            setAlert({ type: "success", message: data.message });
            fetchUserImages();
            setFormData({
              image: null,
              name: "",
              description: "",
              isPublic: true,
              prevImage: null,
              file: null,
            });
          }
        } catch (error) {
          debugger;
          setAlert({ type: "error", message: error.message });
        }
      }, 500);
    } catch (error) {
      console.error("Error during file upload", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {alert.message && <Alert type={alert.type} message={alert.message} />}
      <div className="inset-0 fixed z-50 flex items-center w-screen h-screen bg-primary-700/80 justify-center overflow-x-hidden">
        <div className="bg-white my-[10vh] rounded-lg shadow-lg min-h-[90%] p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-primary-900 mb-6">
            Upload an Image
          </h1>
          <button
            type="button"
            className="absolute top-4 right-4 bg-primary-800 hover:text-primary-200 text-primary-50 p-2 rounded-full hover:bg-primary-700 transition-colors"
            onClick={onClose}
          >
            <XIcon size={24} />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                className="block text-primary-700 mb-2"
                htmlFor="image-upload"
              >
                Choose an image
              </label>
              <div className="relative border-2 border-dashed border-primary-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {formData.prevImage ? (
                  <img
                    src={formData.prevImage}
                    alt="Preview"
                    className="max-h-48 mx-auto"
                  />
                ) : (
                  <div className="text-primary-500">
                    <Upload className="mx-auto mb-2" size={24} />
                    <p>Click or drag image here</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-primary-700 mb-2" htmlFor="name">
                Name (required)
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-primary-700 mb-2"
                htmlFor="description"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-6">
              <span className="text-primary-700 mb-2 block">Visibility</span>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isPublic}
                    onChange={() =>
                      setFormData({ ...formData, isPublic: true })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 mr-2 flex items-center justify-center border rounded-full ${
                      formData.isPublic
                        ? "bg-primary-600 border-primary-600"
                        : "border-primary-300"
                    }`}
                  >
                    {formData.isPublic && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                  Public
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.isPublic}
                    onChange={() =>
                      setFormData({ ...formData, isPublic: false })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 mr-2 flex items-center justify-center border rounded-full ${
                      !formData.isPublic
                        ? "bg-primary-600 border-primary-600"
                        : "border-primary-300"
                    }`}
                  >
                    {!formData.isPublic && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                  Private
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-full hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Upload Image
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
