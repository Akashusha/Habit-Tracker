import { useState } from "react";
import axios from "axios";

function HabitSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/ai-suggestions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuggestions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching habit suggestions:", err);
      setError(
        err.response?.data || "Failed to fetch suggestions. Please try again."
      );
    }
  };

  return (
    <div className="habit-suggestions-container">
      <h2 className="habit-suggestions-heading">Habit Suggestions</h2>
      <button onClick={fetchSuggestions} className="habit-suggestions-button">
        Get Suggestions
      </button>
      {error && <p className="habit-suggestions-error">{error}</p>}
      <ul className="habit-suggestions-list">
        {suggestions.map((s, index) => (
          <li key={index} className="habit-suggestions-list-item">
            <p>{s.description.replace(/\*\*/g, "")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HabitSuggestions;
