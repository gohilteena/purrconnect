import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFeaturedCats } from "../../services/catService.js";
import useFavorites from "../../hooks/useFavorites.js";

import CatCard from "../cats/CatCard.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function FeaturedCats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  useEffect(() => {
    const loadCats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFeaturedCats();

        setCats(response?.data?.cats || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load featured cats."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCats();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-brand-600">
              Meet your match
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Cats
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Discover some of the lovely cats currently looking for
              their perfect home.
            </p>
          </div>

          <Link
            to="/cats"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            View all cats →
          </Link>
        </div>

        {/* Cats */}
        <div className="mt-10">
          {loading && (
            <LoadingSpinner text="Finding featured cats..." />
          )}

          {!loading && error && (
            <ErrorMessage message={error} />
          )}

          {!loading && !error && cats.length === 0 && (
            <EmptyState
              title="No featured cats yet"
              message="Check back soon for cats waiting to meet you."
            />
          )}

          {!loading && !error && cats.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((cat) => {
                const id = cat._id || cat.id;

                return (
                  <CatCard
                    key={id}
                    cat={cat}
                    isFavorite={isFavorite(id)}
                    onToggleFavorite={toggleFavorite}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}