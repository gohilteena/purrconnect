import { Link } from "react-router-dom";
import { Cat, Instagram, Facebook, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <Cat className="h-6 w-6 text-brand-500" />
            PurrConnect
          </div>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Connecting people with their purrfect companion through a
            simpler and more thoughtful cat discovery experience.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Explore</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/cats" className="hover:text-white transition">
              Find Cats
            </Link>

            <Link to="/#breeds" className="hover:text-white transition">
              Popular Breeds
            </Link>

            <Link to="/#how-it-works" className="hover:text-white transition">
              How It Works
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Company</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/#testimonials" className="hover:text-white transition">
              Testimonials
            </Link>

            <Link to="/#faq" className="hover:text-white transition">
              FAQ
            </Link>

            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-400 transition pt-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Connect</h3>

          <div className="mt-4 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-lg bg-gray-800 p-2 hover:bg-gray-700 transition"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="rounded-lg bg-gray-800 p-2 hover:bg-gray-700 transition"
            >
              <Facebook className="h-5 w-5" />
            </a>

            <a
              href="mailto:hello@purrconnect.com"
              aria-label="Email"
              className="rounded-lg bg-gray-800 p-2 hover:bg-gray-700 transition"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} PurrConnect. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-gray-400 transition">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
