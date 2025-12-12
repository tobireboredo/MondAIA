import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import TareasFinalizadas from "./TareasFinalizadas";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tareas-finalizadas" element={<TareasFinalizadas />} />
      </Routes>
    </>
  );
}

export default App;
