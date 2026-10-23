import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./components/layouts/PublicLayout.jsx";
import Home from "./pages/Home.jsx";
import Cats from "./pages/Cats.jsx";
import CatDetails from "./pages/CatDetails.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin Pages and Layout
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCats from "./pages/admin/AdminCats.jsx";
import AdminCatCreate from "./pages/admin/AdminCatCreate.jsx";
import AdminCatEdit from "./pages/admin/AdminCatEdit.jsx";
import AdminEnquiries from "./pages/admin/AdminEnquiries.jsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Admin Login Route (Unprotected, standalone layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="cats" element={<AdminCats />} />
          <Route path="cats/new" element={<AdminCatCreate />} />
          <Route path="cats/:id/edit" element={<AdminCatEdit />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
        </Route>
      </Route>

      {/* Public Pages with Standard Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cats" element={<Cats />} />
        <Route path="/cats/:slug" element={<CatDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
