import React from "react";
import { Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";

const LogIn = () => {
  const { login, formData, setFormData } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData); // Pass formData to login function
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
