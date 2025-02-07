import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((response) => {
        setPokemonList(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-900">
          Pokemon List
        </h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {pokemonList.map((pokemon, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
          >
            <Link
              to={`/pokemon/${pokemon.name}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 capitalize"
            >
              {pokemon.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
