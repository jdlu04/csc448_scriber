import { useState, useRef } from 'react'
import './App.css'
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState(null);
  const [isRecording, setIsRecording] = useState(false)

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav'
        });

        stream.getTracks().forEach(track => track.stop());

        processRecordedAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started...');

    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const processRecordedAudio = async (audioBlob) => {
    setLoading(true);

    try {

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      console.log('Sending recorded audio to backend...');

      const response = await axios.post(
        'http://localhost:5000/process-audio',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000,
        }
      );

      setTranscript(response.data.transcript);
      setNotes(response.data.notes);
      console.log('Audio processed successfully!');

    } catch (err) {
      console.error('Error processing recorded audio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/process-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });

      setTranscript(response.data.transcript);
      setNotes(response.data.notes);

    } catch (err) {
      console.error('Error prrocessing audio:', err);

    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setNotes({
      ...notes,
      [field]: value
    });
  };

  const subjectiveNotes = () => {
    return (
      <div>
        <div className=''>
          <p className='font-semibold'>
            Chief Complaint:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.chief_complaint}
            onChange={(e) => handleFieldChange('chief_complaint', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            History of Present Illness:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.history_of_present_illness}
            onChange={(e) => handleFieldChange('history_of_present_illness', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Onset:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.onset}
            onChange={(e) => handleFieldChange('onset', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Location:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Duration:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.duration}
            onChange={(e) => handleFieldChange('duration', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Characterization:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.characterization}
            onChange={(e) => handleFieldChange('characterization', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Alleviating or Aggravating Factors:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.alleviating_aggravating_factors}
            onChange={(e) => handleFieldChange('alleviating_aggravating_factors', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Radiation:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.radiation}
            onChange={(e) => handleFieldChange('radiation', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Temporal Factor:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.temporal_factor}
            onChange={(e) => handleFieldChange('temporal_factor', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Severity:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.severity}
            onChange={(e) => handleFieldChange('severity', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            History:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.history}
            onChange={(e) => handleFieldChange('history', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Current Medications, Allergies:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.medications_allergies}
            onChange={(e) => handleFieldChange('medications_allergies', e.target.value)}
          />
        </div>
      </div>
    )
  };

  const objectiveNotes = () => {
    return (
      <div>
        <div className=''>
          <p className='font-semibold'>
            Vital Signs:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.vital_signs}
            onChange={(e) => handleFieldChange('vital_signs', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Physical Exam Findings:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.physical_exam}
            onChange={(e) => handleFieldChange('physical_exam', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Laboratory Data:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.laboratory}
            onChange={(e) => handleFieldChange('laboratory', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Imaging Results:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.imaging_results}
            onChange={(e) => handleFieldChange('imaging_results', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Other Diagnostic Data:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.other_diagnostic_data}
            onChange={(e) => handleFieldChange('other_diagnostic_data', e.target.value)}
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Recognition and Review of the Documentation of Other Clinicians:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400'
            type='text'
            value={notes.review}
            onChange={(e) => handleFieldChange('review', e.target.value)}
          />
        </div>

      </div>
    )
  };

  const assessmentNotes = () => {
    return (
      <div>
        <div className=''>
          <p className='font-semibold'>
            Differential Diagnoses:
          </p>
          <textarea
            className='w-11/12 h-16 resize-none border rounded border-gray-400'
            type='text'
            value={notes.assessment}
            onChange={(e) => handleFieldChange('assessment', e.target.value)}
          />
        </div>
      </div>
    )
  };

  const planNotes = () => {
    return (
      <div>
        <div className=''>
          <p className='font-semibold'>
            Next Steps:
          </p>
          <textarea
            className='w-11/12 h-16 resize-none border rounded border-gray-400'
            type='text'
            value={notes.plan}
            onChange={(e) => handleFieldChange('plan', e.target.value)}
          />
        </div>
      </div>
    )
  };

  return (
    <div className='w-fill flex flex-col min-h-screen bg-[#6096BA] p-8'>
      <div className=' text-3xl text-[#E7ECEF] font-semibold'>
        Scriber
      </div>

      <p className='bg-[#E7ECEF] p-4 rounded-lg my-4 text-'>
        Click "Choose File" to import your audio file into the system to begin the process. Once a file has been selected, click "Process Audio" to transcribe and generate the structured notes. Once processed, click through the Accordion to view and to edit the following information on the left. To reference the transcript, scroll through the section on the right.
      </p>
      <div className='bg-[#E7ECEF] py-4 px-8 rounded-lg my-4'>
        {notes ? (
          <div className='w-full h-165'>
            {notes && (
              <div className='flex space-x-8'>
                <div className='w-1/2'>
                  <h className='text-lg font-semibold p-2'>SOAP Notes</h>
                  <div className='bg-white overflow-y-scroll rounded-lg h-150'>
                    <Accordion defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <h className='font-semibold text-lg'>Subjective</h>
                      </AccordionSummary>
                      <AccordionDetails>
                        {subjectiveNotes()}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <h className='font-semibold text-lg'>Objective</h>
                      </AccordionSummary>
                      <AccordionDetails>
                        {objectiveNotes()}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                      >
                        <h className='font-semibold text-lg'>Assessment</h>
                      </AccordionSummary>
                      <AccordionDetails>
                        {assessmentNotes()}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4-content"
                        id="panel4-header"
                      >
                        <h className='font-semibold text-lg'>Plan</h>
                      </AccordionSummary>
                      <AccordionDetails>
                        {planNotes()}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </div>
                <div className='w-1/2'>
                  <h className='text-lg font-semibold p-2'>Transcript</h>
                  <div className=''>
                    <div class='px-8 py-4 bg-white overflow-y-scroll rounded-lg h-150'>
                      {notes.transcript.map((line, index) => (
                        <p
                          className='py-2'
                          key={index}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-row'>
            <div className='font-semibold w-1/2 border-r border-gray-400'>
              <text className='text-lg'>
                Upload File
              </text>
              <form onSubmit={handleSubmit} className='flex flex-col'>
                <input
                  id='audio-upload'
                  type='file'
                  accept='.mp3'
                  onChange={handleFileChange}
                  className='w-75 rounded file:bg-gray-300 file:p-2 file:rounded border-gray-400 border'
                />
                <button
                  type='submit'
                  disabled={!selectedFile || loading}
                  className='bg-blue-900 w-60 text-gray-100 content center rounded py-2 my-2 in-disabled:bg-blue-200'
                >
                  {loading ? (
                    <div>
                      <CircularProgress size='14px' className='mr-2' />
                      Processing Recording
                    </div>
                  ) : (
                    <div>
                      <p>
                        Process Recording
                      </p>

                    </div>
                  )}
                </button>
              </form>
            </div>
            <div className='bg-[#E7ECEF] px-4 rounded-lg w-1/2'>
              <div className='text-lg font-semibold '>
                Record Conversation
                
              </div>
              <div className='flex gap-4'>
                <button
                  onClick={startRecording}
                  disabled={isRecording || loading}
                  className='flex items-center gap-2 bg-blue-900 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold'
                >
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className='flex items-center gap-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold'
                >

                  Stop Recording
                </button>
              </div>
              {isRecording && (
                  <span className='text-red-600 font-semibold animate-pulse'>
                    Recording in progress...
                  </span>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

