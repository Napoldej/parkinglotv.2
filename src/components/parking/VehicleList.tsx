import { useEffect, useState } from 'react';
import { Vehicle } from '@prisma/client';

type VehicleWithSpots = Vehicle & {
  parkedSpots: Array<{
    spotNumber: number;
    row: number;
    level: {
      floor: number;
    } | null;
  }>;
};

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<VehicleWithSpots[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatParkingLocation = (spots: VehicleWithSpots['parkedSpots']) => {
    if (!spots || spots.length === 0) return '-';

    // Group spots by floor and row
    const firstSpot = spots[0];
    const lastSpot = spots[spots.length - 1];
    const floorNumber = firstSpot.level?.floor ?? 'Unknown';

    return `Floor ${floorNumber}, Row ${firstSpot.row}, Spots ${firstSpot.spotNumber}-${lastSpot.spotNumber}`;
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicle');
        const data = await response.json();
        console.log('Vehicle data:', data); // Debug log
        
        if (response.ok) {
          setVehicles(data);
        } else {
          setError(data.message || 'Failed to fetch vehicles');
        }
      } catch (err) {
        setError('An error occurred while fetching vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div className="text-center text-lg font-medium">Loading...</div>;
  if (error) return <div className="text-red-600 text-center font-medium">{error}</div>;

  return (
    <div className="mt-4">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">Registered Vehicles</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border text-left text-lg font-bold text-gray-900">License Plate</th>
              <th className="px-6 py-3 border text-left text-lg font-bold text-gray-900">Size</th>
              <th className="px-6 py-3 border text-left text-lg font-bold text-gray-900">Status</th>
              <th className="px-6 py-3 border text-left text-lg font-bold text-gray-900">Parking Location</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border text-gray-900 font-medium">
                  {vehicle.licensePlate}
                </td>
                <td className="px-6 py-4 border text-gray-900 font-medium">
                  {vehicle.size}
                </td>
                <td className="px-6 py-4 border text-gray-900 font-medium">
                  {vehicle.parkedSpots && vehicle.parkedSpots.length > 0 ? (
                    <span className="text-green-600">Parked</span>
                  ) : (
                    <span className="text-gray-500">Not Parked</span>
                  )}
                </td>
                <td className="px-6 py-4 border text-gray-900 font-medium">
                  {formatParkingLocation(vehicle.parkedSpots)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 