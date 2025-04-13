import { useState } from 'react';
import { VehicleSize } from '@/models/VehicleSize';

interface VehicleFormProps {
  onAddVehicle: (licensePlate: string, vehicleSize: VehicleSize) => void;
}

export default function VehicleForm({ onAddVehicle }: VehicleFormProps) {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleSize, setVehicleSize] = useState<string>('Compact');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (licensePlate.trim()) {
      onAddVehicle(licensePlate.trim(), vehicleSize as VehicleSize);
      setLicensePlate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vehicleLicensePlate" className="block text-sm font-medium text-gray-700">
          License Plate
        </label>
        <input
          type="text"
          id="vehicleLicensePlate"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="vehicleSize" className="block text-sm font-medium text-gray-700">
          Vehicle Size
        </label>
        <select
          id="vehicleSize"
          value={vehicleSize}
          onChange={(e) => setVehicleSize(e.target.value as VehicleSize)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Motorcycle">Motorcycle</option>
          <option value="Compact">Compact</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Add Vehicle
      </button>
    </form>
  );
} 