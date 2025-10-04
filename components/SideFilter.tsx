"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
  categories,
  brands as allBrands,
  materials as allMaterials,
  patterns as allPatterns,
} from "../data/filters"; // ✅ fixed path

import StarIcon from "./icons/StarIcon";

const ratingFilters = [
  { label: "4 Stars & Up", value: 4 },
  { label: "3 Stars & Up", value: 3 },
  { label: "2 Stars & Up", value: 2 },
  { label: "1 Star & Up", value: 1 },
];

const genderFilters = ["Female", "Male", "Unisex"];

const SideFilter: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [price, setPrice] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });

  useEffect(() => {
    setPrice({
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    });
  }, [searchParams]);

  const handleFilterChange = (
    key: string,
    value: string | string[],
    multi: boolean = false
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (multi) {
      newParams.delete(key);
      (value as string[]).forEach((v) => newParams.append(key, v));
    } else {
      if (!value) {
        newParams.delete(key);
      } else {
        newParams.set(key, value as string);
      }
    }
    newParams.set("page", "1");
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleMultiCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const { value, checked } = e.target;
    const currentValues = searchParams.getAll(key);
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }
    handleFilterChange(key, newValues, true);
  };

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    newParams.delete("brand");
    newParams.set("page", "1");
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());
    if (price.min) newParams.set("minPrice", price.min);
    else newParams.delete("minPrice");
    if (price.max) newParams.set("maxPrice", price.max);
    else newParams.delete("maxPrice");
    newParams.set("page", "1");
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    const query = searchParams.get("q");
    if (query) {
      newParams.set("q", query);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // ✅ Fix: categories are strings, not objects
  const uniqueCategories = ["All", ...categories];
  const selectedCategory = searchParams.get("category") || "All";
  const selectedBrands = searchParams.getAll("brand");
  const selectedRating = searchParams.get("rating");
  const selectedGenders = searchParams.getAll("gender");
  const selectedMaterials = searchParams.getAll("material");
  const selectedPatterns = searchParams.getAll("pattern");

  return (
    <div className="space-y-8">
      <div>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Clear all filters
        </button>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Department</h3>
        <div className="mt-4 space-y-2">
          {uniqueCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`block text-left w-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? "text-accent font-bold"
                  : "text-gray-600 hover:text-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Gender</h3>
        <div className="mt-4 space-y-2">
          {genderFilters.map((gender) => (
            <div key={gender} className="flex items-center">
              <input
                id={`gender-${gender}`}
                name="gender"
                value={gender}
                type="checkbox"
                checked={selectedGenders.includes(gender)}
                onChange={(e) => handleMultiCheckboxChange(e, "gender")}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label
                htmlFor={`gender-${gender}`}
                className="ml-3 text-sm text-gray-600"
              >
                {gender}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Price</h3>
        <div className="mt-4">
          <form
            className="flex items-center space-x-2"
            onSubmit={handlePriceSubmit}
          >
            <input
              type="number"
              name="min"
              value={price.min}
              onChange={handlePriceChange}
              placeholder="$ Min"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:ring-accent focus:border-accent"
              aria-label="Minimum price"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              name="max"
              value={price.max}
              onChange={handlePriceChange}
              placeholder="$ Max"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:ring-accent focus:border-accent"
              aria-label="Maximum price"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Brand</h3>
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          {allBrands.map((brand) => (
            <div key={brand} className="flex items-center">
              <input
                id={`brand-${brand}`}
                name="brand"
                value={brand}
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleMultiCheckboxChange(e, "brand")}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label
                htmlFor={`brand-${brand}`}
                className="ml-3 text-sm text-gray-600"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Material</h3>
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          {allMaterials.map((material) => (
            <div key={material} className="flex items-center">
              <input
                id={`material-${material}`}
                name="material"
                value={material}
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={(e) => handleMultiCheckboxChange(e, "material")}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label
                htmlFor={`material-${material}`}
                className="ml-3 text-sm text-gray-600"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Pattern</h3>
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          {allPatterns.map((pattern) => (
            <div key={pattern} className="flex items-center">
              <input
                id={`pattern-${pattern}`}
                name="pattern"
                value={pattern}
                type="checkbox"
                checked={selectedPatterns.includes(pattern)}
                onChange={(e) => handleMultiCheckboxChange(e, "pattern")}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label
                htmlFor={`pattern-${pattern}`}
                className="ml-3 text-sm text-gray-600"
              >
                {pattern}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Rating</h3>
        <div className="mt-4 space-y-2">
          {ratingFilters.map((rating) => (
            <button
              key={rating.value}
              type="button"
              onClick={() => handleFilterChange("rating", String(rating.value))}
              className={`flex items-center text-sm font-medium transition-colors duration-200 w-full text-left ${
                selectedRating === String(rating.value)
                  ? "text-accent font-bold"
                  : "text-gray-600 hover:text-accent"
              }`}
            >
              <span className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < rating.value ? "text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </span>
              <span className="ml-2">{rating.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Availability</h3>
        <div className="mt-4 flex items-center">
          <input
            id="availability"
            name="availability"
            type="checkbox"
            checked={searchParams.get("availability") === "true"}
            onChange={(e) =>
              handleFilterChange("availability", e.target.checked ? "true" : "")
            }
            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <label htmlFor="availability" className="ml-3 text-sm text-gray-600">
            Include Out of Stock
          </label>
        </div>
      </div>
    </div>
  );
};

export default SideFilter;
