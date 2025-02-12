import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function MyRoster() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await axios.get("http://localhost:8080/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user.");
      }
    };

    fetchUser();
  }, [pokemonList]);

  useEffect(() => {
    if (!user) return;

    const fetchPokemonDetails = async () => {
      try {
        const pokemonData = await Promise.all(
          user.roster.map(async (id) => {
            const response = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            return {
              id: response.data.id,
              name: response.data.name,
              image: response.data.sprites.front_default,
              type: response.data.types.map((t) => t.type.name).join(", "),
              abilities: response.data.abilities
                .map((a) => a.ability.name)
                .join(", "),
              stats: {
                hp: response.data.stats.find((s) => s.stat.name === "hp")
                  .base_stat,
                attack: response.data.stats.find(
                  (s) => s.stat.name === "attack"
                ).base_stat,
                defense: response.data.stats.find(
                  (s) => s.stat.name === "defense"
                ).base_stat,
              },
            };
          })
        );

        setPokemonList(pokemonData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        toast.error("Failed to fetch Pokémon details.");
      }
    };

    fetchPokemonDetails();
  }, [user]);

  const handleRemovePokemon = async (pokemonName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }
  
      await axios.delete(`http://localhost:8080/users/roster/${pokemonName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPokemonList((prevList) => prevList.filter((p) => p.name !== pokemonName));
  
      toast.success(`${pokemonName} removed successfully!`);
    } catch (error) {
      console.error("Error removing Pokémon:", error);
      toast.error("Failed to remove Pokémon.");
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
    <div className="skeleton bg-gray-100 p-6 flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-2">My Pokémons</h1>
      <h2 className="mb-6">my score {user.score}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-32">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition duration-300 py-2"
            
          >
            
            <div className="card-body py-2 items-center text-center"
            onClick={() => navigate(`/pokemon/${pokemon.name}`)}
            >
              <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto"
            />
              <h2 className="card-title text-xl font-semibold">
                {pokemon.name.toUpperCase()}
              </h2>
              <p className="text-gray-600">Type: {pokemon.type}</p>
              <p className="text-gray-600">Abilities: {pokemon.abilities}</p>
              <div className="">
                <p>❤️ HP: {pokemon.stats.hp}</p>
                <p>⚔️ Attack: {pokemon.stats.attack}</p>
                <p>🛡️ Defense: {pokemon.stats.defense}</p>
              </div>
              
            </div>
            <button 
                className="btn btn-outline btn-error w-24 mx-auto mb-2"
                onClick={() => handleRemovePokemon(pokemon.name)}
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
