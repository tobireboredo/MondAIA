import { Link } from "react-router-dom";
import logo_horizontal from "./assets/Group 1.png";
import flechaIcon from "./assets/flecha.png";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "./userContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between p-4 shadow-md relative">

      <Link to={user ? "/home" : "/"} className="inline-block">
        <img 
          src={logo_horizontal} 
          alt="logo" 
          className="w-32 hover:opacity-80 transition"
        />
      </Link>

      {user ? (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          
          <div className="w-10 h-10 bg-gray-400 rounded-full" />

          <span className="text-lg font-medium">{user.name || user.username}</span>

          <button onClick={() => setOpen(!open)}>
            <img 
              src={flechaIcon} 
              alt="menu" 
              className={`w-3 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute top-14 right-0 bg-white shadow-xl rounded-xl w-56 py-3 z-50">
    
              <div className="flex items-center gap-3 px-4 pb-3">
                <div className="w-12 h-12 bg-gray-400 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {user.name || user.username}
                  </div>
                  <div className="text-sm text-gray-600 -mt-1">
                    @{user.username}
                  </div>
                </div>
              </div>

              <div className="border-t my-2"></div>

              <Link 
                to="/configuracion" 
                className="block px-4 py-2 hover:bg-gray-100 transition rounded"
              >
                Configuración
              </Link>

              <Link 
                to="/usuario" 
                className="block px-4 py-2 hover:bg-gray-100 transition rounded"
              >
                Usuario
              </Link>

              <Link 
                to="/tareas-finalizadas" 
                className="block px-4 py-2 hover:bg-gray-100 transition rounded"
              >
                Tareas finalizadas
              </Link>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition rounded text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-6 text-lg items-center">
          <Link to="/register" className="underline">
            Crear cuenta
          </Link>

          <Link 
            to="/login"
            className="px-4 py-1 rounded-lg text-white transition"
            style={{ backgroundColor: "#366E18" }}
          >
            Iniciar sesión
          </Link>
        </div>
      )}
    </nav>
  );
}
