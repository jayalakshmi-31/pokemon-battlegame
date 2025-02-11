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

function App() {
  const [userImage, setUserImage] = useState(null);
  return (
    <Router>
      <Navbar userImage={userImage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
        <Route
          path="/signup"
          element={<SignUp setUserImage={setUserImage} />}
        />
        <Route path="/login" element={<LogIn setUserImage={setUserImage} />} />
        <Route path="/roster" element={<MyRoster />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
