import { Link } from "react-router-dom";
import logo_horizontal from "./assets/Group 1.png";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 shadow-md">
      
      {/* Logo */}
      <Link to="/" className="inline-block">
        <img 
          src={logo_horizontal} 
          alt="logo" 
          className="w-32 hover:opacity-80 transition"
        />
      </Link>

      {/* Links */}
      <div className="flex gap-6 text-lg">
        <Link to="/" className="hover:text-blue-500 transition">Home</Link>
        <Link to="/about" className="hover:text-blue-500 transition">About</Link>
        <Link to="/contact" className="hover:text-blue-500 transition">Contact</Link>
      </div>

    </nav>
  );
}
