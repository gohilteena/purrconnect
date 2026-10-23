import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  MessageSquare,
  Mail,
  Phone,
  Cat,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { getEnquiries, updateEnquiryStatus } from "../../services/enquiryService.js";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../../utils/imageUtils.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

const STATUSES = [
  { value: "", label: "All Enquiries" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default function AdminEnquiries() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (statusFilter) params.status = statusFilter;

      const response = await getEnquiries(params);
      if (response?.data) {
        setEnquiries(response.data.enquiries || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    const q = {};
    if (statusFilter) q.status = statusFilter;
    if (page > 1) q.page = String(page);
    setSearchParams(q, { replace: true });
  }, [statusFilter, page]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdatingId(enquiryId);
    try {
      const response = await updateEnquiryStatus(enquiryId, newStatus);
      const updatedEnquiry = response?.data?.enquiry;

      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiryId ? { ...e, status: newStatus } : e))
      );

      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
      }

      setFeedback({
        type: "success",
        message: `Status updated to "${newStatus}".`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to update enquiry status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <Sparkles className="h-3 w-3" />
            <span className="capitalize">New</span>
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" />
            <span className="capitalize">Contacted</span>
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <CheckCircle2 className="h-3 w-3" />
            <span className="capitalize">Closed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {s}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Adoption Enquiries
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review and follow up on adoption inquiries from potential adopters ({pagination.total} total)
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
          {STATUSES.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  active
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
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

      {/* Table / List View */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-gray-200">
          <LoadingSpinner text="Retrieving enquiries..." />
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorMessage message={error} />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-gray-200">
          <EmptyState
            title="No enquiries found"
            message={
              statusFilter
                ? `There are no enquiries with status "${statusFilter}".`
                : "No adoption enquiries have been submitted yet."
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
                    <th className="py-3.5 pl-6 pr-3">Applicant</th>
                    <th className="px-3 py-3.5">Contact Details</th>
                    <th className="px-3 py-3.5">Cat Interested In</th>
                    <th className="px-3 py-3.5">Message Preview</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Date</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enquiries.map((enq) => (
                    <tr
                      key={enq._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Applicant */}
                      <td className="py-3.5 pl-6 pr-3 font-semibold text-gray-900">
                        {enq.name}
                      </td>

                      {/* Contact */}
                      <td className="px-3 py-3.5 text-xs space-y-1">
                        <a
                          href={`mailto:${enq.email}`}
                          className="flex items-center gap-1.5 text-gray-700 hover:text-brand-600 transition"
                        >
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span>{enq.email}</span>
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="flex items-center gap-1.5 text-gray-700 hover:text-brand-600 transition"
                        >
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <span>{enq.phone}</span>
                        </a>
                      </td>

                      {/* Cat */}
                      <td className="px-3 py-3.5">
                        {enq.cat ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                enq.cat.images?.[0] || FALLBACK_CAT_IMAGE
                              }
                              alt={enq.cat.name}
                              className="h-8 w-8 rounded-lg object-cover border border-gray-200 shrink-0"
                              onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
                            />
                            <div>
                              <Link
                                to={`/cats/${enq.cat.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-gray-900 hover:text-brand-600 inline-flex items-center gap-1 text-xs"
                              >
                                <span>{enq.cat.name}</span>
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              </Link>
                              <p className="text-[11px] text-gray-400">
                                {enq.cat.breed}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Cat profile removed
                          </span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="px-3 py-3.5 max-w-xs">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {enq.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        <select
                          value={enq.status}
                          disabled={updatingId === enq._id}
                          onChange={(e) =>
                            handleStatusChange(enq._id, e.target.value)
                          }
                          className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {enq.name}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>{getStatusBadge(enq.status)}</div>
                </div>

                {enq.cat && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <img
                      src={
                        enq.cat.images?.[0] || FALLBACK_CAT_IMAGE
                      }
                      alt={enq.cat.name}
                      className="h-8 w-8 rounded-lg object-cover border border-gray-200 shrink-0"
                      onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        Interested in: {enq.cat.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {enq.cat.breed}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-600 line-clamp-2 italic">
                  "{enq.message}"
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <select
                    value={enq.status}
                    disabled={updatingId === enq._id}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800 bg-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(enq)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-semibold hover:bg-brand-100 transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Page <span className="font-semibold">{pagination.page}</span> of{" "}
                <span className="font-semibold">{pagination.totalPages}</span> (
                {pagination.total} total enquiries)
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-100 text-brand-600">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Enquiry Details
                  </h3>
                  <p className="text-xs text-gray-400">
                    Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Applicant Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-500 font-medium">Applicant Name</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {selectedEnquiry.name}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-500 font-medium">Status</p>
                <div className="mt-1">{getStatusBadge(selectedEnquiry.status)}</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-500 font-medium">Email Address</p>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="font-semibold text-brand-600 hover:underline mt-0.5 block truncate"
                >
                  {selectedEnquiry.email}
                </a>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-500 font-medium">Phone Number</p>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="font-semibold text-brand-600 hover:underline mt-0.5 block"
                >
                  {selectedEnquiry.phone}
                </a>
              </div>
            </div>

            {/* Related Cat Profile */}
            {selectedEnquiry.cat && (
              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedEnquiry.cat.images?.[0] || FALLBACK_CAT_IMAGE
                    }
                    alt={selectedEnquiry.cat.name}
                    className="h-10 w-10 rounded-xl object-cover border border-gray-200"
                    onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
                  />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">
                      {selectedEnquiry.cat.name}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {selectedEnquiry.cat.breed}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/cats/${selectedEnquiry.cat.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <span>Cat Profile</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Message Body */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Message Content
              </p>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status Selector in Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Update Status:</span>
                <select
                  value={selectedEnquiry.status}
                  disabled={updatingId === selectedEnquiry._id}
                  onChange={(e) =>
                    handleStatusChange(selectedEnquiry._id, e.target.value)
                  }
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-800 bg-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
