import { Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";

function Home() {
  const { homepagePokemonList, loading } = useApi();

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
        {homepagePokemonList.map((pokemon, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center"
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-24 h-24 mb-4"
            />
            <h2 className="text-xl font-bold uppercase mb-2">{pokemon.name}</h2>
            <p className="text-gray-600">
              Type: {pokemon.types.map((type) => type.type.name).join(", ")}
            </p>
            <p className="text-gray-600">
              Abilities:{" "}
              {pokemon.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>

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
