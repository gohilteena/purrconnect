import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { createEnquiry } from "../services/enquiryService.js";

export default function Contact() {
  const [searchParams] = useSearchParams();

  const cat = searchParams.get("cat") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cat,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      };

      if (form.cat) {
        payload.cat = form.cat;
      }

      await createEnquiry(payload);

      setSuccess(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        cat: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50">
      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="font-semibold text-brand-600">
            Let's connect
          </p>

          <h1 className="mt-2 text-4xl font-black text-gray-900 sm:text-5xl">
            Contact PurrConnect
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Have a question about a cat or want to know more? Send us
            a message and we'll get back to you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="rounded-3xl bg-gray-900 p-8 text-white">
          <h2 className="text-2xl font-bold">
            We'd love to hear from you
          </h2>

          <p className="mt-4 leading-7 text-gray-300">
            Whether you're interested in a specific cat or simply
            exploring your options, we're here to help.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-brand-400" />
              <span>hello@purrconnect.com</span>
            </div>

            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-brand-400" />
              <span>+91 00000 00000</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Name
              </label>

              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-700">
              Phone
            </label>

            <input
              required
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-500"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-700">
              Message
            </label>

            <textarea
              required
              name="message"
              rows="6"
              minLength={10}
              maxLength={1000}
              value={form.message}
              onChange={handleChange}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-500"
              placeholder="Tell us how we can help..."
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <div className="mt-4 flex gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {success}
            </div>
          )}

          <button
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </section>
    </main>
  );
}