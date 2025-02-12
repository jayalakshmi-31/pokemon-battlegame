import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then(async (response) => {
        const pokemonDetails = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: res.data.sprites.front_default,
              types: res.data.types.map((t) => t.type.name).join(", "),
              abilities: res.data.abilities
                .map((a) => a.ability.name)
                .join(", "),
              hp: res.data.stats[0].base_stat,
              attack: res.data.stats[1].base_stat,
              defense: res.data.stats[2].base_stat,
            };
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
        <span className="loading loading-spinner loading-lg text-info scale-150"></span>
      </div>
    );
  }

  return (
    <div className="skeleton p-6 bg-gray-100 min-h-screen text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {pokemonList.map((pokemon, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 mb-4"
            />
            <h2 className="text-xl font-bold uppercase mb-2">{pokemon.name}</h2>
            <p className="text-gray-600">Type: {pokemon.types}</p>
            <p className="text-gray-600">Abilities: {pokemon.abilities}</p>

            <Link
              to={`/pokemon/${pokemon.name}`}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
