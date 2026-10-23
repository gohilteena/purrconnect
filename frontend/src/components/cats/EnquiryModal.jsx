
import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { createEnquiry } from "../../services/enquiryService.js";

export default function EnquiryModal({ cat, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      newErrors.message =
        "Message must be at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      await createEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        cat: cat._id || cat.id,
        message: form.message.trim(),
      });

      setSuccess(true);
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Enquiry Sent!
          </h2>

          <p className="mt-3 text-gray-600">
            Thank you for your interest in{" "}
            <strong>{cat.name}</strong>. We have received your
            enquiry and will contact you soon.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="pr-10 text-2xl font-bold text-gray-900">
          Ask About {cat.name}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Send us your details and we'll get back to you.
        </p>

        {apiError && (
          <div className="mt-5 flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-brand-500 ${
                errors.name
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-brand-500 ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-brand-500 ${
                errors.phone
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Selected Cat
            </label>

            <input
              type="text"
              value={`${cat.name} - ${cat.breed}`}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Message
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder={`I'm interested in ${cat.name}...`}
              className={`w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-brand-500 ${
                errors.message
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />

            {errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}