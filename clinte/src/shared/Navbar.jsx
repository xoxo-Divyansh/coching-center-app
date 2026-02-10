import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-purple-500">
          xoxo<span className="text-white">Academy</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/courses" className="hover:text-white transition">Courses</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-purple-500 rounded-lg hover:bg-purple-500/10 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Join
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;