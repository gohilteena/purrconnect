import { Link } from "react-router-dom";
import { Cat } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <Cat className="mx-auto h-16 w-16 text-brand-500" />

        <p className="mt-6 text-6xl font-black text-gray-900">
          404
        </p>

        <h1 className="mt-3 text-2xl font-bold">
          Page not found
        </h1>

        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}