// src/context/VoiceContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [filteredTranscript, setFilteredTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const forbiddenWords = ['adultWord1', 'adultWord2', 'adultWord3'];

  useEffect(() => {
    if (transcript) {
      const filtered = forbiddenWords.reduce((acc, word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        return acc.replace(regex, '*'.repeat(word.length));
      }, transcript);
      setFilteredTranscript(filtered);
    }
  }, [transcript]);

  const startListening = () => {
    SpeechRecognition.startListening();
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  return (
    <VoiceContext.Provider value={{ 
      filteredTranscript, 
      isListening, 
      startListening, 
      stopListening,
      browserSupportsSpeechRecognition
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
