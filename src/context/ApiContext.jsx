import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [homepagePokemonList, setHomepagePokemonList] = useState([]); // For the homepage
  const [userPokemonList, setUserPokemonList] = useState([]); // For the user's roster
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "" }); // Initialize formData
  const navigate = useNavigate();

  // Fetch the first 20 Pokémon for the homepage
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then(async (response) => {
        const details = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return pokemonDetails.data;
          })
        );
        setHomepagePokemonList(details);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:8080/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);

      // Fetch Pokémon details for the user's roster
      const pokemonData = await Promise.all(
        response.data.roster.map(async (name) => {
          const pokemonDetails = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${name}`
          );
          return pokemonDetails.data;
        })
      );
      setUserPokemonList(pokemonData);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user.");
    }
  };

  const fetchLeaders = async () => {
    try {

      const response = await axios.get("http://localhost:8080/leaders", {
        
      });
      setLeaders(response.data);
    } catch (error) {
      console.error("Error fetching leaders:", error);
      toast.error("Failed to fetch leaders.");
    }
  };


  // Fetch Pokémon details by name
  const fetchPokemonDetails = async (name) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      throw error;
    }
  };

  const updateScore = async () => {
    try {
      await axios.post("http://localhost:8080/leaders", { score: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error("Failed to update score.");
    }
  };


  // Add a Pokémon to the user's roster
  const addPokemonToRoster = async (name) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(
          "You need to be logged in to add a Pokémon to your roster."
        );
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
        const pokemonDetails = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        setUserPokemonList((prevList) => [...prevList, pokemonDetails.data]);
        toast.success(`${name} added to your roster!`);
      }
    } catch (error) {
      console.error("Error adding Pokémon:", error);
      toast.error("Pokemon already in your roster!");
    }
  };

  const fetchComputerPokemon = async (count) => {
    if (count === 0) return;
    try {
      const computerPokemonData = await Promise.all(
        Array.from({ length: count }, async () => {
          const randomId = Math.floor(Math.random() * 898) + 1;
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
          return {
            id: response.data.id,
            name: response.data.name,
            image: response.data.sprites.front_default,
            attack: response.data.stats.find((s) => s.stat.name === "attack").base_stat,
            defense: response.data.stats.find((s) => s.stat.name === "defense").base_stat,
          };
        })
      );
      return computerPokemonData;
    } catch (error) {
      console.error("Error fetching computer Pokémon:", error);
    }
  };

  

  // Remove a Pokémon from the user's roster
  const removePokemonFromRoster = async (pokemonName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(
          "You need to be logged in to remove a Pokémon from your roster."
        );
        return;
      }

      await axios.delete(`http://localhost:8080/users/roster/${pokemonName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserPokemonList((prevList) =>
        prevList.filter((p) => p.name !== pokemonName)
      );
      toast.success(`${pokemonName} removed successfully!`);
    } catch (error) {
      console.error("Error removing Pokémon:", error);
      toast.error("Failed to remove Pokémon.");
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        userData
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username); // Save username
        localStorage.setItem("image", response.data.image); // Save user image
        setUser({
          username: response.data.username,
          email: response.data.email,
          image: response.data.image,
        });
        toast.success("Registration successful!");
        updateScore();
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register.");
    }
  };

  // Log in a user
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        credentials
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username); // Save username
        localStorage.setItem("image", response.data.image); // Save user image
        setUser({
          username: response.data.username,
          email: response.data.email,
          image: response.data.image,
        });
        toast.success("Login successful!");
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to log in.");
    }
  };

  return (
    <ApiContext.Provider
      value={{
        homepagePokemonList, // For the homepage
        userPokemonList, // For the user's roster
        loading,
        error,
        user,
        setUser, // Add setUser to the context value
        formData, // Add formData to the context value
        setFormData, // Add setFormData to the context value
        fetchUser,
        fetchPokemonDetails, // Add this line
        addPokemonToRoster, // Add this line
        removePokemonFromRoster,
        register,
        login,
        leaders,
        fetchLeaders,
        fetchComputerPokemon,
        updateScore
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
