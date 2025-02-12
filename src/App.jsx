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
  const [userImage, setUserImage] = useState(
    JSON.parse(localStorage.getItem("image")) || null
  );
  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem("username")) || null
  );
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar userImage={userImage} username={username} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
          <Route
            path="/signup"
            element={
              <SignUp setUserImage={setUserImage} setUsername={setUsername} />
            }
          />
          <Route
            path="/login"
            element={
              <LogIn setUserImage={setUserImage} setUsername={setUsername} />
            }
          />
          <Route path="/roster" element={<MyRoster />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
