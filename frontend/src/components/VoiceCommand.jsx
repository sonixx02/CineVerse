import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { useVoice } from '../context/VoiceContext';
import { fetchVideoById, fetchVideos } from '../redux/videosSlice';

const VoiceCommand = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filteredTranscript, isListening, startListening, browserSupportsSpeechRecognition } = useVoice();

  const forbiddenWords = ['adultWord1', 'adultWord2', 'adultWord3']; 
  useEffect(() => {
    // Handle commands based on the filtered transcript
    handleVoiceCommands(filteredTranscript);
  }, [filteredTranscript, navigate, dispatch]);

  const handleVoiceCommands = (command) => {
    console.log('Received command:', command); // Debugging output
  
    // Navigation commands
    if (command.includes('dashboard')) {
      navigate('/dashboard');
    } else if (command.includes('logout')) {
      navigate('/logout');
    } else if (command.includes('history')) {
      navigate('/history');
    } else if (command.includes('admin')) {
      navigate('/admin');
    }
  
    // General search command
    else if (command.includes('search for')) {
      const titleMatch = command.match(/search for (.+)/i);
      if (titleMatch && titleMatch[1]) {
        const searchTerm = titleMatch[1].trim(); // Remove whitespace
        console.log(`Searching for: ${searchTerm}`);
  
        // Fallback for empty search term
        if (!searchTerm) {
          console.warn('No search term extracted from the command.');
          return;
        }
  
        // Debugging fetchVideos
        console.log('Dispatching fetchVideos action with search term:', searchTerm);
        dispatch(fetchVideos(searchTerm)).then((result) => {
            // Optional: Handle any additional logic after dispatching, such as showing a notification or logging the result
            if (fetchVideos.fulfilled.match(result)) {
              console.log('Videos fetched successfully:', result.payload);
            } else {
              console.error('Failed to fetch videos:', result.error);
            }
          });
        const action = fetchVideos(searchTerm); // Create the action
        console.log('Action object:', action); // Log the action object
        dispatch(action); // Fetch videos by title
      } else {
        console.warn('No valid search command found.');
      }
    }
  };
  

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {isListening ? 'on' : 'off'}</p>
      <button onClick={startListening}>Start Listening</button>
      <p>Transcript: {filteredTranscript}</p>
    </div>
  );
};

export default VoiceCommand;
