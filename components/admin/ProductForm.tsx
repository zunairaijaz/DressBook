"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories, brands } from "@/data/products";
import { Product } from "@/types";
import UploadIcon from "@/components/icons/UploadIcon";
import XMarkIcon from "@/components/icons/XMarkIcon";

type Props = {
  id?: string;
};

const ProductForm: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const isEditing = Boolean(id);

  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: undefined,
    description: "",
    category: categories[0]?.name ?? "", // Handle potential undefined values
    brand: brands[0] ?? "", // Handle potential undefined values
    stock: 0,
    images: [],
    sku: "",
    material: "",
    gender: "Female",
    pattern: "",
    status: "Active",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing product in edit mode
  useEffect(() => {
    if (isEditing && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            if (res.status === 404) {
              router.push("/admin/products");
              return;
            }
            throw new Error(`Failed to fetch product: ${res.statusText}`);
          }
          const existingProduct: Product = await res.json();
          setProduct(existingProduct);
          setExistingImageUrls(existingProduct.images);
          setImagePreviews(existingProduct.images);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing, router]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numFields = ["price", "originalPrice", "stock"];

    if (name === "originalPrice" && value === "") {
      setProduct((prev) => ({ ...prev, originalPrice: undefined }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      [name]: numFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newImageUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = imagePreviews[index];
    if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);

    const isExistingImage = existingImageUrls.includes(imageUrl);

    if (isExistingImage) {
      setExistingImageUrls((prev) => prev.filter((url) => url !== imageUrl));
    } else {
      const newImageFilesIndex = imagePreviews.findIndex((url) => url === imageUrl);
      if (newImageFilesIndex > -1) {
         setImageFiles((prev) => prev.filter((_, i) => i !== newImageFilesIndex - existingImageUrls.length));
      }
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter images that are new files vs existing URLs
    const newImageFiles = imageFiles;

    // --- Image Upload Logic ---
    let uploadedImageUrls: string[] = [...existingImageUrls];

    if (newImageFiles.length > 0) {
      const formData = new FormData();
      newImageFiles.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          throw new Error("Failed to upload images.");
        }
        const uploadedData = await uploadRes.json();
        uploadedImageUrls = [...uploadedImageUrls, ...uploadedData.urls];
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }
    
    // --- Product Data Logic ---
    try {
      if (uploadedImageUrls.length === 0) {
        throw new Error("Please upload at least one image.");
      }

      const payload = {
        ...product,
        images: uploadedImageUrls,
      };

      const url = isEditing ? `/api/products/${id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save product.");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-3 border-2";

  if (isEditing && loading) {
    return <p className="text-center mt-8">Loading product data...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-8 text-red-500">Error: {error}</p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
      >
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Price + Original Price */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={product.originalPrice ?? ""}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
            className={inputClasses}
          />
        </div>

        {/* Category + Brand */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className={inputClasses}
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <select
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className={inputClasses}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock + SKU */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Material + Pattern */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={product.material}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pattern</label>
            <input
              type="text"
              name="pattern"
              value={product.pattern}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Gender + Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={product.gender}
              onChange={handleChange}
              className={inputClasses}
            >
              {["Female", "Male", "Unisex"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={product.status}
              onChange={handleChange}
              className={inputClasses}
            >
              {["Active", "Draft", "Archived"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Product Images</label>
          <div
            className={`mt-1 flex justify-center border-2 border-dashed rounded-md px-6 pt-5 pb-6 transition-colors ${
              isDragging ? "border-accent-hover bg-gray-50" : "border-gray-300"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="space-y-1 text-center">
              <UploadIcon
                className={`mx-auto h-12 w-12 ${isDragging ? "text-accent" : "text-gray-400"}`}
              />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`Product preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link
            href="/admin/products"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-focus focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-accent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-wait"
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Product"}
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ProductForm;
