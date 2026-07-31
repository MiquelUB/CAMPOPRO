'use client';

import React, { useState, useEffect } from 'react';
import { Camera, PenTool, Play, Square, Pause } from 'lucide-react';
import CameraOverlay from '@/components/CameraOverlay';
import SignaturePad from '@/components/SignaturePad';
import { addToSyncQueue, saveFeinaOffline, getFeinaOffline } from '@/lib/idb';

export default function OperariFeinaPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<'pendent' | 'en_curs' | 'pausada' | 'finalitzada'>('pendent');
  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  
  useEffect(() => {
    // Load offline state if available
    getFeinaOffline(params.id).then(feina => {
      if (feina) {
        setStatus(feina.status || 'pendent');
        setPhotos(feina.photos || []);
        setSignature(feina.signature || null);
      }
    });
  }, [params.id]);

  const updateState = async (newState: typeof status) => {
    setStatus(newState);
    
    const feinaData = { id: params.id, status: newState, photos, signature };
    await saveFeinaOffline(feinaData);

    await addToSyncQueue({
      url: `/api/v1/feines_operari/${params.id}/status`,
      method: 'POST',
      body: { status: newState },
    });
  };

  const handlePhotoCaptured = async (file: File) => {
    setShowCamera(false);
    const photoUrl = URL.createObjectURL(file);
    const newPhotos = [...photos, photoUrl];
    setPhotos(newPhotos);
    
    await saveFeinaOffline({ id: params.id, status, photos: newPhotos, signature });

    const formData = new FormData();
    formData.append('file', file);
    
    await addToSyncQueue({
      url: `/api/v1/feines_operari/${params.id}/foto`,
      method: 'POST',
      body: formData, // FormData will be serialized or stored properly in IDB
    });
  };

  const handleSignatureSaved = async (sigData: string) => {
    setShowSignature(false);
    setSignature(sigData);
    
    await saveFeinaOffline({ id: params.id, status, photos, signature: sigData });

    await addToSyncQueue({
      url: `/api/v1/feines_operari/${params.id}/signatura`,
      method: 'POST',
      body: { signature: sigData },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 space-y-6">
      <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-black text-gray-900">Feina #{params.id}</h1>
        <p className="text-gray-500 mt-2 text-lg">Client: Finca Mestra</p>
        <div className="mt-4 inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
          Estat: {status.replace('_', ' ').toUpperCase()}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 flex-1">
        {status === 'pendent' || status === 'pausada' ? (
          <button 
            onClick={() => updateState('en_curs')}
            className="w-full bg-green-500 active:bg-green-600 text-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <Play size={64} className="mb-4" />
            <span className="text-3xl font-black">INICIAR</span>
          </button>
        ) : status === 'en_curs' ? (
          <>
            <button 
              onClick={() => updateState('pausada')}
              className="w-full bg-yellow-500 active:bg-yellow-600 text-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <Pause size={64} className="mb-4" />
              <span className="text-3xl font-black">PAUSAR</span>
            </button>
            <button 
              onClick={() => updateState('finalitzada')}
              className="w-full bg-red-500 active:bg-red-600 text-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <Square size={64} className="mb-4" />
              <span className="text-3xl font-black">FINALITZAR</span>
            </button>
          </>
        ) : (
          <div className="bg-gray-200 p-8 rounded-3xl flex flex-col items-center justify-center text-gray-500">
            <span className="text-2xl font-bold">FEINA COMPLETADA</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowCamera(true)}
          className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-700 active:bg-gray-50"
        >
          <Camera size={40} className="mb-2" />
          <span className="font-bold text-lg">FOTO</span>
        </button>
        <button 
          onClick={() => setShowSignature(true)}
          className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-700 active:bg-gray-50"
        >
          <PenTool size={40} className="mb-2" />
          <span className="font-bold text-lg">SIGNAR</span>
        </button>
      </div>

      {photos.length > 0 && (
        <div className="bg-white p-4 rounded-2xl">
          <h3 className="font-bold mb-2">Fotos ({photos.length})</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((src, i) => (
              <img key={i} src={src} className="h-20 w-20 object-cover rounded-lg" alt="Foto feina" />
            ))}
          </div>
        </div>
      )}

      {signature && (
        <div className="bg-white p-4 rounded-2xl">
          <h3 className="font-bold mb-2">Signatura</h3>
          <img src={signature} className="h-24 bg-gray-50 border rounded-lg w-full object-contain" alt="Signatura" />
        </div>
      )}

      {showCamera && (
        <CameraOverlay onCapture={handlePhotoCaptured} onClose={() => setShowCamera(false)} />
      )}

      {showSignature && (
        <SignaturePad onSave={handleSignatureSaved} onClose={() => setShowSignature(false)} />
      )}
    </div>
  );
}
