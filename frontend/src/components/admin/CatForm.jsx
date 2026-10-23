import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  Loader2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../../utils/imageUtils.js";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const AGE_UNITS = [
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];

const CAT_STATUSES = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

const HEALTH_STATUSES = [
  { value: "healthy", label: "Healthy" },
  { value: "recovering", label: "Recovering" },
  { value: "needs_care", label: "Needs Care" },
];

const VACCINATION_STATUSES = [
  { value: "fully_vaccinated", label: "Fully Vaccinated" },
  { value: "partially_vaccinated", label: "Partially Vaccinated" },
  { value: "not_vaccinated", label: "Not Vaccinated" },
];

const SUGGESTED_TAGS = [
  "Playful",
  "Affectionate",
  "Calm",
  "Curious",
  "Cuddly",
  "Social",
  "Energetic",
  "Quiet",
  "Loves Treats",
  "Friendly",
];

export default function CatForm({
  initialData = {},
  onSubmit,
  loading = false,
  isEdit = false,
  apiError = null,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    breed: initialData.breed || "",
    gender: initialData.gender || "male",
    age: initialData.age ?? 3,
    ageUnit: initialData.ageUnit || "months",
    color: initialData.color || "",
    location: initialData.location || "",
    price: initialData.price ?? 5000,
    description: initialData.description || "",
    personality: Array.isArray(initialData.personality) ? initialData.personality : [],
    healthStatus: initialData.healthStatus || "healthy",
    vaccinationStatus: initialData.vaccinationStatus || "not_vaccinated",
    images: Array.isArray(initialData.images) ? initialData.images : [],
    status: initialData.status || "available",
    featured: Boolean(initialData.featured),
  });

  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === "" ? "" : Number(value)
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Personality tag management
  const handleAddTag = (tagToAdd) => {
    const tag = (tagToAdd || tagInput).trim();
    if (!tag) return;
    if (formData.personality.includes(tag)) {
      setTagInput("");
      return;
    }
    if (formData.personality.length >= 10) {
      setErrors((prev) => ({ ...prev, personality: "Maximum 10 personality traits allowed." }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      personality: [...prev.personality, tag],
    }));
    setTagInput("");
    if (errors.personality) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.personality;
        return u;
      });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      personality: prev.personality.filter((t) => t !== tagToRemove),
    }));
  };

  // Image management
  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddImage = (urlToAdd) => {
    const url = (urlToAdd || imageUrlInput).trim();
    if (!url) return;

    if (!isValidUrl(url)) {
      setErrors((prev) => ({ ...prev, images: "Please provide a valid image URL (http/https)." }));
      return;
    }

    if (formData.images.includes(url)) {
      setImageUrlInput("");
      return;
    }

    if (formData.images.length >= 8) {
      setErrors((prev) => ({ ...prev, images: "Maximum 8 images allowed per cat." }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setImageUrlInput("");
    if (errors.images) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.images;
        return u;
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddDemoImage = () => {
    const seed = Math.floor(Math.random() * 9000) + 1000;
    const sampleUrl = `https://cataas.com/cat?width=800&height=600&seed=${seed}`;
    handleAddImage(sampleUrl);
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (formData.name.trim().length > 60) {
      newErrors.name = "Name cannot exceed 60 characters.";
    }

    if (!formData.breed.trim() || formData.breed.trim().length < 2) {
      newErrors.breed = "Breed must be at least 2 characters.";
    }

    if (formData.age === "" || isNaN(formData.age) || Number(formData.age) < 0) {
      newErrors.age = "Age must be a non-negative number.";
    } else if (Number(formData.age) > 300) {
      newErrors.age = "Age cannot exceed 300.";
    }

    if (!formData.color.trim() || formData.color.trim().length < 2) {
      newErrors.color = "Color is required (min 2 characters).";
    }

    if (!formData.location.trim() || formData.location.trim().length < 2) {
      newErrors.location = "Location is required (min 2 characters).";
    }

    if (formData.price === "" || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a valid non-negative number.";
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = "Description cannot exceed 2000 characters.";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one valid image URL is recommended.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Prepare payload
    const payload = {
      ...formData,
      name: formData.name.trim(),
      breed: formData.breed.trim(),
      color: formData.color.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      age: Number(formData.age),
      price: Number(formData.price),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {apiError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1 font-medium">{apiError}</div>
        </div>
      )}

      {/* Basic Identification */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <span>Basic Feline Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Cat Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Luna, Milo"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Breed */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Breed <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="e.g. Persian, Maine Coon, Siamese"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.breed
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.breed && <p className="mt-1 text-xs text-red-600">{errors.breed}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white transition"
            >
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Age & Age Unit */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Age <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="age"
                min="0"
                max="300"
                value={formData.age}
                onChange={handleChange}
                placeholder="6"
                className={`w-1/2 rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition ${
                  errors.age
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
                }`}
              />
              <select
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleChange}
                className="w-1/2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white transition"
              >
                {AGE_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Color Coat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Golden Tabby, Pure White"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.color
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.color && <p className="mt-1 text-xs text-red-600">{errors.color}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Location City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai, Delhi, Bangalore"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.location
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
          </div>
        </div>
      </div>

      {/* Commercial & Status */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Commercial, Health & Availability
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="25000"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition ${
                errors.price
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white transition"
            >
              {CAT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Health Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Health Status
            </label>
            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white transition"
            >
              {HEALTH_STATUSES.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* Vaccination Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Vaccination Status
            </label>
            <select
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white transition"
            >
              {VACCINATION_STATUSES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="pt-2">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 transition"
            />
            <span className="text-sm font-semibold text-gray-900">
              Mark as Featured Cat
            </span>
            <span className="text-xs text-gray-500">
              (Featured cats appear prominently on the public homepage)
            </span>
          </label>
        </div>
      </div>

      {/* Description & Personality */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Bio & Personality
        </h3>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Description / Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Introduce this cat's charming personality, habits, background, and favorite activities..."
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
              errors.description
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-brand-500 focus:ring-brand-500/20"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-xs text-red-600">{errors.description}</p>
            ) : (
              <span className="text-xs text-gray-400">Min 10, max 2000 characters.</span>
            )}
            <span className="text-xs text-gray-400">
              {formData.description.length} / 2000
            </span>
          </div>
        </div>

        {/* Personality Tags */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Personality Traits (Max 10)
          </label>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="e.g. Playful, Cuddly"
              className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleAddTag()}
              className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Trait</span>
            </button>
          </div>

          {errors.personality && (
            <p className="mb-2 text-xs text-red-600">{errors.personality}</p>
          )}

          {/* Active Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.personality.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-600 transition"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {formData.personality.length === 0 && (
              <span className="text-xs text-gray-400 italic">No traits added yet.</span>
            )}
          </div>

          {/* Suggested Chips */}
          <div>
            <span className="text-xs font-medium text-gray-500 mr-2">Quick suggestions:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = formData.personality.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    disabled={isSelected}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      isSelected
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600"
                    }`}
                  >
                    + {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Cat Photo Gallery</h3>
            <p className="text-xs text-gray-500">Provide direct image URLs (up to 8 photos)</p>
          </div>
          <button
            type="button"
            onClick={handleAddDemoImage}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg border border-brand-200 bg-brand-50/50 hover:bg-brand-50 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Demo Cat Image</span>
          </button>
        </div>

        <div>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              placeholder="https://example.com/cat-photo.jpg"
              className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleAddImage()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add URL</span>
            </button>
          </div>
          {errors.images && (
            <p className="mt-1.5 text-xs text-red-600">{errors.images}</p>
          )}
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {formData.images.map((url, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 aspect-square"
            >
              <img
                src={url}
                alt={`Cat photo preview ${idx + 1}`}
                className="h-full w-full object-cover transition group-hover:scale-105"
                onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur">
                #{idx + 1}
              </span>
            </div>
          ))}

          {formData.images.length === 0 && (
            <div className="col-span-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 flex flex-col items-center justify-center">
              <ImageIcon className="h-8 w-8 mb-2 text-gray-300" />
              <p className="text-xs">No images added yet. Paste a URL or click "Generate Demo Cat Image".</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <Link
          to="/admin/cats"
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isEdit ? "Saving Changes..." : "Creating Cat..."}</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>{isEdit ? "Update Cat" : "Create Cat"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
