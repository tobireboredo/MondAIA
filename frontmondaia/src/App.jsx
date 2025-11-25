import { useState } from 'react'
import Hero from './Hero'
import { Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />

    <Routes>
      <Route path="/" element={<Hero />} />
    </Routes>
    </>
  )
}

export default App
