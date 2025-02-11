import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
        alert("Pokémon added to your roster!");
      }
    } catch (error) {
      console.error("Error adding Pokémon:", error);
      alert("Failed to add Pokémon to your roster.");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!pokemon)
    return <div className="text-center p-6">Pokemon not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
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
      </div>
      <div className="text-center">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
        onClick={handleAddPokemon}
        >
          Add Pokemon
        </button>
      </div>
    </div>
  );
}

export default PokemonDetails;
