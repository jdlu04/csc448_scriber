import { useState } from 'react'
import './App.css'
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState(null);

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
      setError(
        err.response?.data?.error ||
        'Failed to process audio'
      );

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
            className='w-11/12 h-8 resize-none border rounded border-gray-400 border rounded border-gray-400'
            type='text'
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Physical Exam Findings:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400 border rounded border-gray-400'
            type='text'
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Laboratory Data:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400 border rounded border-gray-400'
            type='text'
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Imaging Results:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400 border rounded border-gray-400'
            type='text'
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Other Diagnostic Data:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400 border rounded border-gray-400'
            type='text'
          />
        </div>
        <div className=''>
          <p className='font-semibold'>
            Recognition and Review of the Documentation of Other Clinicians:
          </p>
          <textarea
            className='w-11/12 h-8 resize-none border rounded border-gray-400 border rounded border-gray-400'
            type='text'
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
      <h className=' text-3xl text-[#E7ECEF] font-semibold'>
        Scriber
      </h>
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
          <p className='font-semibold'>
            <form onSubmit={handleSubmit}>
              <input
                id='audio-upload'
                type='file'
                accept='.mp3'
                onChange={handleFileChange}
                className='bg-blue-50'
              />
              <button
                type='submit'
                disabled={!selectedFile || loading}
                className='bg-amber-200'
              >
                {loading ? (
                  <div>
                    Processing Recording... (30-60 Seconds)
                  </div>
                ) : (
                  'Process Recording'
                )}
              </button>
            </form>
          </p>
        )}
      </div>
    </div>
  )
}

export default App

