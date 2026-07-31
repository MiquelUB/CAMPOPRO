import React from 'react';

// Mock data to demonstrate functionality
const cars = [
  { id: 1, plate: '1234 ABC', model: 'Ford Transit', itvDeadline: '2026-10-15', insuranceDeadline: '2027-01-20' },
  { id: 2, plate: '5678 DEF', model: 'Peugeot Partner', itvDeadline: '2026-08-01', insuranceDeadline: '2026-12-10' },
];

const tools = [
  { id: 1, name: 'Taladre Hilti', currentHolder: 'Joan Perez' },
  { id: 2, name: 'Generador Honda', currentHolder: 'Maria Garcia' },
];

export default function FlotaDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Gestió de Flota i Eines</h1>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Vehicles (ITV i Assegurança)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cars.map(car => (
            <div key={car.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-bold">{car.plate}</h3>
              <p className="text-gray-600">{car.model}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Caducitat ITV:</span>
                  <span className={`text-sm ${new Date(car.itvDeadline) < new Date() ? 'text-red-500 font-bold' : 'text-gray-800'}`}>
                    {car.itvDeadline}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Caducitat Assegurança:</span>
                  <span className={`text-sm ${new Date(car.insuranceDeadline) < new Date() ? 'text-red-500 font-bold' : 'text-gray-800'}`}>
                    {car.insuranceDeadline}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Eines Assignades</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(tool => (
            <div key={tool.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-bold">{tool.name}</h3>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-medium">Assignat a: </span>
                {tool.currentHolder}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
