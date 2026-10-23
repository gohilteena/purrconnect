import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Syringe,
  Sparkles,
} from "lucide-react";

import { getCatById } from "../services/catService.js";
import useFavorites from "../hooks/useFavorites.js";
import EnquiryModal from "../components/cats/EnquiryModal.jsx";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../utils/imageUtils.js";

function formatAge(age, ageUnit) {
  if (!age && age !== 0) {
    return "Age not available";
  }

  const unit =
    ageUnit === "weeks"
      ? "week"
      : ageUnit === "months"
        ? "month"
        : "year";

  return `${age} ${unit}${age === 1 ? "" : "s"}`;
}

export default function CatDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [cat, setCat] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadCat = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCatById(slug);

        setCat(response?.data?.cat || null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load this cat profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCat();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-50/50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
          <p className="mt-4 text-gray-600 font-medium text-sm">
            Loading feline profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !cat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-50/50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            Cat not found
          </h1>

          <p className="mt-3 text-gray-600 text-sm">
            {error || "This cat listing could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/cats")}
            className="mt-6 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-xs hover:bg-brand-700 transition"
          >
            Back to All Cats
          </button>
        </div>
      </main>
    );
  }

  const images =
    Array.isArray(cat.images) && cat.images.length > 0
      ? cat.images
      : [FALLBACK_CAT_IMAGE];

  const catId = cat._id || cat.id;
  const favorite = isFavorite(catId);

  const whatsappMessage = encodeURIComponent(
    `Hi PurrConnect, I am interested in adopting ${cat.name} (${cat.breed}). Location: ${cat.location}.`
  );

  return (
    <main className="min-h-screen bg-brand-50/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/cats"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cats</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery Component */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
              <img
                src={images[activeImage] || FALLBACK_CAT_IMAGE}
                alt={`${cat.name} - ${cat.breed} cat portrait`}
                className="aspect-[4/3] w-full object-cover transition-opacity duration-300"
                onError={(event) => handleImageError(event, FALLBACK_CAT_IMAGE)}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      activeImage === index
                        ? "border-brand-600 shadow-md ring-2 ring-brand-500/20"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${cat.name} thumbnail ${index + 1}`}
                      className="aspect-square w-full object-cover"
                      onError={(event) => handleImageError(event, FALLBACK_CAT_IMAGE)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      cat.status === "available"
                        ? "bg-emerald-100 text-emerald-800"
                        : cat.status === "reserved"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cat.status}
                  </span>

                  <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
                    {cat.name}
                  </h1>

                  <p className="mt-1 text-base sm:text-lg text-gray-500 font-medium">
                    {cat.breed}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(catId)}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
                    favorite
                      ? "border-red-200 bg-red-50 text-red-500 shadow-xs"
                      : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                  }`}
                  aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
                >
                  <Heart
                    className="h-6 w-6"
                    fill={favorite ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <p className="mt-5 text-3xl font-black text-brand-600">
                ₹{Number(cat.price || 0).toLocaleString("en-IN")}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <DetailItem label="Gender" value={cat.gender} />
                <DetailItem label="Age" value={formatAge(cat.age, cat.ageUnit)} />
                <DetailItem label="Color" value={cat.color} />
                <DetailItem
                  label="Location"
                  value={cat.location}
                  icon={<MapPin className="h-4 w-4 text-brand-500" />}
                />
              </div>

              {/* Health & Vaccination */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50/80 border border-emerald-100 p-4">
                  <div className="flex items-center gap-2 font-semibold text-emerald-900 text-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Health Status</span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm capitalize text-emerald-800 font-medium">
                    {cat.healthStatus?.replaceAll("_", " ") || "Healthy"}
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-4">
                  <div className="flex items-center gap-2 font-semibold text-blue-900 text-sm">
                    <Syringe className="h-4 w-4 text-blue-600" />
                    <span>Vaccination</span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm capitalize text-blue-800 font-medium">
                    {cat.vaccinationStatus?.replaceAll("_", " ") || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-xs hover:bg-brand-700 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enquire for Adoption</span>
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Personality Tags */}
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-600" />
                <span>Personality & Traits</span>
              </h2>

              {Array.isArray(cat.personality) && cat.personality.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {cat.personality.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 shadow-2xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  {typeof cat.personality === "string" && cat.personality
                    ? cat.personality
                    : "No specific personality traits recorded yet."}
                </p>
              )}
            </section>

            {/* Description */}
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 md:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                About {cat.name}
              </h2>

              <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-600 text-sm sm:text-base">
                {cat.description || "No detailed description is available yet."}
              </p>
            </section>
          </div>
        </div>
      </div>

      {showEnquiryModal && (
        <EnquiryModal
          cat={cat}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}
    </main>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3 sm:p-4 border border-gray-100">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 flex items-center gap-1.5 capitalize font-bold text-gray-900 text-sm">
        {icon}
        <span>{value || "Not specified"}</span>
      </p>
    </div>
  );
}
