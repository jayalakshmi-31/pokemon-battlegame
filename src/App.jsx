import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetails from "./pages/PokemonDetails";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useState } from "react";
import MyRoster from "./pages/MyRoster";
import Leaderboard from "./pages/Leaderboard";
import { ApiProvider } from "./context/ApiContext";

function App() {
  return (
    <Router>
      <ApiProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:name" element={<PokemonDetails />} />
            <Route path="/signup" element={<SignUp s />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/roster" element={<MyRoster />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
          <Footer />
        </div>
      </ApiProvider>
    </Router>
  );
}

export default App;
