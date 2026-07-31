'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, CheckCircle2 } from 'lucide-react';

export default function AudioRecorder({ onAudioSent }: { onAudioSent?: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsSent(false);
      setTimeLeft(30);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('No es pot accedir al micròfon.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const sendAudio = async (blob: Blob) => {
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'incident.webm');

      const token = localStorage.getItem('token') || '';
      // Mocking the backend call since backend is not fully implemented yet
      /*
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/incidencies/audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Error enviant àudio');
      */
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSent(true);
      if (onAudioSent) onAudioSent();
    } catch (error) {
      console.error('Error sending audio:', error);
      alert("S'ha produït un error a l'enviar l'àudio.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl border border-green-200">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-green-800 text-center">Incidència enviada correctament</h3>
        <p className="text-green-600 mt-2 text-center">El sistema IA analitzarà el teu missatge aviat.</p>
        <button 
          onClick={() => setIsSent(false)}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl font-medium"
        >
          Gravar-ne una altra
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-700 mb-6">Grava un missatge de veu explicant el problema</h3>
      
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isSending}
          className={`flex items-center justify-center w-32 h-32 rounded-full shadow-lg transition-all transform active:scale-95 ${
            isRecording 
              ? 'bg-red-50 text-red-500 animate-pulse border-4 border-red-200' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          style={!isRecording ? { backgroundColor: 'var(--color-primary-600, #2563eb)' } : {}}
        >
          {isSending ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : isRecording ? (
            <Square className="w-12 h-12" fill="currentColor" />
          ) : (
            <Mic className="w-14 h-14" />
          )}
        </button>
      </div>

      {isRecording && (
        <div className="mt-6 text-center">
          <p className="text-2xl font-bold text-red-500">{timeLeft}s</p>
          <p className="text-sm text-gray-500">Gravant... Prem per aturar</p>
        </div>
      )}
      
      {!isRecording && !isSending && (
        <p className="mt-6 text-sm text-gray-500 text-center">
          Prem el micròfon per començar. Màxim 30 segons.
        </p>
      )}
      
      {isSending && (
        <p className="mt-6 text-sm text-gray-600 font-medium text-center animate-pulse">
          Processant i enviant al servidor...
        </p>
      )}
    </div>
  );
}
