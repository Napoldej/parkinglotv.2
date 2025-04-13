import { useState } from 'react';

interface UnparkingFormProps {
  onUnpark: (licensePlate: string) => void;
}

export default function UnparkingForm({ onUnpark }: UnparkingFormProps) {
  const [licensePlate, setLicensePlate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (licensePlate.trim()) {
      onUnpark(licensePlate.trim());
      setLicensePlate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="unparkLicensePlate" className="block text-sm font-medium text-gray-700">
          License Plate
        </label>
        <input
          type="text"
          id="unparkLicensePlate"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Unpark Vehicle
      </button>
    </form>
  );
} 