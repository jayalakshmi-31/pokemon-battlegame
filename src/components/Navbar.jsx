import React, { useState, useEffect, useContext, use } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApi } from "../context/ApiContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useApi();

  const [imageLoaded, setImageLoaded] = useState(false);

  const hideLoginButton =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("image");
    setUser(null); // Update user state
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const image = localStorage.getItem("image");
      setUser({ token, username, image });
    }
  }, []);

  return (
    <div className="navbar bg-base-100 px-16">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Pokemon Battle
        </Link>
      </div>
      {user && (
        <div className="flex-none flex items-center gap-4">
          {user.username && (
            <span className="text-lg font-medium">{user.username}</span>
          )}

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 h-10 rounded-full relative">
                {!imageLoaded && (
                  <div className="skeleton w-10 h-10 rounded-full absolute bg-gray-300 animate-pulse"></div>
                )}
                <img
                  alt="User Avatar"
                  src={
                    user.image ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  className={`w-10 h-10 rounded-full ${
                    !imageLoaded ? "hidden" : "block"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/roster">Roster</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      {!user && !hideLoginButton && (
        <button
          className="btn btn-primary text-slate-200"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Navbar;
