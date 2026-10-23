import { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  X,
  MessageSquare,
  Sparkles,
  User,
  Image as ImageIcon,
} from "lucide-react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/testimonialService.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filter: "all" | "approved" | "pending"
  const [filter, setFilter] = useState("all");

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = create mode
  const [modalFormData, setModalFormData] = useState({
    name: "",
    location: "",
    message: "",
    catName: "",
    image: "",
    rating: 5,
    approved: true,
  });
  const [modalErrors, setModalErrors] = useState({});
  const [modalApiError, setModalApiError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle approval state
  const [togglingId, setTogglingId] = useState(null);

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      // Admin requests all testimonials (both approved and unapproved)
      const response = await getTestimonials({ approved: "all", limit: 100 });
      if (response?.data?.testimonials) {
        setTestimonials(response.data.testimonials);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setModalFormData({
      name: "",
      location: "",
      message: "",
      catName: "",
      image: "",
      rating: 5,
      approved: true,
    });
    setModalErrors({});
    setModalApiError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setModalFormData({
      name: item.name || "",
      location: item.location || "",
      message: item.message || "",
      catName: item.catName || "",
      image: item.image || "",
      rating: item.rating ?? 5,
      approved: Boolean(item.approved),
    });
    setModalErrors({});
    setModalApiError(null);
    setModalOpen(true);
  };

  const validateModal = () => {
    const errs = {};
    if (!modalFormData.name.trim() || modalFormData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    } else if (modalFormData.name.trim().length > 80) {
      errs.name = "Name cannot exceed 80 characters.";
    }

    if (!modalFormData.location.trim() || modalFormData.location.trim().length < 2) {
      errs.location = "Location is required (min 2 characters).";
    }

    if (!modalFormData.message.trim() || modalFormData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters long.";
    } else if (modalFormData.message.trim().length > 1000) {
      errs.message = "Message cannot exceed 1000 characters.";
    }

    if (modalFormData.image.trim()) {
      try {
        new URL(modalFormData.image.trim());
      } catch {
        errs.image = "Please provide a valid image URL (e.g. https://...).";
      }
    }

    setModalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    setModalApiError(null);
    if (!validateModal()) return;

    setSaving(true);
    try {
      const payload = {
        name: modalFormData.name.trim(),
        location: modalFormData.location.trim(),
        message: modalFormData.message.trim(),
        catName: modalFormData.catName ? modalFormData.catName.trim() : "",
        image: modalFormData.image ? modalFormData.image.trim() : "",
        rating: Number(modalFormData.rating),
        approved: Boolean(modalFormData.approved),
      };

      if (editingItem) {
        // Update
        const response = await updateTestimonial(editingItem._id, payload);
        const updated = response?.data?.testimonial;
        setTestimonials((prev) =>
          prev.map((t) => (t._id === editingItem._id ? (updated || { ...t, ...payload }) : t))
        );
        setFeedback({
          type: "success",
          message: `Testimonial from "${payload.name}" updated successfully.`,
        });
      } else {
        // Create
        const response = await createTestimonial(payload);
        const created = response?.data?.testimonial;
        if (created) {
          setTestimonials((prev) => [created, ...prev]);
        } else {
          fetchTestimonials();
        }
        setFeedback({
          type: "success",
          message: `New testimonial from "${payload.name}" created successfully.`,
        });
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Testimonial save error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to save testimonial.";
      setModalApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleApproval = async (item) => {
    setTogglingId(item._id);
    const newApproved = !item.approved;
    try {
      await updateTestimonial(item._id, { approved: newApproved });
      setTestimonials((prev) =>
        prev.map((t) => (t._id === item._id ? { ...t, approved: newApproved } : t))
      );
      setFeedback({
        type: "success",
        message: `Review by "${item.name}" is now ${newApproved ? "Approved (visible on homepage)" : "Unapproved (hidden from homepage)"}.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to update approval status.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await deleteTestimonial(itemToDelete._id);
      setTestimonials((prev) => prev.filter((t) => t._id !== itemToDelete._id));
      setFeedback({
        type: "success",
        message: `Testimonial from "${itemToDelete.name}" was deleted.`,
      });
      setItemToDelete(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete testimonial.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "approved") return t.approved;
    if (filter === "pending") return !t.approved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage, approve, and curate feedback from happy cat parents ({testimonials.length} total)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({testimonials.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === "approved"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Approved ({testimonials.filter((t) => t.approved).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === "pending"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending ({testimonials.filter((t) => !t.approved).length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Review</span>
          </button>
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
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-gray-200">
          <LoadingSpinner text="Fetching testimonials..." />
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorMessage message={error} />
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-gray-200">
          <EmptyState
            title="No testimonials found"
            message={
              filter === "pending"
                ? "There are currently no reviews pending approval."
                : filter === "approved"
                ? "No approved reviews found."
                : "No client testimonials recorded yet."
            }
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
                    <th className="py-3.5 pl-6 pr-3">Author</th>
                    <th className="px-3 py-3.5">Cat Name</th>
                    <th className="px-3 py-3.5">Rating</th>
                    <th className="px-3 py-3.5">Review Message</th>
                    <th className="px-3 py-3.5 text-center">Approved Status</th>
                    <th className="px-3 py-3.5">Date</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTestimonials.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Author Name & Location */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {t.image ? (
                            <img
                              src={t.image}
                              alt={t.name}
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextElementSibling) {
                                  e.target.nextElementSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0 ${
                              t.image ? "hidden" : "flex"
                            }`}
                          >
                            {t.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">
                              {t.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              📍 {t.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cat Name */}
                      <td className="px-3 py-3.5 font-medium text-gray-800">
                        {t.catName ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 font-semibold border border-brand-200/60">
                            🐱 {t.catName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">None</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < (t.rating || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200 fill-gray-100"
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-3 py-3.5 max-w-sm">
                        <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed">
                          "{t.message}"
                        </p>
                      </td>

                      {/* Approved Toggle */}
                      <td className="px-3 py-3.5 text-center">
                        <button
                          type="button"
                          disabled={togglingId === t._id}
                          onClick={() => handleToggleApproval(t)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                            t.approved
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          }`}
                          title="Click to toggle approved status"
                        >
                          {togglingId === t._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : t.approved ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          <span>{t.approved ? "Approved" : "Pending"}</span>
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(t)}
                            className="p-1.5 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                            title="Edit Review"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setItemToDelete(t)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Review"
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

          {/* Mobile Card View (< 768px) to prevent horizontal overflow */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredTestimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextElementSibling) {
                            e.target.nextElementSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0 ${
                        t.image ? "hidden" : "flex"
                      }`}
                    >
                      {t.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {t.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">📍 {t.location}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={togglingId === t._id}
                    onClick={() => handleToggleApproval(t)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      t.approved
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {togglingId === t._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : t.approved ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>{t.approved ? "Approved" : "Pending"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < (t.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200 fill-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                  {t.catName && (
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
                      🐱 {t.catName}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "{t.message}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(t)}
                      className="px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-lg hover:bg-brand-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(t)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Edit Testimonial" : "Create Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* In-Modal Error Display */}
            {modalApiError && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span className="font-medium">{modalApiError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalFormData.name}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, name: e.target.value })
                    }
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  />
                  {modalErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{modalErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Location City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalFormData.location}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, location: e.target.value })
                    }
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  />
                  {modalErrors.location && (
                    <p className="mt-1 text-xs text-red-600">{modalErrors.location}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Cat Adopted Name
                  </label>
                  <input
                    type="text"
                    value={modalFormData.catName}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, catName: e.target.value })
                    }
                    placeholder="e.g. Luna"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={modalFormData.rating}
                    onChange={(e) =>
                      setModalFormData({
                        ...modalFormData,
                        rating: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Avatar / Photo URL
                </label>
                <input
                  type="text"
                  value={modalFormData.image}
                  onChange={(e) =>
                    setModalFormData({ ...modalFormData, image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/... (optional)"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                />
                {modalErrors.image && (
                  <p className="mt-1 text-xs text-red-600">{modalErrors.image}</p>
                )}
                {modalFormData.image && !modalErrors.image && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <img
                      src={modalFormData.image}
                      alt="Preview"
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span>Image preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Review Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={modalFormData.message}
                  onChange={(e) =>
                    setModalFormData({ ...modalFormData, message: e.target.value })
                  }
                  placeholder="Write the adopter's testimonial..."
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                />
                {modalErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{modalErrors.message}</p>
                )}
                <div className="text-right text-[11px] text-gray-400 mt-0.5">
                  {modalFormData.message.length} / 1000 characters
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalFormData.approved}
                    onChange={(e) =>
                      setModalFormData({
                        ...modalFormData,
                        approved: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Approve immediately for public display
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 disabled:opacity-70 transition"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? "Update Review" : "Create Review"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete Testimonial
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to delete the review by{" "}
              <strong className="text-gray-900 font-semibold">{itemToDelete.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setItemToDelete(null)}
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
