"use client";

import { useState } from "react";

type Point2D = { x: number; y: number };

export default function PlanolOverlay() {
  const [pdfPoints, setPdfPoints] = useState<Point2D[]>([]);
  const [mapPoints, setMapPoints] = useState<Point2D[]>([]);
  const [step, setStep] = useState<"pdf" | "map" | "done">("pdf");

  const handlePdfClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== "pdf") return;
    
    // Simplification: getting relative coords inside the div
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPoints = [...pdfPoints, { x, y }];
    setPdfPoints(newPoints);
    
    if (newPoints.length === 3) {
      setStep("map");
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== "map") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPoints = [...mapPoints, { x, y }];
    setMapPoints(newPoints);
    
    if (newPoints.length === 3) {
      setStep("done");
    }
  };

  const reset = () => {
    setPdfPoints([]);
    setMapPoints([]);
    setStep("pdf");
  };

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">
          Per georeferenciar el plànol, cal que seleccionis 3 punts en el plànol i els mateixos 3 punts en el mapa.
        </p>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs rounded ${step === "pdf" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
            1. Plànol ({pdfPoints.length}/3)
          </span>
          <span className={`px-2 py-1 text-xs rounded ${step === "map" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
            2. Mapa ({mapPoints.length}/3)
          </span>
          <span className={`px-2 py-1 text-xs rounded ${step === "done" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}>
            3. Alinear
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded p-2 bg-white relative">
          <div className="text-center mb-2 font-medium text-gray-600 text-sm">Plànol (PDF)</div>
          <div 
            onClick={handlePdfClick}
            className={`w-full h-48 bg-gray-100 rounded relative cursor-crosshair ${step !== "pdf" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm select-none pointer-events-none">
              Fes clic per afegir punts
            </div>
            {pdfPoints.map((p, i) => (
              <div 
                key={i} 
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white -ml-2 -mt-2 flex items-center justify-center text-[10px] text-white font-bold pointer-events-none"
                style={{ left: p.x, top: p.y }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded p-2 bg-white relative">
          <div className="text-center mb-2 font-medium text-gray-600 text-sm">Mapa (Leaflet)</div>
          <div 
            onClick={handleMapClick}
            className={`w-full h-48 bg-blue-50 rounded relative cursor-crosshair ${step !== "map" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="absolute inset-0 flex items-center justify-center text-blue-400 text-sm select-none pointer-events-none">
              {step === "pdf" ? "Esperant punts del plànol..." : "Fes clic per afegir punts"}
            </div>
            {mapPoints.map((p, i) => (
              <div 
                key={i} 
                className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white -ml-2 -mt-2 flex items-center justify-center text-[10px] text-white font-bold pointer-events-none"
                style={{ left: p.x, top: p.y }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {step === "done" && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
          <div className="text-sm text-green-800">
            <strong>✅ Punts alineats correctament.</strong> Plànol llest per sobreposar.
          </div>
          <button onClick={reset} className="text-sm text-green-700 underline">Reiniciar</button>
        </div>
      )}
    </div>
  );
}
