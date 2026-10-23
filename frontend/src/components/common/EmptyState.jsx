import { Cat } from "lucide-react";

export default function EmptyState({
  title = "No cats found",
  message = "Try changing your search or filters.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center">
      <Cat className="h-12 w-12 text-brand-500" />

      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-gray-600">
        {message}
      </p>
    </div>
  );
}