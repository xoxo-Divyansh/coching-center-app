import useAuth from "@/hooks/useAuth";
import { NAV_LINK } from "@/shared/navbar.config";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const STATIC_NAV = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const role = user?.role || "guest";
  const links = NAV_LINK[role] || NAV_LINK.guest;

  const renderLinks = (isMobile = false) =>
    links.map((item, i) => {
      if (item.action === "logout") {
        return (
          <button
            key={i}
            onClick={() => {
              logout();
              isMobile && setOpen(false);
            }}
            className={`
              ${isMobile ? "text-left text-red-400" : "px-4 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 hover:scale-105 transition-all"}
            `}
          >
            Logout
          </button>
        );
      }

      return (
        <Link
          key={i}
          to={item.to}
          onClick={() => isMobile && setOpen(false)}
          className={`
            ${
              isMobile
                ? ""
                : `px-4 py-2 rounded-lg transition-all hover:scale-105
                ${
                  item.type === "primary"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border border-purple-500 hover:bg-purple-500/10"
                }`
            }
          `}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide text-purple-500"
        >
          xoxo<span className="text-white">Academy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300">
          {STATIC_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-purple-400 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">{renderLinks()}</div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 
        ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col px-6 py-4 gap-4 bg-black/90 border-t border-zinc-800">
          {STATIC_NAV.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}

          <div className="h-px bg-zinc-700 my-2" />

          {renderLinks(true)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
