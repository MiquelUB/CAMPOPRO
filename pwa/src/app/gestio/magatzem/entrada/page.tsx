'use client';
import React, { useState } from 'react';

export default function MagatzemEntrada() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
    // Simulate AI processing
    setTimeout(() => {
      setLoading(false);
      setResult('Tiquet processat correctament: S\'han afegit els productes al magatzem.');
    }, 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Entrada de Material (IA)</h1>
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-3">
            Puja una foto del tiquet o albarà per extreure els productes automàticament:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processant...' : 'Analitzar amb IA'}
        </button>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-green-100 shadow-inner">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-6"></div>
          <p className="text-gray-600 animate-pulse font-medium text-lg">L'IA de CampoPro està analitzant el tiquet...</p>
          <p className="text-gray-400 text-sm mt-2">Extraient productes, quantitats i preus</p>
        </div>
      )}

      {result && !loading && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-sm flex items-start">
          <svg className="w-6 h-6 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-medium">{result}</span>
        </div>
      )}
    </div>
  );
}
