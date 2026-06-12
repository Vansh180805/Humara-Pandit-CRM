import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, AlertCircle } from 'lucide-react';

const VoiceRecorder = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Audio Context references for waveform visualizer
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, []);

  const stopRecordingResources = () => {
    // Clear audio elements when unmounted
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const startRecording = async () => {
    try {
      setAudioBlob(null);
      setAudioUrl('');
      setRecordingTime(0);
      audioChunksRef.current = [];

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup AudioContext & Analyser Node for canvas waveform
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
        onAudioRecorded(audioBlob); // Pass up to form parent
        stopRecordingResources();
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start canvas waveform visualizer
      drawWaveform();

    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Could not access microphone. Ensure permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
    onAudioRecorded(null);
  };

  // Canvas visualizer logic
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!isRecording) return;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(11, 7, 30, 0.4)'; // match dark theme
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Draw symmetrical wave from middle
        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        gradient.addColorStop(0, '#f4870b'); // saffron
        gradient.addColorStop(1, '#db2777'); // pink

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height / 2 - barHeight / 2, barWidth - 2, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center space-y-4">
      <div className="w-full flex items-center justify-between">
        <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Voice Notes Recorder</h5>
        {isRecording && (
          <span className="flex items-center text-red-500 font-semibold text-xs animate-pulse">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1.5"></span>
            RECORDING ({formatTime(recordingTime)})
          </span>
        )}
      </div>

      {/* Visualizer / Waveform canvas */}
      {isRecording ? (
        <canvas 
          ref={canvasRef} 
          width="320" 
          height="80" 
          className="w-full h-20 bg-cosmic-950/60 rounded-xl border border-white/10"
        />
      ) : audioUrl ? (
        <div className="w-full bg-cosmic-950/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
          <audio src={audioUrl} controls className="w-full max-w-[220px] h-8 accent-saffron-500" />
          <button 
            type="button"
            onClick={deleteRecording}
            className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 rounded-lg transition-all"
            title="Delete Audio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full py-6 text-center bg-cosmic-950/20 rounded-xl border border-dashed border-white/10 text-xs text-slate-400 flex flex-col items-center justify-center gap-1">
          <Mic className="w-6 h-6 text-slate-500" />
          <p>Record audio summary for easy voice reminders.</p>
        </div>
      )}

      {/* Record Buttons */}
      <div className="flex justify-center">
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-red-500/20"
          >
            <Square className="w-4 h-4" />
            <span>Stop Recording</span>
          </button>
        ) : (
          !audioUrl && (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center space-x-2 bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-saffron-500/20"
            >
              <Mic className="w-4 h-4" />
              <span>Record Voice Note</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
