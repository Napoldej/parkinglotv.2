import { useState } from 'react';
import { VehicleSize } from '@/models/VehicleSize';
import ParkingForm from '@/components/parking/ParkingForm';
import UnparkingForm from '@/components/parking/UnparkingForm';
import VehicleForm from '@/components/parking/VehicleForm';
import ParkingStatus from '@/components/parking/ParkingStatus';
import VehicleList from '@/components/parking/VehicleList';

export default function ParkingPage() {
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handlePark = async (licensePlate: string) => {
    try {
      const response = await fetch('/api/park', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licensePlate }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Vehicle parked successfully!' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to park vehicle' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred while parking the vehicle' });
    }
  };

  const handleUnpark = async (licensePlate: string) => {
    try {
      const response = await fetch('/api/unpark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licensePlate }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Vehicle unparked successfully!' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to unpark vehicle' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred while unparking the vehicle' });
    }
  };

  const handleAddVehicle = async (licensePlate: string, vehicleSize: VehicleSize) => {
    try {
      const response = await fetch('/api/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          licensePlate, 
          size: vehicleSize 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Vehicle added successfully!' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to add vehicle' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred while adding the vehicle' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Parking Lot System</h1>
      
      {status && (
        <ParkingStatus type={status.type} message={status.message} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Vehicle</h2>
          <VehicleForm onAddVehicle={handleAddVehicle} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Park Vehicle</h2>
          <ParkingForm onPark={handlePark} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Unpark Vehicle</h2>
          <UnparkingForm onUnpark={handleUnpark} />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <VehicleList />
      </div>
    </div>
  );
} 