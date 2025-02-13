import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../context/ApiContext";

function PokemonDetails() {
  const { name } = useParams();
  const { fetchPokemonDetails, fetchUser, addPokemonToRoster } = useApi();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPokemonDetails = async () => {
      try {
        const data = await fetchPokemonDetails(name);
        setPokemon(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getPokemonDetails();
  }, [name, fetchPokemonDetails]);

  const handleAddPokemon = async () => {
    await addPokemonToRoster(name);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-info scale-150"></span>
      </div>
    );
  }

  if (!pokemon)
    return <div className="text-center p-6">Pokemon not found!</div>;

  return (
    <div className="max-w-4xl mx-auto px-16 pb-4 bg-white shadow-lg rounded-md text-black mb-40">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2 capitalize">
        {pokemon.name}
      </h1>
      <div className="flex justify-center mb-2">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-56 h-56 rounded-lg shadow-lg border-4 border-gray-200"
        />
      </div>
      <div className="text-base text-gray-700 mb-2">
        <p>
          <span className="font-semibold">Type:</span>{" "}
          {pokemon.types.map((type) => type.type.name).join(", ")}
        </p>
        <p>
          <span className="font-semibold">Abilities:</span>{" "}
          {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}
        </p>
        <p>
          <span className="font-semibold">Base Experience:</span>{" "}
          {pokemon.base_experience}
        </p>
        <p>
          <span className="font-semibold">Height:</span> {pokemon.height / 10} m
        </p>
        <p>
          <span className="font-semibold">Weight:</span> {pokemon.weight / 10}{" "}
          kg
        </p>
      </div>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-800">Base Stats</h3>
        <ul className="text-gray-700">
          {pokemon.stats.map((stat, index) => (
            <li key={index} className="flex justify-between border-b py-1">
              <span className="capitalize">{stat.stat.name}:</span>
              <span>{stat.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
          onClick={handleAddPokemon}
        >
          Add Pokémon
        </button>
      </div>
    </div>
  );
}

export default PokemonDetails;
