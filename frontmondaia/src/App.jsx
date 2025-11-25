import { useState } from 'react'
import Hero from './Hero'
import { Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
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
  )
}

export default App
