import requests
from flask import Flask, render_template, request, jsonify, send_file
from gtts import gTTS
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

TOGETHER_AI_API_KEY = "47b68676c82ce8d752214132a8e7e70a424d2edfc148b0e1cd06f1b4ec429e2c"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_script', methods=['POST'])
def generate_script():
    try:
        data = request.get_json()

        prompt = f"""
        Generate a {data['length']} {data['contentType']} for topic "{data['topic']}".
        Tone: {data['tone']}, Mood: {data['mood']}, Language: {data['language']}, 
        Target Audience: {data['audience']}, Character Style: {data['characterStyle']}, 
        Voice Type: {data['voiceType']}, Creative Enhancer: {data['creativity']}.
        """

        response = requests.post(
            "https://api.together.xyz/v1/completions",
            headers={"Authorization": f"Bearer {TOGETHER_AI_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "deepseek-ai/DeepSeek-V3",
                "prompt": prompt,
                "max_tokens": 800,
                "temperature": 0.8
            }
        )

        result = response.json()

        if "choices" in result and result["choices"]:
            script = result["choices"][0].get("text", "Error: No text in response.")
            return jsonify({'script': script})
        else:
            return jsonify({'error': f"Invalid API response: {result}"})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        script_text = data.get("text", "").strip()

        if not script_text:
            return jsonify({'error': "No text provided for speech conversion."}), 400

        # Convert text to speech using gTTS
        tts = gTTS(script_text, lang="en")
        audio_file_path = "static/generated_audio.mp3"
        tts.save(audio_file_path)

        return jsonify({"audio_url": f"/{audio_file_path}"})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
