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
      <div className="flex gap-6 text-lg items-center">

        {/* Crear cuenta */}
        <Link 
          to="/register"
          className="underline"
        >
          Crear cuenta
        </Link>

        {/* Iniciar sesión */}
        <Link 
          to="/login"
          className="px-4 py-1 rounded-lg text-white transition"
          style={{ backgroundColor: "#366E18" }}
        >
          Iniciar sesión
        </Link>

      </div>

    </nav>
  );
}
