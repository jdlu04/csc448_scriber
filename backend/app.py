from dotenv import load_dotenv 
import json
from openai import openai
import os

load_dotenv()

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
    except Expection as e:
        raise Exception(f"Transciption error: {str(e)}")

# using the transcript from transcribe_audio, use gpt to return a JSON of the structured doctor's notes
# input: string of the transcript 
# output: JSON formatted text   
def extract_data(transcript):
    system_prompt = """ 
    You are a medical documentation assistant. Extract structured information from doctor-patient conversation transcripts.

    Return a JSON object with these fields: 
    - transcript: Structured dialouge between the patient and the doctor (i.e. Doctor: "...", Patient: "...", Doctor: "..." )
    - cheif_complaint: Brief sentence of main reason for visit (i.e. Chest pain, decreased appetite, shortness of breath.) 
    - history_of_present_illness: Brief sentence of patient's age, sex and reason for the visit (i.e. 47-year old female presenting with abdominal pain.)
    - onset: When did the cheif complaint begin?
    - location: where is the cheif complaint located?
    - duration: How long has the cheif complaint been going on for?
    - characterization: How does the patient describe the cheif complaint?
    - alleviating_aggravating_factors: What makes the cheif complaint better? Worse?
    - radiation: Does the cheif complaint move or stay in one location?
    - temporal_factor: is the cheif complaint worse (or better) at a certain time of the day? 
    - severity: using a scale of 1 to 10, 1 being the least, 10 being the worst, how does the patient rate the cheif complaint? 
    - history: breif description of medical, surgical, family, or social history 
    - assessment: description of problems and differential dignosis (i.e.  Problem 1, Differential Diagnoses, Discussion, Plan for problem 1 (described in the plan below). Repeat for additional problems)
    - plan: details the need for additional testing and consultation with other clinicians to address the patient's illnesses. It also addresses any additional steps being taken to treat the patient. This section helps future physicians understand what needs to be done next.
    

    Keep in mind:
    - not all fields and information in the JSON format will be mentioned in the transcript, if a field is not mentioned write, "Not specified" in the field.
    - Keep all information all information brief 
    - DO NOT make any assumptions, only write the information given provided by the transcript
    """

    user_prompt: f"""
    Extract all medical documentation from this transcript: {transcript}
    Return structured JSON data of a structured dialouge between the patient and the doctor 
    (
    Doctor: "...", 
    Patient: "...", 
    Doctor: "...",
    )"""

    try: 
        response = client.chat.completion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )

        extract_data = json.loads(respose.choices[0].message.content)
        return extract_data

    except Exception as e:
        raise Exception(f"Extration error: {str(e)}")

# recieves audio file, transcribes audio, extract data from transcript, return notes of patient visit
@app.route('/process-audio', method=['POST'])
def process_audio():
    try: 
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        transcirpt = transcribe_audio(filepath)
        print(f"Transcript: {transcirpt}")

        print("processing transcirpt...")
        notes = extract_data(transcirpt)
        print(f"Notes: {notes}")

        os.remove(filepath)

        return jsonify({
            "sucess": True,
            "transcript": trancript,
            "notes": notes,
        }), 200

    except Exception as e: 
        if os.path.exists(filepath):
            os.remove(filepath)

        print(f"Error processing audio: {str(e)}")
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500



    