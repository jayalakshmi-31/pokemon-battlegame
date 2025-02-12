import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=100")
      .then(async (response) => {
        const pokemonDetails = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return { ...pokemon, image: res.data.sprites.front_default };
          })
        );
        setPokemonList(pokemonDetails);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {pokemonList.map((pokemon, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 mb-3"
            />
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
