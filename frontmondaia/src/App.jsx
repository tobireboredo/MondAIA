import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Navbar from "./Navbar";
import Hero from "./Hero";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [count, setCount] = useState(0)

    return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
