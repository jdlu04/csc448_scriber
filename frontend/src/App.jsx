import { useState } from 'react'
import './App.css'
import axios from 'axios';

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

  return (
    <div className='w-screen h-screen'>
      <h>
        Scriber
      </h>
      <p>
        Click "Choose File" to select your audio file you would like summarized into notes from your system and then press "Process Recording". Once submitted, your audio file will be transcribed and summarized into structured notes
      </p>
      <div>
        {notes ? (
          <div className='w-screen h-3/4 bg-blue-100'>
            {notes && (
              <div className='flex'>
                <div className='w-1/2 h-screen'>
                  <h>
                    Subjective
                  </h>
                  <div className=''>
                    <p>
                      Chief Complaint:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.chief_complaint}
                      onChange={(e) => handleFieldChange('chief_complaint', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      History of Present Illness:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.history_of_present_illness}
                      onChange={(e) => handleFieldChange('history_of_present_illness', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Onset:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.onset}
                      onChange={(e) => handleFieldChange('onset', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Location:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.location}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Duration:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.duration}
                      onChange={(e) => handleFieldChange('duration', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Characterization:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.characterization}
                      onChange={(e) => handleFieldChange('characterization', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Alleviating or Aggravating Factors:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.alleviating_aggravating_factors}
                      onChange={(e) => handleFieldChange('alleviating_aggravating_factors', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Radiation:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.radiation}
                      onChange={(e) => handleFieldChange('radiation', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Temporal Factor:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.temporal_factor}
                      onChange={(e) => handleFieldChange('temporal_factor', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Severity:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.severity}
                      onChange={(e) => handleFieldChange('severity', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      History:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.history}
                      onChange={(e) => handleFieldChange('history', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Assessment:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.assessment}
                      onChange={(e) => handleFieldChange('assessment', e.target.value)}
                    />
                  </div>
                  <div className=''>
                    <p>
                      Plan:
                    </p>
                    <textarea
                      className='w-11/12 resize-none'
                      type='text'
                      value={notes.plan}
                      onChange={(e) => handleFieldChange('plan', e.target.value)}
                    />
                  </div>
                  <h>
                    Objective
                  </h>


                </div>
                <div class='bg-red-200 w-1/2 h-200 overflow-y-scroll'>
                  {notes.transcript.map((line, index) => (
                    <p key={index}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>
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
                    Processing Recording... (1-2 Minutes)
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

