from flask import Flask, request, jsonify
from flask_cors import CORS
import requests 

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5000"}})

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
GEMINI_API_KEY = "AIzaSyCmSsT3OtLW_w6ea-JU6v8BekSe_61kB0s"  

def fetch_gemini_suggestions(prompt):
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        response_data = response.json()
        print("Gemini API Response:", response_data) 
        return response_data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return {"error": "Failed to fetch suggestions from Gemini API."}

@app.route('/generate-habit-suggestions', methods=['POST'])
def generate_habit_suggestions():
    data = request.json
    user_habits = data.get("habits", [])
    prompt = f"I have been following these habits: {', '.join(user_habits)}. Based on these habits, suggest 3 new habits that complement and enhance my current routine. Ensure the suggestions are actionable and tailored to my current habits. in short"


    gemini_response = fetch_gemini_suggestions(prompt)
    if "error" in gemini_response:
        return jsonify(gemini_response), 500  

    # Extract and format the suggestions
    try:
        candidates = gemini_response.get("candidates", [])
        if not candidates:
            return jsonify({"error": "No suggestions found from the Gemini API."}), 500

        # Extract the text content of suggestions
        raw_suggestions = candidates[0].get("content", {}).get("parts", [])
        formatted_suggestions = [
            {"title": f"Habit {i+1}", "description": suggestion["text"]}
            for i, suggestion in enumerate(raw_suggestions)
        ]

        return jsonify(formatted_suggestions)
    except KeyError as e:
        print(f"Error parsing Gemini API response: {e}")
        return jsonify({"error": "Error parsing Gemini API response."}), 500

if __name__ == '__main__':
    app.run(debug=True)
