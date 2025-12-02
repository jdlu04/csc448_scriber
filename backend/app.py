from dotenv import load_dotenv 
import json
from openai import OpenAI
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

upload_folder = "uploads"

# returns a string of the transcript of the audio using the whisper model
# input: string of the audio file
# outputs: a string of the transcribed conversation
def transcribe_audio(audio_file_path):
    try: 
        with open(audio_file_path, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        return transcript
    except Exception as e:
        raise Exception(f"Transcription error: {str(e)}")

# using the transcript from transcribe_audio, use gpt to return a JSON of the structured doctor's notes
# input: string of the transcript 
# output: JSON formatted text   
# user_prompt: prompts the data to return as an array while all the other fields are strings 
def extract_data(transcript):
    system_prompt = """ 
    You are a medical documentation assistant. Extract structured information from doctor-patient conversation transcripts.

    Return a JSON object with these fields: 
    - transcript: Structured dialouge between the patient and the doctor (i.e. Doctor: "...", Patient: "...", Doctor: "..." )
    - chief_complaint: Brief sentence of main reason for visit (i.e. Chest pain, decreased appetite, shortness of breath.) 
    - history_of_present_illness: Brief sentence of patient's age, sex and reason for the visit (i.e. 47-year old female presenting with abdominal pain.)
    - onset: When did the chief complaint begin?
    - location: where is the chief complaint located?
    - duration: How long has the chief complaint been going on for?
    - characterization: How does the patient describe the chief complaint?
    - alleviating_aggravating_factors: What makes the chief complaint better? Worse?
    - radiation: Does the chief complaint move or stay in one location?
    - temporal_factor: is the chief complaint worse (or better) at a certain time of the day? 
    - severity: using a scale of 1 to 10, 1 being the least, 10 being the worst, how does the patient rate the chief complaint? 
    - history: brief description of medical, surgical, family, or social history 
    - medications_allergies: list medications currently taken and any allergies
    - vital_signs: objective data from the patient encounter about their vital signs mentioned by the doctor
    - physical_exam: objective data from the patient encounter about their physical exam results mentioned by the doctor
    - laboratory: objective data from the patient encounter about their lab results mentioned by the doctor
    - imaging_results: objective data from the patient encounter about their imaging results mentioned by the doctor
    - other_diagnostic_data: objective data from the patient encounter about their other diagnostic data results mentioned by the doctor
    - review: Recognition and review of the documentation of other clinicians.
    - assessment: description of problems and differential dignosis (i.e.  Problem 1, Differential Diagnoses, Discussion, Plan for problem 1 (described in the plan below). Repeat for additional problems)
    - plan: details the need for additional testing and consultation with other clinicians to address the patient's illnesses. It also addresses any additional steps being taken to treat the patient. This section helps future physicians understand what needs to be done next.
    

    Keep in mind:
    - not all fields and information in the JSON format will be mentioned in the transcript, if a field is not mentioned write, "Not specified" in the field.
    - Keep all information all information brief 
    - DO NOT make any assumptions, only write the information given provided by the transcript
    """

    user_prompt = f"""
    Extract all medical documentation from this transcript: {transcript}
    Return structured JSON data of a structured dialouge between the patient and the doctor 
    (
    Doctor: "...", 
    Patient: "...", 
    Doctor: "...",
    )"""

    try: 
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )

        extracted_data = json.loads(response.choices[0].message.content)
        return extracted_data

    except Exception as e:
        raise Exception(f"Extraction error: {str(e)}")

# recieves audio file, transcribes audio, extract data from transcript, return notes of patient visit
# http://127.0.0.1:5000/process-audio

@app.route('/process-audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    file = request.files['audio']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try: 
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        transcript = transcribe_audio(filepath)
        print(f"Transcript: {transcript}")

        print("processing transcript...")
        notes = extract_data(transcript)
        print(f"Notes: {notes}")

        os.remove(filepath)

        return jsonify({
            "sucess": True,
            "transcript": transcript,
            "notes": notes,
        }), 200

    except Exception as e: 
        if os.path.exists(filepath):
            os.remove(filepath)

        print(f"Error processing audio: {str(e)}")
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

    