import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const hideLoginButton =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 px-16">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Pokemon Battle
        </Link>
      </div>
      <div className="flex-none">
        {token ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/roster">Roaster</Link>
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
        ) : (
          !hideLoginButton && (
            <button
              className="btn btn-primary text-slate-200"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Navbar;
