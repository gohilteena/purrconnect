import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import CatCard from "../components/cats/CatCard.jsx";
import CatFilters from "../components/cats/CatFilters.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

import { getCats } from "../services/catService.js";
import useFavorites from "../hooks/useFavorites.js";

const initialFilters = {
  search: "",
  breed: "",
  gender: "",
  ageUnit: "",
  location: "",
  minPrice: "",
  maxPrice: "",
  status: "available",
  sort: "newest",
};

export default function Cats() {
  const [filters, setFilters] = useState(initialFilters);
  const [cats, setCats] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCats = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: 12,
        };

        Object.entries(filters).forEach(
          ([key, value]) => {
            if (value !== "") {
              params[key] = value;
            }
          }
        );

        const response = await getCats(params);

        const data = response?.data || {};

        setCats(data.cats || []);
        setPagination(data.pagination || null);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError(
            err?.response?.data?.message ||
              "Unable to load cats. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCats();

    return () => controller.abort();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <main className="min-h-screen bg-brand-50">
      {/* Header */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-brand-600">
            Explore PurrConnect
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
            Find Your Purrfect Companion
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Discover cats based on breed, personality,
            location, age and availability.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* Mobile filters button */}
        <div className="mb-5 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setShowFilters((current) => !current)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <CatFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={resetFilters}
            />
          </aside>

          {/* Results */}
          <div>
            {!loading && !error && (
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {pagination?.total ?? cats.length} cats found
                </p>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[300px] items-center justify-center">
                <LoadingSpinner />
              </div>
            )}

            {error && (
              <ErrorMessage message={error} />
            )}

            {!loading && !error && cats.length === 0 && (
              <EmptyState
                title="No cats found"
                message="Try changing your filters or search for another cat."
              />
            )}

            {!loading &&
              !error &&
              cats.length > 0 && (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {cats.map((cat) => {
                      const id =
                        cat._id || cat.id;

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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() =>
                          setPage((current) =>
                            current - 1
                          )
                        }
                        className="rounded-xl border bg-white px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>

                      <span className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
                        {page} / {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() =>
                          setPage((current) =>
                            current + 1
                          )
                        }
                        className="rounded-xl border bg-white px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}