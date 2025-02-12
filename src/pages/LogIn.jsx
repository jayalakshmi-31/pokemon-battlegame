import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LogIn = ({ setUserImage, setUsername }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", JSON.stringify(response.data.username));
      localStorage.setItem("image", JSON.stringify(response.data.image));
      setUserImage(response.data.image);
      setUsername(response.data.username);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="card w-96 bg-base-200 shadow-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-4"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-800">
            Sign up
          </Link>{" "}
          here!{" "}
        </p>
      </form>
    </div>
  );
};

export default LogIn;
