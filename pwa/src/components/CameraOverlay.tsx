'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraOverlayProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraOverlay({ onCapture, onClose }: CameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(console.error);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.error(err)
      );
    }

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add watermark (timestamp & location)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    const timestamp = new Date().toLocaleString();
    const locStr = location ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}` : 'Location unavailable';
    
    ctx.fillText(timestamp, 10, canvas.height - 35);
    ctx.fillText(locStr, 10, canvas.height - 15);

    // Convert to file
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.8);
  }, [location, onCapture]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="h-32 bg-black flex items-center justify-center space-x-8">
        <button onClick={onClose} className="text-white text-lg p-4">Cancel·lar</button>
        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-400 focus:outline-none focus:ring-4 focus:ring-primary"
        />
        <div className="w-20"></div> {/* spacer */}
      </div>
    </div>
  );
}
