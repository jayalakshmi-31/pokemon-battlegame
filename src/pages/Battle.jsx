import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";

function BattlePage() {
  const [computerPokemon, setComputerPokemon] = useState([]);
  const [battleLog, setBattleLog] = useState([]);
  const [winner, setWinner] = useState(null);
  const [battleStage, setBattleStage] = useState("setup");

  const {
    userPokemonList,
    fetchUser,
    fetchComputerPokemon,
    updateScore,
    loading,
  } = useApi();

  useEffect(() => {
    fetchUser();
  }, []);

  const startBattle = () => {
    setBattleStage("battle");
    setTimeout(() => {
      let userWins = 0;
      let computerWins = 0;
      let log = [];

      userPokemonList.forEach((userPoke, index) => {
        const computerPoke = computerPokemon[index];
        const userScore =
          userPoke.stats[1].base_stat + userPoke.stats[2].base_stat;
        const computerScore = computerPoke.attack + computerPoke.defense;

        if (userScore > computerScore) {
          userWins++;
          log.push(`${userPoke.name} defeated ${computerPoke.name}!`);
        } else if (computerScore > userScore) {
          computerWins++;
          log.push(`${computerPoke.name} defeated ${userPoke.name}!`);
        } else {
          log.push(`${userPoke.name} and ${computerPoke.name} tied!`);
        }
      });

      setBattleLog(log);
      const battleWinner =
        userWins > computerWins
          ? "You win!"
          : computerWins > userWins
          ? "Computer wins!"
          : "It's a tie!";
      setWinner(battleWinner);
      setBattleStage("result");

      if (battleWinner === "You win!") {
        updateScore();
      }
    }, 2000);
  };

  const resetGame = () => {
    setBattleStage("setup");
    setComputerPokemon([]);
    setBattleLog([]);
    setWinner(null);
  };

  useEffect(() => {
    if (computerPokemon.length === 0) {
      const getComputerPokemon = async () => {
        const data = await fetchComputerPokemon(userPokemonList.length);
        setComputerPokemon(data);
      };
      getComputerPokemon();
    }
  }, [battleStage, userPokemonList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-info scale-150"></span>
      </div>
    );
  }

  if (userPokemonList.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-semibold text-center">
          You need to have at least one Pokémon in your roster to start a battle.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Battle Arena</h1>
      {battleStage === "setup" && (
        <>
          <button className="btn btn-primary mb-4" onClick={startBattle}>
            Start Battle
          </button>
          <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            <div>
              <h2 className="text-xl font-bold">Your Pokémons</h2>
              {userPokemonList?.map((poke) => (
                <div
                  key={poke.id}
                  className="flex items-center gap-4 border p-2"
                >
                  <img
                    src={poke.sprites.front_default}
                    alt={poke.name}
                    className="w-16 h-16"
                  />
                  <span>
                    {poke.name} (Atk: {poke.stats[1].base_stat}, Def:{" "}
                    {poke.stats[2].base_stat})
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Computer Pokémons</h2>
              {computerPokemon.map((poke) => (
                <div
                  key={poke.id}
                  className="flex items-center gap-4 border p-2"
                >
                  <img src={poke.image} alt={poke.name} className="w-16 h-16" />
                  <span>
                    {poke.name} (Atk: {poke.attack}, Def: {poke.defense})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {battleStage === "battle" && (
        <h2 className="text-2xl font-semibold mt-40">
          The battle is happening now...
        </h2>
      )}
      {battleStage === "result" && (
        <div className="card text-center">
          <h2 className="text-2xl font-semibold">{winner}</h2>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Battle Log</h2>
            <ul className="list-disc pl-6 text-left py-4">
              {battleLog.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
            <button className="btn btn-primary mt-4" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BattlePage;
