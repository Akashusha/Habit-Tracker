import { useEffect, useState } from "react";
import { fetchHabits } from "../services/api";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import HabitSuggestions from "./HabitSuggestions";

const Dashboard = () => {
  const [habits, setHabits] = useState([]); // Holds all user habits

  const loadHabits = async () => {
    try {
      const { data } = await fetchHabits(); // Fetch habits from backend
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch habits", err);
    }
  };

  useEffect(() => {
    loadHabits(); // Load habits when the component mounts
  }, []);

  return (
    <div>
      <h1>Habit Tracker</h1>
      {/* Pass `loadHabits` to refresh habits when a new one is added */}
      <HabitForm onHabitAdded={loadHabits} />

      {/* Pass habits and `loadHabits` to update list */}
      <HabitList habits={habits} onHabitsUpdated={loadHabits} />

      <HabitSuggestions />
    </div>
  );
};

export default Dashboard;
