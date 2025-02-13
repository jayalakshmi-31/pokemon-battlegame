import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../context/ApiContext"; // Import the useApi hook

function MyRoster() {
  const {
    user,
    userPokemonList, // Destructure the Pokémon list for the user's roster
    loading, // Destructure the loading state
    fetchUser, // Destructure the fetchUser function
    removePokemonFromRoster, // Destructure the removePokemonFromRoster function
  } = useApi();

  const navigate = useNavigate();

  // Fetch user data when the component mounts or when the roster changes
  useEffect(() => {
    fetchUser();
  }, []);

  // Handle removing a Pokémon from the roster
  const handleRemovePokemon = async (pokemonName) => {
    try {
      await removePokemonFromRoster(pokemonName); // Use the context function
    } catch (error) {
      console.error("Error removing Pokémon:", error);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-info scale-150"></span>
      </div>
    );
  }

  return (
    <div className="skeleton bg-gray-100 p-6 flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-2">My Pokémons</h1>
      <h2 className="mb-6">My Score: {user?.score}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-32">
        {userPokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition duration-300 py-2"
          >
            <div
              className="card-body py-2 items-center text-center"
              onClick={() => navigate(`/pokemon/${pokemon.name}`)}
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-32 h-32 mx-auto"
              />
              <h2 className="card-title text-xl font-semibold">
                {pokemon.name.toUpperCase()}
              </h2>
              <p className="text-gray-600">
                Type: {pokemon.types.map((type) => type.type.name).join(", ")}
              </p>
              <p className="text-gray-600">
                Abilities:{" "}
                {pokemon.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}
              </p>
              <div className="">
                <p>❤️ HP: {pokemon.stats[0].base_stat || "N/A"}</p>
                <p>⚔️ Attack: {pokemon.stats[1].base_stat || "N/A"}</p>
                <p>🛡️ Defense: {pokemon.stats[2].base_stat || "N/A"}</p>
              </div>
            </div>
            <button
              className="btn btn-outline btn-error w-24 mx-auto mb-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                handleRemovePokemon(pokemon.name);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRoster;
