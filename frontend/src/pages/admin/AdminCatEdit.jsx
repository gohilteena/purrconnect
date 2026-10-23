import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CatForm from "../../components/admin/CatForm.jsx";
import { getCatById, updateCat } from "../../services/catService.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

export default function AdminCatEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCat = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await getCatById(id);
        if (isMounted) {
          if (response?.data?.cat) {
            setCat(response.data.cat);
          } else {
            setFetchError("Cat record not found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load cat profile."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCat();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdateCat = async (payload) => {
    setSaving(true);
    setApiError(null);
    try {
      await updateCat(id, payload);
      navigate("/admin/cats");
    } catch (err) {
      console.error("Update cat error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update cat record.";
      setApiError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Loading cat profile..." />
      </div>
    );
  }

  if (fetchError || !cat) {
    return (
      <div className="space-y-4 max-w-lg mx-auto py-12">
        <ErrorMessage message={fetchError || "Cat profile not found"} />
        <div className="text-center">
          <Link
            to="/admin/cats"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Cat List</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to="/admin/cats" className="hover:text-brand-600 transition">
              Cats
            </Link>
            <span>/</span>
            <span>Edit Profile</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Edit Cat: {cat.name}
          </h2>
        </div>

        <Link
          to="/admin/cats"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cats</span>
        </Link>
      </div>

      <CatForm
        initialData={cat}
        onSubmit={handleUpdateCat}
        loading={saving}
        apiError={apiError}
        isEdit={true}
      />
    </div>
  );
}
