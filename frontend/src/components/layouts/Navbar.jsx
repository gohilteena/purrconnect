import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Cat, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Cats", to: "/cats" },
  { label: "Breeds", to: "/#breeds" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Testimonials", to: "/#testimonials" },
  { label: "FAQ", to: "/#faq" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 shadow-2xs">
            <Cat className="h-5 w-5 text-brand-600" />
          </span>

          <span>
            Purr<span className="text-brand-600">Connect</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-gray-600 transition hover:text-brand-600"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition shadow-2xs"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Portal</span>
            </Link>
          )}

          <Link
            to="/cats"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-xs"
          >
            Find a Cat
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 lg:hidden text-gray-700 hover:bg-gray-100 transition"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-4 lg:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-50 border border-brand-200 px-4 py-2.5 text-xs font-semibold text-brand-700"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                to="/cats"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
              >
                Find a Cat
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
