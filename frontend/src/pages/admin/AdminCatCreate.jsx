import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatForm from "../../components/admin/CatForm.jsx";
import { createCat } from "../../services/catService.js";

export default function AdminCatCreate() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleCreateCat = async (payload) => {
    setLoading(true);
    setApiError(null);
    try {
      await createCat(payload);
      navigate("/admin/cats");
    } catch (err) {
      console.error("Create cat error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create cat record.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Add New Cat
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Create a new feline listing for adoption or discovery on PurrConnect
        </p>
      </div>

      <CatForm
        onSubmit={handleCreateCat}
        loading={loading}
        apiError={apiError}
        isEdit={false}
      />
    </div>
  );
}
