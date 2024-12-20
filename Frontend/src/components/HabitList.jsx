import PropTypes from "prop-types";

import { deleteHabit, updateHabit } from "../services/api";

const HabitList = ({ habits, onHabitsUpdated }) => {
  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      alert("Habit deleted successfully!");
      onHabitsUpdated(); // Notify the parent component to refresh the habit list
    } catch (err) {
      console.error("Error deleting habit:", err);
      alert("Failed to delete habit.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateHabit(id, { status: newStatus });
      alert("Habit status updated!");
      onHabitsUpdated(); // Notify the parent component to refresh the habit list
    } catch (err) {
      console.error("Error updating habit status:", err);
      alert("Failed to update status.");
    }
  };

  HabitList.propTypes = {
    habits: PropTypes.array.isRequired, // or PropTypes.arrayOf(PropTypes.object)
    onHabitsUpdated: PropTypes.func.isRequired,
  };

  return (
    <div className="habit-list-container">
      <h2>Your Habits</h2>
      {habits.length === 0 ? (
        <p>No habits to display. Start by adding a new habit!</p>
      ) : (
        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.id} className="habit-item">
              <div className="habit-info">
                <strong>{habit.habit_title}</strong>
                <p>Frequency: {habit.frequency}</p>
                <p>
                  Status:{" "}
                  <span className={`status ${habit.status.toLowerCase()}`}>
                    {habit.status}
                  </span>
                </p>
              </div>
              <div className="habit-actions">
                <button
                  className="btn"
                  onClick={() =>
                    handleStatusChange(
                      habit.id,
                      habit.status === "Active" ? "Completed" : "Active"
                    )
                  }
                >
                  {habit.status === "Active" ? "Mark Completed" : "Activate"}
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(habit.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HabitList;
