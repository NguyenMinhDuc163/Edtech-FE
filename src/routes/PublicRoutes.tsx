import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Common/Home/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import SearchPage from "@/pages/Common/Search/search";
import ProfilePage from "@/pages/Common/Profile/profile";
import About from "@/pages/Common/About/About";
import NotFound from "@/pages/NotFound/components/NotFound";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="/about" element={<About />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
