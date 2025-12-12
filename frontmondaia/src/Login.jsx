import React, { useState, useContext } from "react";
import logo_grande from "./assets/MondAIA_logo1.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext.jsx";

const Login = () => {

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usuario.trim() || !password.trim()) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/login/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          username: usuario,
          password: password
        })
      });

      const data = await response.json();
      console.log("Login:", data);

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        localStorage.setItem("userId", data.id);

        setUser({
          id: data.id,
          username: data.username,
          name: data.name,
        });
      
        alert("Inicio de sesión exitoso");

        navigate("/home");
      } else {
        alert(data.detail || "Credenciales incorrectas");
      }

    } catch (error) {
      console.error("Error de login:", error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="text-center mt-4">

      <img
        src={logo_grande}
        alt="logo"
        className="mx-auto mt-4 w-52"
      />

      <form onSubmit={handleLogin} className="mt-6 flex flex-col items-center">

        <label className="text-lg mb-1">Usuario:</label>
        <input
          type="text"
          className="border border-gray-400 rounded px-3 py-2 w-64"
          placeholder="Usuario..."
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <label className="text-lg mb-1 mt-4">Contraseña:</label>
        <input
          type="password"
          className="border border-gray-400 rounded px-3 py-2 w-64"
          placeholder="Contraseña..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="mt-6 bg-[#366E18] text-white px-4 py-2 rounded-lg hover:bg-[#2B5514] transition"
        >
          Iniciar sesión
        </button>

      </form>

    </div>
  );
};

export default Login;
