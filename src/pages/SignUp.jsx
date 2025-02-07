import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        formData
      );
      localStorage.setItem("token", response.data.token);
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
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full mb-4"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
