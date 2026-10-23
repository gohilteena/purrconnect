import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
}) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{message}</span>
      </div>
    </div>
  );
}