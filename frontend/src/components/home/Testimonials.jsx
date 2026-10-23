import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getTestimonials } from "../../services/testimonialService.js";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await getTestimonials(6);

        setItems(response?.data?.testimonials || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load testimonials."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-brand-600">
            Happy connections
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            What Cat Lovers Say
          </h2>
        </div>

        <div className="mt-12">
          {loading && <LoadingSpinner text="Loading stories..." />}

          {!loading && error && <ErrorMessage message={error} />}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              title="No testimonials yet"
              message="We will share happy stories here soon."
            />
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item._id || item.id}
                  className="rounded-3xl border border-gray-100 bg-gray-50 p-6"
                >
                  <div className="flex gap-1">
                    {Array.from({
                      length: item.rating || 5,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-current text-yellow-500"
                      />
                    ))}
                  </div>

                  <p className="mt-5 leading-7 text-gray-700">
                    “{item.message}”
                  </p>

                  <div className="mt-6">
                    <p className="font-bold text-gray-900">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.location}
                      {item.catName ? ` · ${item.catName}` : ""}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}