import { useState } from "react";
import { createHabit } from "../services/api";
import PropTypes from "prop-types";

const HabitForm = ({ onHabitAdded }) => {
  const [formData, setFormData] = useState({
    habit_title: "",
    frequency: "daily",
    start_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHabit(formData);
      alert("Habit added successfully!");
      setFormData({ habit_title: "", frequency: "daily", start_date: "" });
      onHabitAdded(); // Refresh the habit list after adding
    } catch (err) {
      console.error("Error adding habit:", err);
      alert("Failed to add habit.");
    }
  };

  HabitForm.propTypes = {
    habits: PropTypes.array.isRequired, // or PropTypes.arrayOf(PropTypes.object)
    onHabitAdded: PropTypes.func.isRequired,
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <h2>Add a New Habit</h2>
      <div className="form-group">
        <label>Habit Title:</label>
        <input
          type="text"
          value={formData.habit_title}
          onChange={(e) =>
            setFormData({ ...formData, habit_title: e.target.value })
          }
          placeholder="Enter habit title"
          required
        />
      </div>
      <div className="form-group">
        <label>Frequency:</label>
        <select
          value={formData.frequency}
          onChange={(e) =>
            setFormData({ ...formData, frequency: e.target.value })
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="form-group">
        <label>Start Date:</label>
        <input
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
          required
        />
      </div>
      <button type="submit" className="btn">
        Add Habit
      </button>
    </form>
  );
};

export default HabitForm;
