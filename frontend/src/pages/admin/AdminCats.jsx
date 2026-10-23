import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Cat,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  HeartHandshake,
  X,
} from "lucide-react";
import { getCats, deleteCat } from "../../services/catService.js";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../../utils/imageUtils.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function AdminCats() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cats, setCats] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Delete modal state
  const [catToDelete, setCatToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        sort,
      };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (gender) params.gender = gender;

      const response = await getCats(params);
      if (response?.data) {
        setCats(response.data.cats || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching cats:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to retrieve cat catalog."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
    // Sync to URL
    const query = {};
    if (search.trim()) query.search = search.trim();
    if (status) query.status = status;
    if (gender) query.gender = gender;
    if (sort !== "newest") query.sort = sort;
    if (page > 1) query.page = String(page);
    setSearchParams(query, { replace: true });
  }, [page, status, gender, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCats();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setGender("");
    setSort("newest");
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!catToDelete) return;
    setDeleting(true);
    try {
      await deleteCat(catToDelete._id);
      setFeedback({
        type: "success",
        message: `Cat "${catToDelete.name}" was successfully deleted.`,
      });
      setCatToDelete(null);
      // Refresh list
      fetchCats();
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete cat.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (catStatus) => {
    switch (catStatus) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            <span className="capitalize">Available</span>
          </span>
        );
      case "reserved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            <span className="capitalize">Reserved</span>
          </span>
        );
      case "sold":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <HeartHandshake className="h-3 w-3" />
            <span className="capitalize">Sold</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {catStatus}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Cat Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            View, edit, and organize cats in your discovery catalog ({pagination.total} total)
          </p>
        </div>

        <div>
          <Link
            to="/admin/cats/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Cat</span>
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, breed, location, or color..."
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
            >
              Search
            </button>
            {(search || status || gender || sort !== "newest") && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-white"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-gray-200">
          <LoadingSpinner text="Fetching cat listings..." />
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorMessage message={error} />
        </div>
      ) : cats.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-gray-200">
          <EmptyState
            title="No cats match your filters"
            message="Try clearing your search query or adjusting status/gender filters."
          />
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm text-gray-600">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Cat</th>
                    <th className="px-3 py-3.5">Breed</th>
                    <th className="px-3 py-3.5">Gender / Age</th>
                    <th className="px-3 py-3.5">Location</th>
                    <th className="px-3 py-3.5">Price</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5 text-center">Featured</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cats.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Cat Thumbnail + Name */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.images?.[0] || FALLBACK_CAT_IMAGE}
                            alt={cat.name}
                            className="h-12 w-12 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                            onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 group-hover:text-brand-600 transition">
                                {cat.name}
                              </span>
                              {cat.featured && (
                                <Star
                                  className="h-3.5 w-3.5 text-amber-500 fill-amber-400 shrink-0"
                                  title="Featured Cat"
                                />
                              )}
                            </div>
                            <span className="text-xs text-gray-400 block truncate">
                              /{cat.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Breed */}
                      <td className="px-3 py-3.5 font-medium text-gray-800">
                        {cat.breed}
                      </td>

                      {/* Gender / Age */}
                      <td className="px-3 py-3.5 text-gray-600 capitalize">
                        {cat.gender} • {cat.age} {cat.ageUnit}
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3.5 text-gray-600">
                        {cat.location}
                      </td>

                      {/* Price */}
                      <td className="px-3 py-3.5 font-bold text-gray-900">
                        ₹{cat.price?.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        {getStatusBadge(cat.status)}
                      </td>

                      {/* Featured */}
                      <td className="px-3 py-3.5 text-center">
                        {cat.featured ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/cats/${cat.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            title="Preview live public page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <Link
                            to={`/admin/cats/${cat._id}/edit`}
                            className="p-1.5 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                            title="Edit Cat"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setCatToDelete(cat)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Cat"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (< 768px) to avoid horizontal overflow */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {cats.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={cat.images?.[0] || FALLBACK_CAT_IMAGE}
                    alt={cat.name}
                    className="h-16 w-16 rounded-xl object-cover border border-gray-200 shrink-0"
                    onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <h4 className="font-bold text-gray-900 truncate">
                          {cat.name}
                        </h4>
                        {cat.featured && (
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400 shrink-0" />
                        )}
                      </div>
                      <span className="font-extrabold text-brand-600 text-sm">
                        ₹{cat.price?.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-0.5">
                      {cat.breed} • {cat.gender}, {cat.age} {cat.ageUnit}
                    </p>

                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      📍 {cat.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>{getStatusBadge(cat.status)}</div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/cats/${cat.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg text-xs"
                      title="View live"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      to={`/admin/cats/${cat._id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold rounded-lg text-xs transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setCatToDelete(cat)}
                      className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs transition"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Showing page <span className="font-semibold">{pagination.page}</span> of{" "}
                <span className="font-semibold">{pagination.totalPages}</span> (
                {pagination.total} total cats)
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete Cat Profile
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 font-semibold">{catToDelete.name}</strong>?
              This action cannot be undone and will permanently remove this cat from PurrConnect.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setCatToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-70 transition"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
