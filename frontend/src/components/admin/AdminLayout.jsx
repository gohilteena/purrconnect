import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Cat,
  LayoutDashboard,
  PlusCircle,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  {
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Cats",
    to: "/admin/cats",
    icon: Cat,
  },
  {
    name: "Add Cat",
    to: "/admin/cats/new",
    icon: PlusCircle,
  },
  {
    name: "Enquiries",
    to: "/admin/enquiries",
    icon: MessageSquare,
  },
  {
    name: "Testimonials",
    to: "/admin/testimonials",
    icon: Star,
  },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/dashboard")) return "Dashboard Overview";
    if (path === "/admin/cats/new") return "Add New Cat";
    if (path.includes("/admin/cats/") && path.endsWith("/edit")) return "Edit Cat";
    if (path.startsWith("/admin/cats")) return "Cat Catalog Management";
    if (path.startsWith("/admin/enquiries")) return "Adoption Enquiries";
    if (path.startsWith("/admin/testimonials")) return "Client Testimonials";
    return "Admin Portal";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row text-gray-900">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Desktop (fixed/sticky) and Mobile (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 font-bold text-lg text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Cat className="h-5 w-5" />
              </span>
              <div>
                Purr<span className="text-brand-600">Connect</span>
                <span className="ml-1.5 inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                  Admin
                </span>
              </div>
            </Link>

            <button
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  end={item.to === "/admin/cats" || item.to === "/admin/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-50 text-brand-700 font-semibold shadow-xs"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Admin profile & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-3 bg-white border border-gray-200/60 shadow-xs">
            <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || "Administrator"}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email || "admin@purrconnect.com"}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-xs transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Live Website</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Site</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
