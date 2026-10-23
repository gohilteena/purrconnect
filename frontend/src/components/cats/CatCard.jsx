import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import FavoriteButton from "./FavoriteButton.jsx";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../../utils/imageUtils.js";

function formatAge(age, ageUnit) {
  if (!age && age !== 0) return "Age not available";

  const unit =
    ageUnit === "weeks"
      ? "week"
      : ageUnit === "months"
        ? "month"
        : "year";

  return `${age} ${unit}${age === 1 ? "" : "s"}`;
}

export default function CatCard({
  cat,
  isFavorite,
  onToggleFavorite,
}) {
  const image = cat.images?.[0] || FALLBACK_CAT_IMAGE;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={`Adoptable ${cat.breed || "cat"} named ${cat.name}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => handleImageError(event, FALLBACK_CAT_IMAGE)}
          />

          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold shadow-xs ${
                cat.status === "available"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : cat.status === "reserved"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {cat.status}
            </span>
          </div>

          <div className="absolute right-3 top-3">
            <FavoriteButton
              catId={cat._id || cat.id}
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition">
                {cat.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500 font-medium">
                {cat.breed}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-brand-600">
                ₹{Number(cat.price || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <span>{formatAge(cat.age, cat.ageUnit)}</span>

            <span className="capitalize">
              {cat.gender}
            </span>

            <span className="col-span-2 flex items-center gap-1 text-gray-500 text-xs">
              <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span>{cat.location}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          to={`/cats/${cat.slug || cat._id || cat.id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 shadow-xs"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
