import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";

type FormValues = {
  name: string;
  address: string;
  city: string;
  state?: string;
  contact?: string;
  email_id: string;
  image?: string;
};

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [message, setMessage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<number>(0); // 0 for regular, 1 for submitting, and 2 for submitted/failed
  const [animate, setAnimate] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG or JPG files are accepted!");
      return;
    }

    // Validate size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert("File size must be 3MB or less!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue("image", base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setValue("image", "");
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const onSubmit: SubmitHandler<FormValues> = async (data) => {
  setSubmitState(1);
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("address", data.address);
  formData.append("city", data.city);
  if (data.state) formData.append("state", data.state);
  if (data.contact) formData.append("contact", data.contact);
  formData.append("email_id", data.email_id);

  const file = fileInputRef.current?.files?.[0];
  if (file) {
    formData.append("image", file);
  }

  const res = await fetch("/api/schools", {
    method: "POST",
    body: formData,
  });

  if(res.ok) {
    reset();

    if(fileInputRef.current)
    fileInputRef.current.value = '';

    setImagePreview(null);
  }

  const result = await res.json();
  setMessage(result.message || result.error);
  setSubmitState(2);
  setTimeout(() => {
    setAnimate(true);
  }, 50);
  setTimeout(() => {
    setAnimate(false);
    setSubmitState(0);
  }, 2000);
};


  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          placeholder="Name"
          {...register("name", { required: true })}
          className="border border-gray-300 rounded-lg outline-0 p-2 w-full"
        />
        {errors.name && <p className="text-red-500">Name is required</p>}

        <input
          placeholder="Address"
          {...register("address", { required: true })}
          className="border border-gray-300 rounded-lg outline-0 p-2 w-full"
        />

        <input
          placeholder="City"
          {...register("city", { required: true })}
          className="border border-gray-300 rounded-lg outline-0 p-2 w-full"
        />

        <input
          placeholder="State"
          {...register("state")}
          className="border border-gray-300 rounded-lg outline-0 p-2 w-full"
        />

        <input
          placeholder="Contact"
          type="number"
          {...register("contact", { required: true })}
          className="border border-gray-300 rounded-lg outline-0 p-2 w-full"
        />

        <input
          placeholder="Email"
          type="email"
          {...register("email_id")}
          className="border border-gray-300 rounded-lg outline-0 p-2 w-full"
        />
        {errors.email_id && (
          <p className="text-red-500">Valid email required</p>
        )}

        {/* 🔄 Image Input + Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">School Image</label>
          <input
            type="file"
            {...register('image', {required: true})}
            ref={fileInputRef}
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-black file:text-white
                       hover:file:bg-gray-800 file:cursor-pointer"
          />
          {errors.image && (
            <p className="text-red-500">Image required.</p>
          )}
          {imagePreview && (
            <div className="relative inline-block w-full max-h-60">
              <div className="relative w-full h-60 border border-gray-300 rounded-md">
                <Image
                  src={imagePreview!}
                  alt="Preview"
                  fill
                  className="object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 bg-black text-white w-6 h-6 rounded-full text-sm cursor-pointer"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Submit Button */}
        {
          submitState !== 2 ? (
          <button
            type="submit"
            className="bg-black text-white px-4 h-10 rounded-lg w-full cursor-pointer"
            disabled={submitState === 1}
          >
            Submit
          </button>
          ) : (
            <div className="bg-cyan-800 text-white h-10 relative rounded-lg overflow-hidden">
              <p
                className={`absolute h-10 bg-black transition-[width] duration-2000 ease ${
                  animate ? "w-full" : "w-0"
                }`}
              ></p>
              <p className="absolute h-10 border flex items-center justify-center text-center w-full">
                {message}
              </p>
            </div>
          )
        }
      </form>
    </div>
  );
}
