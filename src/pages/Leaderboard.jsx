import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LeaderBoard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/leaders");
        setLeaders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-16 p-10 bg-white shadow-lg rounded-lg my-40">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <table className="w-full border-collapse border border-gray-300 text-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-6 py-4">#</th>
            <th className="border border-gray-400 px-6 py-4">Username</th>
            <th className="border border-gray-400 px-6 py-4">Score</th>
            <th className="border border-gray-400 px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader._id} className="text-center">
              <td className="border border-gray-400 px-6 py-4">{index + 1}</td>
              <td className="border border-gray-400 px-6 py-4">{leader.username}</td>
              <td className="border border-gray-400 px-6 py-4 font-semibold">{leader.score}</td>
              <td className="border border-gray-400 px-6 py-4">
                {new Date(leader.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;
