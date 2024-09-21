# chat.py
import os
import openai

# Load your OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_ai_response(user_message):
    # Function to get AI response using OpenAI API
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the desired model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ],
            max_tokens=150,
            temperature=0.7,
        )
        ai_reply = response.choices[0].message['content'].strip()
        return ai_reply
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return "Sorry, I'm unable to process your request at the moment."
