import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cat,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Star,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import { getDashboardStats } from "../../services/dashboardService.js";
import { getCats } from "../../services/catService.js";
import { getEnquiries } from "../../services/enquiryService.js";
import { getTestimonials } from "../../services/testimonialService.js";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../../utils/imageUtils.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCats: 0,
    availableCats: 0,
    reservedCats: 0,
    soldCats: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalTestimonials: 0,
    recentEnquiries: [],
    recentCats: [],
  });

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // First attempt dedicated lightweight endpoint
      try {
        const response = await getDashboardStats();
        if (response?.data) {
          setStats(response.data);
          setLoading(false);
          return;
        }
      } catch (endpointErr) {
        // Fallback: aggregate using standard endpoints if dedicated is unreachable
        console.warn("Falling back to standard resource queries for dashboard stats:", endpointErr);
      }

      // Fallback query logic
      const [allCats, availCats, resCats, soldCats, allEnq, newEnq, testRes] =
        await Promise.all([
          getCats({ limit: 1 }),
          getCats({ status: "available", limit: 1 }),
          getCats({ status: "reserved", limit: 1 }),
          getCats({ status: "sold", limit: 1 }),
          getEnquiries({ limit: 5 }),
          getEnquiries({ status: "new", limit: 1 }),
          getTestimonials({ approved: "all", limit: 50 }),
        ]);

      setStats({
        totalCats: allCats?.data?.pagination?.total ?? 0,
        availableCats: availCats?.data?.pagination?.total ?? 0,
        reservedCats: resCats?.data?.pagination?.total ?? 0,
        soldCats: soldCats?.data?.pagination?.total ?? 0,
        totalEnquiries: allEnq?.data?.pagination?.total ?? 0,
        newEnquiries: newEnq?.data?.pagination?.total ?? 0,
        totalTestimonials: Array.isArray(testRes?.data?.testimonials)
          ? testRes.data.testimonials.length
          : 0,
        recentEnquiries: allEnq?.data?.enquiries || [],
        recentCats: allCats?.data?.cats || [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Gathering live metrics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 max-w-xl mx-auto py-12">
        <ErrorMessage message={error} />
        <div className="text-center">
          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Cats",
      value: stats.totalCats,
      description: "In discovery catalog",
      icon: Cat,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      iconBg: "bg-indigo-100 text-indigo-700",
      link: "/admin/cats",
    },
    {
      title: "Available Cats",
      value: stats.availableCats,
      description: "Ready for adoption",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-700",
      link: "/admin/cats?status=available",
    },
    {
      title: "Reserved Cats",
      value: stats.reservedCats,
      description: "Holding deposits placed",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      iconBg: "bg-amber-100 text-amber-700",
      link: "/admin/cats?status=reserved",
    },
    {
      title: "Sold Cats",
      value: stats.soldCats,
      description: "Found loving homes",
      icon: HeartHandshake,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      iconBg: "bg-purple-100 text-purple-700",
      link: "/admin/cats?status=sold",
    },
    {
      title: "Total Enquiries",
      value: stats.totalEnquiries,
      description: "Submitted applications",
      icon: MessageSquare,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      iconBg: "bg-blue-100 text-blue-700",
      link: "/admin/enquiries",
    },
    {
      title: "New Enquiries",
      value: stats.newEnquiries,
      description: "Awaiting response",
      icon: Sparkles,
      color: "bg-brand-50 text-brand-600 border-brand-100",
      iconBg: "bg-brand-100 text-brand-700",
      badge: stats.newEnquiries > 0 ? "Action Needed" : null,
      link: "/admin/enquiries?status=new",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      description: "Client reviews",
      icon: Star,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      iconBg: "bg-rose-100 text-rose-700",
      link: "/admin/testimonials",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome back, {user?.name || "Admin"}! 👋
            </h2>
            <p className="mt-1 text-sm text-brand-100 max-w-xl">
              Monitor feline availability, track prospective parent inquiries, and review client feedback all from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/cats/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Cat</span>
            </Link>

            <button
              type="button"
              onClick={fetchStats}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-800/40 border border-brand-400/30 px-3 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-brand-800/60 transition"
              title="Refresh statistics"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span>Platform Overview</span>
          <span className="text-xs font-normal text-gray-500">Live MongoDB counts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-brand-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} transition group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {card.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-100 text-brand-700 animate-pulse">
                      {card.badge}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mt-0.5">
                    {card.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-brand-600 group-hover:text-brand-700">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Recent Enquiries</h3>
              <p className="text-xs text-gray-500">Latest interest submissions</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
              stats.recentEnquiries.slice(0, 5).map((enq) => (
                <div key={enq._id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {enq.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span>Cat: <strong className="text-gray-700">{enq.cat?.name || "Cat"}</strong></span>
                      <span>•</span>
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                      "{enq.message}"
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                      enq.status === "new"
                        ? "bg-brand-50 text-brand-700 border border-brand-200"
                        : enq.status === "contacted"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No enquiries submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Cats */}
        <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Recently Added Cats</h3>
              <p className="text-xs text-gray-500">Latest additions to catalog</p>
            </div>
            <Link
              to="/admin/cats"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {stats.recentCats && stats.recentCats.length > 0 ? (
              stats.recentCats.slice(0, 5).map((cat) => (
                <div key={cat._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={cat.images?.[0] || FALLBACK_CAT_IMAGE}
                      alt={cat.name}
                      className="h-10 w-10 rounded-xl object-cover border border-gray-200 shrink-0"
                      onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {cat.breed} • ₹{cat.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        cat.status === "available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : cat.status === "reserved"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cat.status}
                    </span>

                    <Link
                      to={`/admin/cats/${cat._id}/edit`}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700 p-1"
                      title="Edit cat"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No cats added to catalog yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
