import { Heart } from "lucide-react";

export default function FavoriteButton({
  catId,
  isFavorite,
  onToggle,
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(catId);
      }}
      aria-label={
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition ${
        isFavorite
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500"
      }`}
    >
      <Heart
        className="h-5 w-5"
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}