import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function PokemonDetails() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => {
        setPokemon(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [name]);

  const handleAddPokemon = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add a Pokémon!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/users/roster/${name}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Pokémon added to your roster!");
      }
    } catch (error) {
      console.error("Error adding Pokémon:", error);
      toast.error( "Pokemon already in your roster!");
    }
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md text-black mb-32">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 capitalize">
        {pokemon.name}
      </h1>
      <div className="flex justify-center mb-6">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-56 h-56 rounded-lg shadow-lg border-4 border-gray-200"
        />
      </div>
      <div className="text-lg text-gray-700 mb-4">
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
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Base Stats</h3>
        <ul className="text-gray-700">
          {pokemon.stats.map((stat, index) => (
            <li key={index} className="flex justify-between border-b py-2">
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
