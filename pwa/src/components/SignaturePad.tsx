'use client';

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onClose: () => void;
}

export default function SignaturePad({ onSave, onClose }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      onSave(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-100 font-semibold text-center border-b">
          Signatura de conformitat
        </div>
        <div className="bg-white p-2" style={{ touchAction: 'none' }}>
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'w-full h-64 border rounded bg-gray-50',
            }}
          />
        </div>
        <div className="p-4 flex gap-4 bg-gray-100">
          <button 
            onClick={clear}
            className="flex-1 py-3 bg-gray-200 rounded font-medium text-gray-700"
          >
            Netejar
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-red-100 text-red-700 rounded font-medium"
          >
            Cancel·lar
          </button>
          <button 
            onClick={save}
            className="flex-1 py-3 bg-primary text-white rounded font-bold bg-green-600 hover:bg-green-700"
          >
            Desar
          </button>
        </div>
      </div>
    </div>
  );
}
