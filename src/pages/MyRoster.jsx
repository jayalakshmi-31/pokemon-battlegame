import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      }
    };

    fetchUser();
  }, []);

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
      }
    };

    fetchPokemonDetails();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-info scale-150"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">My Pokémons</h1>
      <h2 className="mb-6">my score {user.score}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white p-4 rounded-2xl shadow-md text-center"
            onClick={() => navigate(`/pokemon/${pokemon.name}`)}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-2">
              {pokemon.name.toUpperCase()}
            </h2>
            <p className="text-gray-600">Type: {pokemon.type}</p>
            <p className="text-gray-600">Abilities: {pokemon.abilities}</p>
            <div className="mt-3">
              <p>❤️ HP: {pokemon.stats.hp}</p>
              <p>⚔️ Attack: {pokemon.stats.attack}</p>
              <p>🛡️ Defense: {pokemon.stats.defense}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRoster;
