import React, { useState } from 'react';
import logo_grande from "./assets/MondAIA_logo1.png";

const Register = () => {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password.trim() || !nombre.trim()) {
        alert("Todos los campos son obligatorios");
        return;
      }
      
    try {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usuario,   // 👈 así lo espera tu backend
          password: password,
          name: nombre       // 👈 usa tu estado real
        })
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      alert("Cuenta creada con éxito!");

    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrarse");
    }
  };

  return (
    <div className='text-center mt-4'>
      <img 
        src={logo_grande} 
        alt="logo_horizontal" 
        className="mx-auto mt-4 w-52"
      />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">

        {/* Nombre */}
        <label className="text-lg mb-1">Nombre:</label>
        <input 
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-64"
          placeholder="Nombre..."
        />

        {/* Usuario */}
        <label className="text-lg mt-4 mb-1">Usuario:</label>
        <input 
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-64"
          placeholder="Usuario..."
        />

        {/* Contraseña */}
        <label className="text-lg mt-4 mb-1">Contraseña:</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-64"
          placeholder="Contraseña..."
        />

        <button 
          type="submit"
          className="mt-6 btn-green text-white px-4 py-2 rounded-lg"
        >
          Crear cuenta
        </button>

      </form>
    </div>
  );
}

export default Register;
