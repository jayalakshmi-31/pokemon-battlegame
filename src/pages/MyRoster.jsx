import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../context/ApiContext"; 

function MyRoster() {
  const {
    user,
    userPokemonList,
    loading,
    fetchUser,
    removePokemonFromRoster,
  } = useApi();

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleRemovePokemon = async (pokemonName) => {
    try {
      await removePokemonFromRoster(pokemonName);
    } catch (error) {
      console.error("Error removing Pokémon:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-info scale-150"></span>
      </div>
    );
  }

  return (
    <div className="skeleton bg-gray-100 p-6 flex flex-col items-center pb-44">
      <h1 className="text-3xl font-bold mb-2">My Pokémons</h1>
      <h2 className="mb-6">My Score: {user?.score}</h2>
      <button className="btn btn-primary mb-2 mb-4"
      onClick={() => navigate("/battle")}
      >Go to Battle</button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
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
                e.stopPropagation();
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
