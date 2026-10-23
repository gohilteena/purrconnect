import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{text}</span>
      </div>
    </div>
  );
}